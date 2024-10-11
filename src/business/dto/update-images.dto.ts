import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateImagesDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  images?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  oldImages?: string[];
}
