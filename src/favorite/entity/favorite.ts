import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

import { FavoriteTypeEnum } from '../enum/favorite-type.enum';

export type FavoriteDocument = Favorite & Document;

@Schema({ timestamps: true, collection: Favorite.name })
export class Favorite {
  @ApiProperty({ type: String })
  @Prop()
  owner: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop()
  favorite: Types.ObjectId;

  @ApiProperty()
  @Prop({ default: FavoriteTypeEnum.FAVORITE })
  type: FavoriteTypeEnum;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

FavoriteSchema.index({ favorite: 1, owner: 1, type: 1 }, { unique: true });
