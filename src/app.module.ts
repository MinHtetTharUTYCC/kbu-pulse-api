import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@/config/config.module';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { StorageModule } from '@/modules/storage/storage.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { EventsModule } from '@/modules/events/events.module';
import { CommentsModule } from '@/modules/comments/comments.module';
import { UsersModule } from '@/modules/users/users.module';
import { ReportsModule } from '@/modules/reports/reports.module';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule,
        PrismaModule,
        StorageModule,
        AuthModule,
        EventsModule,
        CommentsModule,
        UsersModule,
        ReportsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    ],
})
export class AppModule {}
