import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Organization } from '../typeorm/entities/Organisation/org';
import { UsersService } from '../users/users.service';
import { User } from '../typeorm/entities/user/user';

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
