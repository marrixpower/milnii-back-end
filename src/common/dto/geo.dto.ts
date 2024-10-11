import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';

import { IsValidCoordinates } from '../validator/valid-coordinates';

export class GeoPointDto {
  @ApiProperty({ default: 'Point' })
  @IsString()
  type: string = 'Point';

  @ApiProperty({
    minItems: 2,
    maxItems: 2,
    description: 'array of two elements [longitude, latitude]',
    type: Number,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsValidCoordinates()
  coordinates: number[];
}
