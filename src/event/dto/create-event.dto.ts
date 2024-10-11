import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { EventTypeEnum } from '../enum/event-type.enum';

export class CreateEventDto {
  @ApiHideProperty()
  @IsOptional()
  owner: Types.ObjectId;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEnum(EventTypeEnum)
  group: EventTypeEnum;

  @ApiProperty()
  @IsNumber()
  maxGuests: number;
}
