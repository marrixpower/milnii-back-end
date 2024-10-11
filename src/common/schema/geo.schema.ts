import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ autoCreate: false, _id: false })
export class GeoPoint {
  @Prop({ required: true, default: 'Point' })
  @ApiProperty()
  type: string = 'Point';

  @Prop({ required: true })
  @ApiProperty({
    minItems: 2,
    maxItems: 2,
    description: 'array of two elements [longitude, latitude]',
    type: Number,
    isArray: true,
  })
  coordinates: number[];
}

export const GeoPointSchema = SchemaFactory.createForClass(GeoPoint);
