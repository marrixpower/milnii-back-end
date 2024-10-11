import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

import { SupportStatusEnum } from '../enum/status.enum';
export type SupportDocument = Support & Document;

@Schema({ timestamps: true, collection: Support.name })
export class Support {
  @Prop({ default: 0 })
  @ApiProperty()
  increment: number;

  @Prop({ type: String, required: false })
  @ApiProperty({ type: String })
  name?: string;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String })
  message?: string;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String })
  email?: string;

  @Prop()
  @ApiProperty()
  device?: string;

  @Prop()
  @ApiProperty()
  osVersion: string;

  @Prop()
  @ApiProperty()
  permissions: string[];

  @Prop({ default: SupportStatusEnum.NOT_PROCESSED, enum: SupportStatusEnum })
  @ApiProperty({ enum: SupportStatusEnum })
  status?: SupportStatusEnum;
}

export const SupportSchema = SchemaFactory.createForClass(Support);
