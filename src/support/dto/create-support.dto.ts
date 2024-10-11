import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateSupportDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: true })
  @IsString()
  message: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  device?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  osVersion?: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  permissions: string[];
}
