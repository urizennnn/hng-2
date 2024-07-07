import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuth } from '../middleware/jwt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/user/user';
import { Organization } from '../typeorm/entities/Organisation/org';


describe('JwtAuth', () => {
  let jwtAuth: JwtAuth;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuth,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    jwtAuth = module.get<JwtAuth>(JwtAuth);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('SignJWt', () => {
    it('should generate a token with correct expiration and user details', () => {
      const payload = { email: 'test@example.com' };
      const mockToken = 'mock.jwt.token';
      const mockExpirationTime = '15m';

      process.env.JWT_SECRET = 'test-secret';
      process.env.JWT_LIMIT = mockExpirationTime;

      (jwtService.sign as jest.Mock).mockReturnValue(mockToken);

      const result = jwtAuth.SignJWt(payload);

      expect(result).toBe(mockToken);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { user: payload },
        {
          secret: 'test-secret',
          expiresIn: mockExpirationTime,
        }
      );
    });
  });

  describe('SendCookie', () => {
    it('should set cookies with correct expiration', () => {
      const payload = { email: 'test@example.com' };
      const mockToken = 'mock.jwt.token';
      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      jest.spyOn(jwtAuth, 'SignJWt').mockReturnValue(mockToken);

      const result = jwtAuth.SendCookie(payload, mockResponse);

      expect(result).toBe(mockToken);
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'accessToken',
        mockToken,
        expect.objectContaining({
          maxAge: 15 * 60 * 1000,
        })
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockToken,
        expect.objectContaining({
          expires: expect.any(Date),
        })
      );
    });
  });
});

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepo: jest.Mocked<any>;
  let orgRepo: jest.Mocked<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(User));
    orgRepo = module.get(getRepositoryToken(Organization));
  });

  describe('getUserById', () => {
    it('should return user when user has access to the organization', async () => {
      const mockUser = {
        email: 'test@example.com',
        organizations: [{ orgId: 'org1' }],
      };
      const mockOrg = {
        orgId: 'org1',
        users: [{ userId: 'user1' }],
      };

      userRepo.findOne.mockResolvedValue(mockUser);
      orgRepo.findOne.mockResolvedValue(mockOrg);

      const result = await usersService.getUserById('user1', 'test@example.com');

      expect(result).toEqual(mockUser);
    });

    it('should return undefined when user does not have access to the organization', async () => {
      const mockUser = {
        email: 'test@example.com',
        organizations: [{ orgId: 'org1' }],
      };
      const mockOrg = {
        orgId: 'org1',
        users: [{ userId: 'user2' }],
      };

      userRepo.findOne.mockResolvedValue(mockUser);
      orgRepo.findOne.mockResolvedValue(mockOrg);

      const result = await usersService.getUserById('user1', 'test@example.com');

      expect(result).toBeUndefined();
    });
  });
});
