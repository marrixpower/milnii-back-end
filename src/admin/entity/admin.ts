import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true, collection: Admin.name })
export class Admin {
  @Prop({ required: false })
  @ApiProperty({ type: String })
  name: string;

  @Prop({ required: false })
  @ApiProperty({ type: String })
  photo: string;

  @Prop({ required: true })
  @ApiProperty({ type: String })
  login: string;

  @Prop({ required: true })
  @ApiProperty({ type: String })
  password: string;

  @Prop({})
  creator?: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
