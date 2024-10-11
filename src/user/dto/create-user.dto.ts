import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

import { toDate, toPhoneNumber } from 'src/common/transform';
import { IsValidPhoneNumber } from 'src/common/validator/valid-phone-number';

import { UserRoleEnum } from '../enum/user-role.enum';
import { UserTypeEnum } from '../enum/user-type.enum';

export class CreateUserDto {
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  firebaseId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  name?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  partner: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @Transform(toPhoneNumber)
  @IsValidPhoneNumber()
  phone: string;

  @ApiProperty({ type: String, enum: UserTypeEnum })
  @IsOptional()
  @IsString()
  @IsEnum(UserTypeEnum)
  type: UserTypeEnum;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsDate()
  @Transform(toDate)
  weddingDate?: Date;

  @ApiProperty({ type: String, enum: UserRoleEnum })
  @IsOptional()
  @IsString()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;
}
