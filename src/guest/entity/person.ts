import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { GuestAgeEnum } from '../enum/age.enum';

@Schema({ autoCreate: false, _id: false })
export class Person {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty({ enum: GuestAgeEnum })
  @Prop({ enum: GuestAgeEnum })
  age: GuestAgeEnum;
}

export const PersonSchema = SchemaFactory.createForClass(Person);

