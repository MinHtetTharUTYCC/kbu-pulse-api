import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { AppConfigService } from '@/config/app-config.service';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    constructor(private readonly appConfigService: AppConfigService) {
        const connectionString = appConfigService.databaseUrl;
        const adapter = new PrismaPg(new Pool({ connectionString }));
        super({
            adapter: adapter as any,
            log: ['error', 'warn'],
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}