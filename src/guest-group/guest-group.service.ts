import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';
import { facetTotalCount } from 'src/common/util/facet-total-count';

import { SearchGuestGroupDto } from './dto/search-guest-group.dto';
import { GuestGroup, GuestGroupDocument } from './entity/guest-group';

@Injectable()
export class GuestGroupService {
  constructor(
    @InjectModel(GuestGroup.name)
    private readonly guestGroupModel: Model<GuestGroupDocument>,
  ) {}

  async create(
    createGuestGroupDto: Partial<GuestGroupDocument>,
  ): Promise<GuestGroupDocument> {
    const guestGroup = await this.guestGroupModel.create(createGuestGroupDto);

    return guestGroup;
  }

  async find(
    query: SearchGuestGroupDto,
    meta: pagination,
  ): Promise<IFacetResult<GuestGroupDocument>> {
    const filter: FilterQuery<GuestGroupDocument> = {};

    if (query.owner) filter.owner = query.owner;

    return (
      await this.guestGroupModel.aggregate([
        { $match: filter },
        ...facetTotalCount(meta, []),
      ])
    )[0];
  }

  async findOne(
    query: FilterQuery<GuestGroupDocument>,
  ): Promise<GuestGroupDocument> {
    return (await this.guestGroupModel.aggregate([{ $match: query }]))[0];
  }

  async update(
    filter: FilterQuery<GuestGroupDocument>,
    data: UpdateQuery<GuestGroupDocument>,
  ) {
    return this.guestGroupModel.findOneAndUpdate(filter, data, { new: true });
  }

  async delete(query: FilterQuery<GuestGroupDocument>): Promise<any> {
    return this.guestGroupModel.deleteMany(query);
  }

  async onUserWedding({ weddingDate, user }) {
    [
      'Family',
      'Friends',
      'Coworkers',
      'Partner’s Family',
      'Partner’s Friend',
      'Partner’s Coworkers',
    ].forEach((e) =>
      this.guestGroupModel.create({
        owner: new Types.ObjectId(user),
        name: e,
      }),
    );
  }

  async onUserDeleted(owner: Types.ObjectId) {
    await this.guestGroupModel.deleteMany({ owner });
  }
}
