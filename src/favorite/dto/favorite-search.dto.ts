import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { toObjectId } from 'src/common/transform';

import { FavoriteTypeEnum } from '../enum/favorite-type.enum';

export class FavoriteSearchDto {
  @ApiHideProperty()
  @IsOptional()
  owner?: Types.ObjectId;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEnum(FavoriteTypeEnum)
  type?: FavoriteTypeEnum;

  @ApiProperty({ type: String })
  @Transform(toObjectId)
  @IsOptional()
  category?: Types.ObjectId;
}
