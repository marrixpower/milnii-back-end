import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdminSessionDocument = AdminSession & Document;

@Schema({ collection: AdminSession.name, timestamps: true })
export class AdminSession {
  @Prop({
    required: true,
    ref: 'Admin',
  })
  admin: Types.ObjectId;

  @Prop({ required: true, unique: true })
  refreshToken: string;
}

export const AdminSessionSchema = SchemaFactory.createForClass(AdminSession);

AdminSessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 31 * 86400 });
