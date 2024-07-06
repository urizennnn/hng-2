import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Organization } from '@entity/Organisation/org';
import { OrgController } from './org.controller';
import { OrgService } from './org.service';
import { User } from '@entity/user/user';
import { JwtAuth } from 'src/middleware/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET as string,
      signOptions: {
        expiresIn: process.env.JWT_LIMIT as string
      },
    }), TypeOrmModule.forFeature([Organization, User]),
  ],
  providers: [OrgService, JwtAuth],
  controllers: [OrgController]
})
export class OrgModule { }
