import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { toObjectId } from 'src/common/transform';

import { VerificationStatusEnum } from '../enum/verification-status.enum';

export class BusinessSearchDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @Transform(toObjectId)
  owner?: Types.ObjectId;

  @ApiProperty()
  @IsOptional()
  @Transform(toObjectId)
  category?: Types.ObjectId;

  @ApiProperty()
  @IsOptional()
  @IsEnum(VerificationStatusEnum)
  status: VerificationStatusEnum;
}
