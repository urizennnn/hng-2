import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entity/user/user';
import { Organization } from '@entity/Organisation/org';
import { UsersModule } from '@user/users.module';
import { RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@auth/auth.module';
import { OrgModule } from '@organisation/org.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RouterModule.register([
      {
        path: '/',
        module: AuthModule,
      },
      {
        path: '/api/users',
        module: UsersModule,
      },
      {
        path: '/api/organisations',
        module: OrgModule,
      },
    ]), TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          type: "postgres",
          host: process.env.PG_HOST,
          username: process.env.PG_USER,
          password: process.env.PG_PASSWORD,
          port: +process.env.PG_PORT,
          database: process.env.PG_DB,
          entities: [User, Organization],
          synchronize: process.env.NODE_ENV === 'production' ? false : true,
          ssl: {
            rejectUnauthorized: true,
            sslmode: process.env.PG_SSLMODE,
          },
          logging: true,
          logger: "debug"
        }
      }
    }),
    UsersModule,
    OrgModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
