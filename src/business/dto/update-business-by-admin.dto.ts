import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

import { VerificationStatusEnum } from '../enum/verification-status.enum';

import { CreateBusinessDto } from './create-business.dto';

export class UpdateBusinessByAdminDto extends PartialType(CreateBusinessDto) {
  @ApiProperty({ enum: VerificationStatusEnum })
  @IsOptional()
  @IsEnum(VerificationStatusEnum)
  status: VerificationStatusEnum;
}
