import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';

import { TranslateDto } from 'src/common/dto/translate.dto';

export class CreateCategoryDto {
  @ApiProperty()
  @IsArray()
  @Type(() => TranslateDto)
  @ValidateNested({ each: true })
  name: TranslateDto[];

  @ApiProperty()
  @IsOptional()
  image?: string;
}
