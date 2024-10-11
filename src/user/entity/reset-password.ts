import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ResetPasswordDocument = ResetPassword & Document;

@Schema({ timestamps: true, collection: ResetPassword.name })
export class ResetPassword {
  @Prop({ required: false, unique: true })
  @ApiProperty({ type: String })
  resetToken: string;

  @Prop({ required: false })
  @ApiProperty({ type: String })
  email: string;
}

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);

ResetPasswordSchema.index({ createdAt: 1 }, { expires: '10m' });

