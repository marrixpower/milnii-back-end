import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

import { GeoPointDto } from 'src/common/dto/geo.dto';
import { toObjectId, toPhoneNumber } from 'src/common/transform';

export class CreateBusinessDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  name: string;

  @ApiHideProperty()
  @IsOptional()
  owner: Types.ObjectId;

  @ApiProperty({ type: String })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  address: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  city: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  postalCode: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  @Transform(toPhoneNumber)
  phone: string;

  @IsOptional()
  @Transform(toObjectId)
  @ApiProperty({ type: String })
  category: Types.ObjectId;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  site: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  booking: string;

  @IsOptional()
  @ApiProperty()
  images: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  description: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number })
  price: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => GeoPointDto)
  @ValidateNested()
  location?: GeoPointDto;
}
