import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Event, EventSchema } from './entity/event';
import { EventController } from './event.controller';
import { EventEventHandler } from './event.event-handler';
import { EventService } from './event.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService, EventEventHandler],
})
export class EventModule {}
