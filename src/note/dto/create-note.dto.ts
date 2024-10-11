import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateNoteDto {
  @ApiHideProperty()
  @IsOptional()
  owner: Types.ObjectId;

  @ApiProperty()
  @IsString()
  text: string;
}
