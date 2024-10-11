import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

import { toDate } from 'src/common/transform';

import { SupportStatusEnum } from '../enum/status.enum';

export class SearchSupportDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ type: String, isArray: true, enum: SupportStatusEnum })
  @IsOptional()
  @IsEnum(SupportStatusEnum, { each: true })
  @IsArray()
  status?: SupportStatusEnum[];

  @IsDate()
  @ApiProperty()
  @IsOptional()
  @Transform(toDate)
  createdStart?: Date;

  @IsDate()
  @ApiProperty()
  @Transform(toDate)
  @IsOptional()
  createdEnd?: Date;
}
