import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { GuestAgeEnum } from '../enum/age.enum';

export class PersonDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: GuestAgeEnum })
  @IsString()
  @IsEnum(GuestAgeEnum)
  age: GuestAgeEnum;
}

