import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserType } from '@user/user.dto';
import { User } from '@entity/user/user';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '@utils/helper'
import { OrganizationType } from '@organisation/org.dto';
import { Organization } from '@entity/Organisation/org';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>, @InjectRepository(Organization) private readonly orgRepo: Repository<Organization>) { }
  async getResponse() {
    return "Hello World!"
  }

  async register(details: UserType) {
    try {
      details.password = await hashPassword(details.password);
      const org_details: OrganizationType = {
        name: `${details.firstName}'s Organisation`,
        orgId: uuidv4().slice(0, 8)
      }
      const user = this.userRepo.create(details);
      await this.userRepo.save(user);
      const org = this.orgRepo.create(org_details)
      org.users = [user]
      await this.orgRepo.save(org);
    } catch (error) {
      console.error(error);
    }
  }
}
