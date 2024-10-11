import { ApiProperty, OmitType } from '@nestjs/swagger';

import { Business } from 'src/business/entity/business';

import { Favorite } from '../entity/favorite';

export class PopulatedFavoriteDto extends OmitType(Favorite, ['favorite']) {
  @ApiProperty()
  favorite: Business;
}

