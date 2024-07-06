import { Module } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    }),
    TypeOrmModule.forFeature([User, Organization]),
  ],
  providers: [AuthService, JwtAuth],
  controllers: [AuthController]
})
export class AuthModule { }
