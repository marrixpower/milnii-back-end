import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { toObjectId } from 'src/common/transform/to-object-id';

import { FavoriteTypeEnum } from '../enum/favorite-type.enum';

export class CreateFavoriteDto {
  @ApiHideProperty()
  @IsOptional()
  owner: Types.ObjectId;

  @ApiProperty({ type: String })
  @Transform(toObjectId)
  @IsDefined()
  favorite: Types.ObjectId;

  @ApiProperty()
  @IsEnum(FavoriteTypeEnum)
  @IsString()
  type: FavoriteTypeEnum;
}
