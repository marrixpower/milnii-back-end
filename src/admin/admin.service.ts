import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { FilterQuery, Model } from 'mongoose';

import { Admin, AdminDocument } from './entity/admin';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {}

  async findOne(filter: FilterQuery<AdminDocument>): Promise<AdminDocument> {
    return this.adminModel.findOne(filter);
  }

  async seed({
    login,
    password,
    creator,
  }: {
    login: string;
    password: string;
    creator: string;
  }) {
    const passwordHash = await hash(password, 2);

    await this.adminModel.updateOne(
      { login },
      { password: passwordHash, creator },
      { upsert: true },
    );
  }
}
