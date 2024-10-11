import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GuestGroup, GuestGroupSchema } from './entity/guest-group';
import { GuestGroupController } from './guest-group.controller';
import { GuestGroupEventHandler } from './guest-group.event-handler';
import { GuestGroupService } from './guest-group.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GuestGroup.name,
        schema: GuestGroupSchema,
      },
    ]),
  ],
  controllers: [GuestGroupController],
  providers: [GuestGroupService, GuestGroupEventHandler],
})
export class GuestGroupModule {}
