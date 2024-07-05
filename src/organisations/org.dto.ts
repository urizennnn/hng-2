import { IsUUID, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class OrganizationType {
  @IsUUID()
  @IsNotEmpty()
  orgId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
