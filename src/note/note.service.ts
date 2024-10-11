import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';
import { facetTotalCount } from 'src/common/util/facet-total-count';

import { SearchNoteDto } from './dto/search-note.dto';
import { Note, NoteDocument } from './entity/note';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name)
    private readonly noteModel: Model<NoteDocument>,
  ) {}

  async create(createNoteDto: Partial<NoteDocument>): Promise<NoteDocument> {
    const note = await this.noteModel.create(createNoteDto);

    return note;
  }

  async find(
    query: SearchNoteDto,
    meta: pagination,
  ): Promise<IFacetResult<NoteDocument>> {
    const filter: FilterQuery<NoteDocument> = {};

    if (query.owner) filter.owner = query.owner;

    return (
      await this.noteModel.aggregate([
        { $match: filter },
        ...facetTotalCount(meta, []),
      ])
    )[0];
  }

  async findOne(query: FilterQuery<NoteDocument>): Promise<NoteDocument> {
    return (await this.noteModel.aggregate([{ $match: query }]))[0];
  }

  async update(
    filter: FilterQuery<NoteDocument>,
    data: UpdateQuery<NoteDocument>,
  ) {
    return this.noteModel.findOneAndUpdate(filter, data, { new: true });
  }

  async delete(filter: FilterQuery<NoteDocument>) {
    return this.noteModel.deleteMany(filter);
  }
}
