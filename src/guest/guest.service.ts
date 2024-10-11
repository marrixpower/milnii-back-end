import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';
import { escapeRegexpString } from 'src/common/util/escape-regexp-string';
import { facetTotalCount } from 'src/common/util/facet-total-count';

import { GroupedGuestsDto } from './dto/grouped-guests.dto';
import { SearchGuestDto } from './dto/search-guest.dto';
import { Guest, GuestDocument } from './entity/guest';

@Injectable()
export class GuestService {
  constructor(
    @InjectModel(Guest.name)
    private readonly guestModel: Model<GuestDocument>,
  ) {}

  async create(createGuestDto: Partial<GuestDocument>): Promise<GuestDocument> {
    const guest = await this.guestModel.create(createGuestDto);

    return guest;
  }

  async find(
    query: SearchGuestDto,
    meta: pagination,
  ): Promise<IFacetResult<GuestDocument>> {
    const filter: FilterQuery<GuestDocument> = {};

    if (query.owner) filter.owner = query.owner;

    if (query.name)
      filter['persons.name'] = {
        $regex: escapeRegexpString(query.name),
        $options: 'i',
      };

    if (query.status) filter.status = query.status;

    return (
      await this.guestModel.aggregate([
        { $match: filter },
        ...facetTotalCount(meta, []),
      ])
    )[0];
  }

  async findGrouped(query: SearchGuestDto): Promise<GroupedGuestsDto[]> {
    const filter: FilterQuery<GuestDocument> = {};

    if (query.owner) filter.owner = query.owner;

    if (query.name)
      filter['persons.name'] = {
        $regex: escapeRegexpString(query.name),
        $options: 'i',
      };

    if (query.status) filter.status = query.status;

    return this.guestModel.aggregate([
      { $match: filter },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $group: {
          _id: '$group',
          guests: {
            $push: '$$ROOT',
          },
          count: {
            $sum: {
              $size: '$persons',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'GuestGroup',
          localField: '_id',
          foreignField: '_id',
          as: 'group',
        },
      },
      {
        $addFields: {
          group: { $arrayElemAt: ['$group', 0] },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  }

  async findOne(query: FilterQuery<GuestDocument>): Promise<GuestDocument> {
    return (await this.guestModel.aggregate([{ $match: query }]))[0];
  }

  async update(
    filter: FilterQuery<GuestDocument>,
    data: UpdateQuery<GuestDocument>,
  ) {
    return this.guestModel.findOneAndUpdate(filter, data, { new: true });
  }

  async delete(query: FilterQuery<GuestDocument>): Promise<any> {
    return this.guestModel.deleteMany(query);
  }
}
