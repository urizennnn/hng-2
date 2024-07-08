import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '@entity/Organisation/org';
import { User } from '@entity/user/user';
import { CreateOrgDto } from './org.dto';

@Injectable()
export class OrgService {
  constructor(
    @InjectRepository(Organization) private readonly orgRepo: Repository<Organization>,
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) { }
  async getOrgs(email: string): Promise<Organization[]> {
    try {
      const user = await this.userRepo.findOne({
        where: { email },
        relations: ['organizations'],
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user.organizations;
    } catch (err) {
      throw new Error('Failed to fetch organizations');
    }
  }

  async getOrgById(orgId: string): Promise<Organization> {
    const org = await this.orgRepo.findOne({ where: { orgId } });

    if (!org) {
      throw new Error('Organization not found');
    }

    return org;
  }

  async createOrg(orgDetails: CreateOrgDto, userEmail: string): Promise<Organization> {
    const user = await this.userRepo.findOne({ where: { email: userEmail } });
    if (!user) {
      throw new Error('User not found');
    }

    const org = this.orgRepo.create({
      name: orgDetails.name,
      description: orgDetails.description,
      users: [user],
    })
    await this.orgRepo.save(org);
    return org;
  }

  async addUserToOrg(orgId: string, userId: string): Promise<Organization> {
    const org = await this.orgRepo.findOne({ where: { orgId }, relations: ['users'] });
    const user = await this.userRepo.findOne({ where: { userId } });

    if (!org || !user) {
      throw new Error('Organization or user not found');
    }

    org.users.push(user);
    await this.orgRepo.save(org);
    return org;
  }
}

