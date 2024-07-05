import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class OrganizationType {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
