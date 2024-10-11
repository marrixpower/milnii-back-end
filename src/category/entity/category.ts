import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

import { Translate, TranslateSchema } from 'src/common/schema/translate.schema';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true, collection: Category.name })
export class Category {
  @ApiProperty({ type: String })
  _id?: Types.ObjectId;

  @Prop({ type: [TranslateSchema] })
  @ApiProperty()
  name: Translate[];

  @Prop()
  @ApiProperty()
  image?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

