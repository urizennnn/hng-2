import { Organization } from '@entity/Organisation/org';
import { User } from '@entity/user/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>, @InjectRepository(Organization) private readonly orgRepo: Repository<Organization>) { }

  async getUserById(id: string, email: string): Promise<User> {
    try {

      const user = await this.userRepo.findOne({ where: { email } })
      const org = user.organizations
      for (let i = 0; i < org.length; i++) {
        const orgIndex = await this.orgRepo.findOne({ where: { orgId: org[i].orgId } })
        const orgFound = orgIndex.users.find(user => user.userId === id)
        if (orgFound) {
          return user
        }
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch user')
    }
  }
}
