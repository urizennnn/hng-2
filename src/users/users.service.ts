import { Organization } from "../typeorm/entities/Organisation/org"
import { User } from '../typeorm/entities/user/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Organization) private readonly orgRepo: Repository<Organization>
  ) { }

  async getUserById(id: string, email: string): Promise<User> {
    try {
      const user = await this.userRepo.findOne({ where: { email }, relations: ['organizations'] });
      for (const org of user.organizations) {
        const organization = await this.orgRepo.findOne({
          where: { orgId: org.orgId },
          relations: ['users']
        });

        if (organization && organization.users.some(u => u.userId === id)) {
          return user;
        }
      }

    } catch (error) {
      console.error(error);
    }
  }
}
