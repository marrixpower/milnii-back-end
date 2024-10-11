import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { Model, Types } from 'mongoose';

import { AdminService } from 'src/admin/admin.service';

import { LoginDto } from './dto/login.dto';
import { AdminSession, AdminSessionDocument } from './entity/admin-session';
import { JwtService } from './jwt.service';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectModel(AdminSession.name)
    private readonly adminSessionModel: Model<AdminSessionDocument>,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    data: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const admin = await this.adminService.findOne({
      login: data.login,
    });

    if (!admin) throw new BadRequestException('No admin with given login');

    if (!(await compare(data.password, admin.password)))
      throw new BadRequestException('Wrong password');

    const refreshToken = await this.jwtService.genRefreshToken(admin._id);
    const accessToken = await this.jwtService.genAccessToken(admin);
    await this.adminSessionModel.create({
      admin: admin._id,
      refreshToken,
    });

    return { accessToken, refreshToken };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { _id } = await this.jwtService.verifyRefreshToken(refreshToken);

    if (!(await this.adminSessionModel.findOne({ refreshToken })))
      throw new ForbiddenException('Invalid refresh token');

    const admin = await this.adminService.findOne({
      _id: new Types.ObjectId(_id),
    });

    if (!admin) throw new ForbiddenException('Admin not exists');

    const newRefreshToken = await this.jwtService.genRefreshToken(admin._id);
    const accessToken = await this.jwtService.genAccessToken(admin);

    await this.adminSessionModel.updateOne(
      { refreshToken },
      { refreshToken: newRefreshToken },
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.adminSessionModel.deleteOne({ refreshToken });
  }
}
