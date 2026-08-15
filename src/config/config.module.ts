import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration, { validationSchema } from './app.config';
import { AppConfigService } from './app-config.service';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
            isGlobal: true,
            load: [configuration],
            validationSchema,
        }),
    ],
    providers: [AppConfigService],
    exports: [AppConfigService, NestConfigModule],
})
export class ConfigModule {}
