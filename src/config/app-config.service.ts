import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IAppConfig } from './app.config';

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) {}

    get app() {
        return this.configService.get<IAppConfig['app']>('app');
    }

    get database() {
        return this.configService.get<IAppConfig['database']>('database');
    }

    get storage() {
        return this.configService.get<IAppConfig['storage']>('storage');
    }

    get databaseUrl(): string {
        return this.database!.url;
    }

    get r2Endpoint(): string {
        return this.storage!.r2.endpoint;
    }

    get r2PublicUrl(): string {
        return this.storage!.r2.publicUrl;
    }

    get r2AccessKeyId(): string {
        return this.storage!.r2.accessKeyId;
    }

    get r2SecretAccessKey(): string {
        return this.storage!.r2.secretAccessKey;
    }

    get r2BucketName(): string {
        return this.storage!.r2.bucketName;
    }

    get port(): number {
        return this.app!.port;
    }

    get nodeEnv(): string {
        return this.app!.nodeEnv;
    }
}
