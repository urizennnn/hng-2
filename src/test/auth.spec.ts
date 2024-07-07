import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/user/user';
import { Organization } from '../typeorm/entities/Organisation/org';
import { JwtAuth } from '../middleware/jwt';
import { UnprocessableEntityException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import * as helper from '../../utils/helper';
import { UserRegister } from '../users/user.dto';

describe('AuthService and AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;
  let userRepo: any;
  let orgRepo: any;
  let jwtAuth: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtAuth,
          useValue: {
            SendCookie: jest.fn(),
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
    userRepo = module.get(getRepositoryToken(User));
    orgRepo = module.get(getRepositoryToken(Organization));
    jwtAuth = module.get<JwtAuth>(JwtAuth);
  });

  describe('register', () => {
    it('should register user successfully with default organisation', async () => {
      const userDetails: UserRegister = {
        firstName: "John",
        lastName: "Akaaha",
        email: "test@gmail.com",
        password: "stringer",
        phone: "07041386799"
      };
      const hashedPassword = 'hashedPassword123';
      const newUser = { ...userDetails, userId: '1', password: hashedPassword };
      const accessToken = 'mockAccessToken';

      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue(newUser);
      userRepo.save.mockResolvedValue(newUser);
      orgRepo.create.mockReturnValue({ name: "John's Organisation", users: [newUser] });
      orgRepo.save.mockResolvedValue({ id: '1', name: "John's Organisation", users: [newUser] });
      jwtAuth.SendCookie.mockReturnValue(accessToken);

      jest.spyOn(helper, 'hashPassword').mockResolvedValue(hashedPassword);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await authController.register(mockResponse, userDetails);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email: userDetails.email } });
      expect(userRepo.create).toHaveBeenCalledWith({ ...userDetails, password: hashedPassword });
      expect(userRepo.save).toHaveBeenCalledWith(newUser);
      expect(orgRepo.create).toHaveBeenCalledWith({
        name: "John's Organisation",
        users: [newUser],
      });
      expect(orgRepo.save).toHaveBeenCalled();
      expect(jwtAuth.SendCookie).toHaveBeenCalledWith({ email: newUser.email }, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        message: "Registration successful",
        data: {
          accessToken,
          user: newUser,
        },
      });
    });

    it('should fail if email already exists', async () => {
      const userDetails = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'password123',
      };

      userRepo.findOne.mockResolvedValue({ email: userDetails.email });

      await expect(authService.register(userDetails)).rejects.toThrow(UnprocessableEntityException);
    });

    it('should fail if required fields are missing', async () => {
      const incompleteUserDetails = {
        firstName: 'John',
        lastName: 'Doe',
        // email: "test@gmail.com",
        password: 'password123',
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await authController.register(mockResponse, incompleteUserDetails as any);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        status: "Bad request",
        message: "Registration failed",
      }));
    });
  });

  describe('login', () => {
    it('should log in user successfully', async () => {
      const loginDetails = {
        email: 'john@example.com',
        password: 'password123',
      };
      const user = { ...loginDetails, id: '1' };
      const accessToken = 'mockAccessToken';

      userRepo.findOne.mockResolvedValue(user);
      jest.spyOn(helper, 'comparePassword').mockResolvedValue(true);
      jwtAuth.SendCookie.mockReturnValue(accessToken);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await authController.login(mockResponse, loginDetails);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email: loginDetails.email } });
      expect(jwtAuth.SendCookie).toHaveBeenCalledWith({ email: user.email }, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        message: "Login successful",
        data: {
          accessToken,
          user,
        },
      });
    });

    it('should fail with invalid credentials', async () => {
      const loginDetails = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      userRepo.findOne.mockResolvedValue(null);

      await expect(authService.login(loginDetails)).rejects.toThrow(BadRequestException);
    });
  });
});
