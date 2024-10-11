import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

import { toObjectId } from 'src/common/transform';

import { GuestStatusEnum } from '../enum/status.enum';

import { PersonDto } from './person.dto';

export class CreateGuestDto {
  @ApiHideProperty()
  @IsOptional()
  owner: Types.ObjectId;

  @ApiProperty({ type: PersonDto, isArray: true })
  @IsArray()
  @Type(() => PersonDto)
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  persons: PersonDto[];

  @ApiProperty()
  @IsArray()
  @Transform(toObjectId)
  invites: Types.ObjectId[];

  @ApiProperty({ type: String })
  @Transform(toObjectId)
  @IsDefined()
  group: Types.ObjectId;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ enum: GuestStatusEnum })
  @IsString()
  @IsEnum(GuestStatusEnum)
  status: GuestStatusEnum;
}
