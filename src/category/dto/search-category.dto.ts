import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchCategoryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;
}
