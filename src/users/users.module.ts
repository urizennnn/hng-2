import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '@entity/user/user';
import { Organization } from '@entity/Organisation/org';
import { JwtAuth } from 'src/middleware/jwt';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET as string,
      signOptions: {
        expiresIn: process.env.JWT_LIMIT as string
      },
    }), TypeOrmModule.forFeature([User, Organization]),
  ],
  providers: [UsersService, JwtAuth],
  controllers: [UsersController],
})
export class UsersModule { }







