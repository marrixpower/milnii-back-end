import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { Business } from 'src/business/entity/business';
import { Category } from 'src/category/entity/category';

export class FavoriteCategoryDto {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty()
  count: number;

  @ApiProperty()
  favorite: Business;

  @ApiProperty()
  category: Category;
}

