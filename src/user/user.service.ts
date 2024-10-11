import { randomUUID } from 'crypto';

import { ForbiddenException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { FirebaseService } from 'firebasemodule';
import { FilterQuery, Model, PipelineStage, UpdateQuery } from 'mongoose';

import { EventsEnum } from 'src/common/enum/events.enum';
import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';
import { escapeRegexpString } from 'src/common/util/escape-regexp-string';
import { facetTotalCount } from 'src/common/util/facet-total-count';
import { plainify } from 'src/common/util/plainify';
import { MailTemplateEnum } from 'src/mailer/enum/template-enum';
import { MailingService } from 'src/mailer/mailing.service';

import { CheckCredentialsResultDto } from './dto/check-credential-result.dto';
import { CheckCredentialsDto } from './dto/check-credentials.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserSearchDto } from './dto/search.dto';
import { ResetPassword, ResetPasswordDocument } from './entity/reset-password';
import { User, UserDocument } from './entity/user';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ResetPassword.name)
    private readonly resetPasswordModel: Model<ResetPasswordDocument>,
    private readonly firebaseService: FirebaseService,
    private readonly eventEmitter: EventEmitter2,
    private readonly mailingService: MailingService,
  ) {
    // this.clearFirebase();
  }

  async clearFirebase() {
    const users = await this.firebaseService.auth().listUsers();

    users.users.forEach((userRecord) => {
      console.log('RECORD', userRecord);
      const user_id = (userRecord.toJSON() as any).uid;
      console.log('user_id', user_id);
      if (user_id != 'e7Lr7HoVEnWThMnloiJdiidrszC2')
        this.firebaseService.auth().deleteUser(user_id);
    });
  }

  /**
   *
   * @param {Partial<UserDocument>} data - The data for the user document to create.
   * @return {Promise<UserDocument>} The newly created user document.
   */
  async create(data: Partial<UserDocument>): Promise<UserDocument> {
    const user = await this.userModel.create(data);

    if (data.weddingDate) {
      this.eventEmitter.emit(EventsEnum.USER_WEDDING_CREATED, {
        user: String(user._id),
        weddingDate: user.weddingDate,
      });
    }

    if (data.firebaseId) {
      await this.firebaseService
        .auth()
        .setCustomUserClaims(data.firebaseId, { userId: String(user._id) });
    }

    return user;
  }

  /**
   * Asynchronously updates a user document in the database that matches the provided query with the provided data.
   *
   * @param {FilterQuery<UserDocument>} query - The query to match documents to update.
   * @param {Partial<UserDocument>} data - The data to update the matched documents with.
   * @return {Promise<UserDocument>} The updated user document or throws a ForbiddenException if no document was found matching the query.
   */
  async update(
    query: FilterQuery<UserDocument>,
    data: UpdateQuery<UserDocument>,
  ): Promise<UserDocument> {
    return this.userModel
      .findOneAndUpdate(query, data, { new: true })
      .orFail(new ForbiddenException('User not exists'));
  }

  /**
   * Asynchronously finds a single document that matches the given query
   * in the User collection.
   *
   * @param {FilterQuery<UserDocument>} query - The query used to find the user.
   * @return {Promise<UserDocument>} - A promise that resolves to the found user,
   * or null if no user was found.
   */
  async findOne(query: FilterQuery<UserDocument>): Promise<UserDocument> {
    return (await this.userModel.aggregate([{ $match: query }]))[0];
  }

  /**
   * Asynchronously finds a user based on the given filter query and pagination metadata.
   *
   * @param {FilterQuery<UserSearchDto>} query - The filter query used to search for the user.
   * @param {pagination} meta - The pagination metadata used to limit the search results.
   * @return {Promise<IFacetResult<UserDocument>>} A promise that resolves to the found user document.
   */
  async find(
    query: UserSearchDto,
    meta: pagination,
  ): Promise<IFacetResult<UserDocument>> {
    const pipeline: PipelineStage[] = [];

    const filter: FilterQuery<UserDocument> = {};

    if (query.name)
      filter.name = { $regex: escapeRegexpString(query.name), $options: 'i' };

    if (query.type) filter.type = query.type;

    pipeline.push({ $match: filter });

    pipeline.push(...facetTotalCount(meta));

    return (await this.userModel.aggregate(pipeline))[0];
  }

  /**
   * Asynchronously deletes a user document that matches the given query.
   *
   * @param {FilterQuery<UserDocument>} query - The query used to filter the user documents to delete.
   * @return {Promise<any>} A promise that resolves to the result of the delete operation.
   */
  async delete(query: FilterQuery<UserDocument>): Promise<any> {
    const user = await this.userModel.findOne(query);

    try {
      this.firebaseService.auth().deleteUser(user.firebaseId);
    } catch (e) {
      /* */
    }

    this.eventEmitter.emit(EventsEnum.USER_DELETED, { user: plainify(user) });

    return this.userModel.deleteOne(query);
  }

  /**
   * Performs credential checks based on the provided data.
   *
   * @param {CheckCredentialsDto} data - the data containing email and/or phone for credential checks
   * @return {Promise<CheckCredentialsResultDto>} the result of the credential checks
   */
  async checkCredentials(
    data: CheckCredentialsDto,
  ): Promise<CheckCredentialsResultDto> {
    const result: CheckCredentialsResultDto = {
      firebaseEmail: false,
      firebasePhone: false,
      localEmail: false,
      localPhone: false,
    };

    if (data.email) {
      try {
        await this.firebaseService.auth().getUserByEmail(data.email);
        result.firebaseEmail = true;
      } catch (e) {
        /* */
      }

      result.localEmail = Boolean(
        await this.userModel.findOne({ email: data.email }),
      );
    }

    if (data.phone) {
      try {
        await this.firebaseService.auth().getUserByPhoneNumber(data.phone);
        result.firebasePhone = true;
      } catch (e) {
        /* */
      }

      result.localPhone = Boolean(
        await this.userModel.findOne({ phone: data.phone }),
      );
    }

    return result;
  }

  async resetPassword(data: ResetPasswordDto) {
    const resetToken = randomUUID();

    await this.resetPasswordModel.create({ email: data.email, resetToken });

    const link = 'https://dev.api.milnii.kitglobal.com.ua/?code=' + resetToken;

    await this.mailingService.sendMail({
      to: data.email,
      subject: 'Milnii Reset Password',
      template: MailTemplateEnum.PASSWORD_RECOVERY,
      context: {
        link,
      },
    });
  }

  async confirmPasswordReset(data: ConfirmPasswordResetDto) {
    const user = await this.firebaseService.auth().getUserByEmail(data.email);

    if (
      !(await this.resetPasswordModel.findOne({
        email: data.email,
        resetToken: data.resetToken,
      }))
    )
      throw new ForbiddenException('ResetToken invalid');

    await this.firebaseService
      .auth()
      .updateUser(user.uid, { password: data.password });
  }
}
