import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { UserTypeEnum } from '../enum/user-type.enum';

export class UserSearchDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: UserTypeEnum })
  @IsString()
  @IsOptional()
  @IsEnum(UserTypeEnum)
  type?: UserTypeEnum;
}
