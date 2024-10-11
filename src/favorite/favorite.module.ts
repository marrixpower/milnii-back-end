import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Favorite, FavoriteSchema } from './entity/favorite';
import { FavoriteController } from './favorite.controller';
import { FavoriteEventHandler } from './favorite.event-handler';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema },
    ]),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteEventHandler],
})
export class FavoriteModule {}
