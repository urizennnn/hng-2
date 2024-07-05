import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import util from "util"
import { InjectRepository } from '@nestjs/typeorm';
import { UserLogin, UserType } from '@user/user.dto';
import { User } from '@entity/user/user';
import { comparePassword, hashPassword } from '@utils/helper';
import { OrganizationType } from '@organisation/org.dto';
import { Organization } from '@entity/Organisation/org';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>
  ) { }

  async getResponse(): Promise<string> {
    return "Hello World!";
  }

  async register(details: UserType): Promise<User> {

    const errors = await validate(details);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    try {
      details.password = await hashPassword(details.password);

      const orgDetails: OrganizationType = {
        name: `${details.firstName}'s Organisation`,
      };

      const user = this.userRepo.create(details);
      await this.userRepo.save(user);

      const org = this.orgRepo.create(orgDetails);
      org.users = [user];
      await this.orgRepo.save(org);
      return user
    } catch (error) {
      console.error('Registration error:', error);
      throw new InternalServerErrorException('Registration failed');
    }
  }


  async login(details: UserLogin): Promise<User> {
    try {
      const user = await this.userRepo.findOne({ where: { email: details.email } })
      if (!user) {
        throw new BadRequestException('Invalid email');
      }

      const isValid = await comparePassword(details.password, user.password);

      if (!isValid) {
        throw new BadRequestException('Invalid password');
      }

      return user;
    } catch (error) {
      console.error(error);
      throw error
    }
  }
}
