import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class OrganizationType {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateOrgDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;
}

export class AddUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
