import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TranslateDto {
  @ApiProperty({
    description:
      'ISO 639-1 Code (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)',
  })
  @IsString()
  lang: string;

  @ApiProperty({ description: 'translated content' })
  @IsString()
  value: string;
}
