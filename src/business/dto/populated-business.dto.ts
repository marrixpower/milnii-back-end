import { ApiProperty, OmitType } from '@nestjs/swagger';

import { Category } from 'src/category/entity/category';
import { Favorite } from 'src/favorite/entity/favorite';
import { User } from 'src/user/entity/user';

import { Business } from '../entity/business';

export class PopulatedBusinessDto extends OmitType(Business, [
  'category',
  'owner',
]) {
  @ApiProperty()
  owner: User;

  @ApiProperty()
  category: Category;

  @ApiProperty()
  favorite: Favorite[];
}

