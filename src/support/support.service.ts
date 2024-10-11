import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';
import { facetTotalCount } from 'src/common/util/facet-total-count';

import { SearchSupportDto } from './dto/search-support.dto';
import { Support, SupportDocument } from './entity/support';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(Support.name)
    private readonly supportModel: Model<SupportDocument>,
  ) {}

  async create(
    createSupportDto: Partial<SupportDocument>,
  ): Promise<SupportDocument> {
    return this.supportModel.create(createSupportDto);
  }

  async find(
    query: SearchSupportDto,
    meta: pagination,
  ): Promise<IFacetResult<SupportDocument>> {
    const filter: FilterQuery<SupportDocument> = {};

    query.email && (filter.email = { $regex: query.email, $options: 'i' });

    query.status && (filter.status = { $in: query.status });

    (query.createdStart || query.createdEnd) && (filter.createdAt = {});

    query.createdEnd && (filter.createdAt.$lte = query.createdEnd);

    query.createdStart && (filter.createdAt.$gte = query.createdStart);

    return (
      await this.supportModel.aggregate([
        { $match: filter },
        ...facetTotalCount(meta),
      ])
    )[0];
  }

  async findOne(query: FilterQuery<SupportDocument>): Promise<SupportDocument> {
    return (await this.supportModel.aggregate([{ $match: query }]))[0];
  }

  async update(
    filter: FilterQuery<SupportDocument>,
    data: UpdateQuery<SupportDocument>,
  ) {
    return this.supportModel.findOneAndUpdate(filter, data, { new: true });
  }
}
