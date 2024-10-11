import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

import { GuestStatusEnum } from '../enum/status.enum';

import { Person, PersonSchema } from './person';

export type GuestDocument = Guest & Document;

@Schema({ timestamps: true, collection: Guest.name })
export class Guest {
  @ApiProperty({ type: String, required: true })
  _id?: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop()
  owner: Types.ObjectId;

  @ApiProperty({ type: Person, isArray: true })
  @Prop({
    type: [PersonSchema],
  })
  persons: Person[];

  @ApiProperty()
  @Prop()
  invites: Types.ObjectId[];

  @ApiProperty({ type: String })
  @Prop()
  group: Types.ObjectId;

  @ApiProperty()
  @Prop()
  email?: string;

  @ApiProperty()
  @Prop()
  phone?: string;

  @ApiProperty()
  @Prop()
  address?: string;

  @ApiProperty()
  @Prop()
  postalCode?: string;

  @ApiProperty()
  @Prop()
  note?: string;

  @ApiProperty({ enum: GuestStatusEnum })
  @Prop({ enum: GuestStatusEnum, default: GuestStatusEnum.PENDING })
  status: GuestStatusEnum;
}

export const GuestSchema = SchemaFactory.createForClass(Guest);
