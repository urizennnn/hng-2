import { Organization } from '../typeorm/entities/Organisation/org';
import { User } from '../typeorm/entities/user/user';
import { Injectable, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLogin, UserRegister } from '../users/user.dto';
import { comparePassword, hashPassword } from '../../utils/helper';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>
  ) { }

  async register(userDetails: UserRegister): Promise<User> {
    try {
      const existingUser = await this.userRepo.findOne({ where: { email: userDetails.email } });
      if (existingUser) {
        throw new UnprocessableEntityException('Email already exists');
      }

      userDetails.password = await hashPassword(userDetails.password);

      const newUser = this.userRepo.create(userDetails);
      await this.userRepo.save(newUser);

      const organization = this.orgRepo.create({
        name: `${userDetails.firstName}'s Organisation`,
        users: [newUser],
      });

      await this.orgRepo.save(organization);

      return newUser;
    } catch (err) {
      throw err || new UnprocessableEntityException({ errors: [err.message] });
    }
  }

  async login(loginDetails: UserLogin): Promise<User> {
    try {
      const user = await this.userRepo.findOne({ where: { email: loginDetails.email } });
      if (!user || !(await comparePassword(loginDetails.password, user.password))) {
        throw new BadRequestException('Invalid email or password');
      }
      return user;
    }
    catch (err) {
      throw err || new BadRequestException({ errors: [err.message] });
    }
  }
}

