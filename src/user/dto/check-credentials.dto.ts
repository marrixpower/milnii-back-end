import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

import { toPhoneNumber } from 'src/common/transform';

export class CheckCredentialsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(toPhoneNumber)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  firebaseId?: string;
}
