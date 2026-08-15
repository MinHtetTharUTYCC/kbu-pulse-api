import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { StorageModule } from '@/modules/storage/storage.module';
import { EventsModule } from '@/modules/events/events.module';
import { CommentsModule } from '@/modules/comments/comments.module';

@Module({
    imports: [StorageModule, EventsModule, CommentsModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}