import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { GuestGroup } from 'src/guest-group/entity/guest-group';

import { Guest } from '../entity/guest';

export class GroupedGuestsDto {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty()
  guests: Guest[];

  @ApiProperty()
  count: number;

  @ApiProperty()
  group: GuestGroup;
}

