import { randomUUID } from 'crypto';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

import { GeoPoint, GeoPointSchema } from 'src/common/schema/geo.schema';

import { VerificationStatusEnum } from '../enum/verification-status.enum';

export type BusinessDocument = Business & Document;

@Schema({ timestamps: true, collection: Business.name })
export class Business {
  @ApiProperty({ type: String })
  _id?: Types.ObjectId;

  @Prop({ required: false, default: randomUUID })
  @ApiProperty({ type: String })
  owner: Types.ObjectId;

  @Prop({ default: 0 })
  @ApiProperty()
  increment: number;

  @Prop()
  @ApiProperty()
  name: string;

  @Prop({ required: false })
  @ApiProperty({ type: String })
  email: string;

  @Prop()
  @ApiProperty()
  address: string;

  @Prop()
  @ApiProperty()
  city: string;

  @Prop()
  @ApiProperty()
  postalCode: string;

  @Prop()
  @ApiProperty()
  phone: string;

  @Prop()
  @ApiProperty({ type: String })
  category: Types.ObjectId;

  @Prop()
  @ApiProperty()
  site: string;

  @Prop()
  @ApiProperty()
  booking: string;

  @Prop()
  @ApiProperty()
  images: string[];

  @Prop()
  @ApiProperty()
  description: string;

  @Prop()
  @ApiProperty()
  price: number;

  @Prop({ type: GeoPointSchema, required: false, index: '2dsphere' })
  @ApiProperty()
  location?: GeoPoint;

  @Prop({
    required: false,
    enum: VerificationStatusEnum,
    default: VerificationStatusEnum.NOT_VERIFIED,
  })
  @ApiProperty({ type: String, enum: VerificationStatusEnum })
  status: VerificationStatusEnum;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
