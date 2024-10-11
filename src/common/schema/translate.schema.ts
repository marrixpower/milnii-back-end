import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ autoCreate: false })
export class Translate {
  @Prop()
  lang: string;

  @Prop()
  value: string;
}

export const TranslateSchema = SchemaFactory.createForClass(Translate);
