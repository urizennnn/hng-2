import { Organization } from '@entity/Organisation/org';
import { User } from '@entity/user/user';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLogin, UserRegister } from '@user/user.dto';
import { comparePassword, hashPassword } from '@utils/helper';
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
    const existingUser = await this.userRepo.findOne({ where: { email: userDetails.email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
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
  }

  async login(loginDetails: UserLogin): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email: loginDetails.email } });
    if (!user || !(await comparePassword(loginDetails.password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }
    return user;
  }
}

