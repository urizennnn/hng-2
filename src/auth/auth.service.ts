import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserType } from '@user/user.dto';
import { User } from '@entity/user/user';
import { v4 as uuidv4 } from 'uuid';
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


  async login(email: string, password: string): Promise<User> {
    try {
      const user = await this.userRepo.findOne({ where: { email } })
      console.log(`${user}`);
      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }

      const isValid = await comparePassword(password, user.password);

      if (!isValid) {
        throw new BadRequestException('Invalid email or password');
      }

      return user;
    } catch (error) {
      console.error(error);
    }
  }
}
