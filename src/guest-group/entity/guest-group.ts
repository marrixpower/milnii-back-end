import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type GuestGroupDocument = GuestGroup & Document;

@Schema({ timestamps: true, collection: GuestGroup.name })
export class GuestGroup {
  @ApiProperty({ type: String })
  @Prop()
  owner: Types.ObjectId;

  @ApiProperty()
  @Prop()
  name: string;
}

export const GuestGroupSchema = SchemaFactory.createForClass(GuestGroup);
