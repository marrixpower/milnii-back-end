import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

import { SupportStatusEnum } from '../enum/status.enum';

import { CreateSupportDto } from './create-support.dto';

export class UpdateSupportDto extends PartialType(CreateSupportDto) {
  @ApiProperty({ type: String, enum: SupportStatusEnum })
  @IsOptional()
  @IsEnum(SupportStatusEnum)
  status?: SupportStatusEnum;
}

