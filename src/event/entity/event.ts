import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

import { EventTypeEnum } from '../enum/event-type.enum';

export type EventDocument = Event & Document;

@Schema({ timestamps: true, collection: Event.name })
export class Event {
  @ApiProperty({ type: String })
  @Prop()
  owner: Types.ObjectId;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  group: EventTypeEnum;

  @ApiProperty()
  @Prop()
  maxGuests: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
