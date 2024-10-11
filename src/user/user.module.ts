import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { SequenceFactory } from 'src/common/util/mongo-auto-increment';
import { MailingModule } from 'src/mailer/mailing.module';

import { ResetPassword, ResetPasswordSchema } from './entity/reset-password';
import { User, UserSchema } from './entity/user';
import { UserAdminController } from './user.admin.controller';
import { UserController } from './user.controller';
import { UserEventHandler } from './user.event-handler';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: async (connection: Connection) => {
          const schema = UserSchema;
          const autoIncrement = new SequenceFactory(connection, {
            field: 'increment',
          });
          schema.plugin(autoIncrement.plugin.bind(autoIncrement));
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    MongooseModule.forFeature([
      {
        name: ResetPassword.name,
        schema: ResetPasswordSchema,
      },
    ]),
    MailingModule,
  ],
  controllers: [UserController, UserAdminController],
  providers: [UserService, UserEventHandler],
  exports: [UserService],
})
export class UserModule {}
