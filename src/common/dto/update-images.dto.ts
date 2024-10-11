import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateImagesDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    isArray: true,
  })
  @IsOptional()
  images?: string[];

  @ApiProperty()
  @IsOptional()
  oldImages?: string[];
}
