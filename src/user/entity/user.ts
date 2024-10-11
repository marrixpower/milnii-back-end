import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

import { UserRoleEnum } from '../enum/user-role.enum';
import { UserTypeEnum } from '../enum/user-type.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: User.name })
export class User {
  @Prop({ required: false, unique: true })
  @ApiProperty({ type: String })
  firebaseId: string;

  @Prop({ default: 0 })
  @ApiProperty()
  increment: number;

  @Prop({ required: false })
  @ApiProperty({ type: String })
  name: string;

  @Prop({ required: false })
  @ApiProperty({ type: String })
  email: string;

  @Prop({ required: false })
  @ApiProperty({ type: String })
  country: string;

  @Prop({ required: false })
  @ApiProperty({ type: String })
  city: string;

  @Prop({ required: false })
  @ApiProperty({ type: String })
  category: string;

  @Prop({ required: false })
  @ApiProperty({ type: String })
  phone: string;

  @Prop({ required: false })
  @ApiProperty({ type: String })
  partner: string;

  @Prop({ required: false })
  @ApiProperty({ type: String })
  image?: string;

  @Prop({ enum: UserTypeEnum })
  @ApiProperty({ enum: UserTypeEnum })
  type: UserTypeEnum;

  @Prop({})
  @ApiProperty()
  weddingDate: Date;

  @Prop({ enum: UserRoleEnum })
  @ApiProperty({ enum: UserRoleEnum })
  role: UserRoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
