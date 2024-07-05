import { IsUUID, IsString, IsNotEmpty, IsEmail, MinLength, IsPhoneNumber } from 'class-validator';

export class UserType {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsPhoneNumber()
  phone: string;
}
