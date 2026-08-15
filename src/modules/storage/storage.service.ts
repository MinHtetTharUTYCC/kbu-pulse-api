import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import { AppConfigService } from '@/config/app-config.service';

@Injectable()
export class StorageService {
    private readonly logger = new Logger(StorageService.name);
    private readonly s3Client: S3Client;
    private readonly bucket: string;
    private readonly publicUrl: string;

    constructor(private config: AppConfigService) {
        this.bucket = this.config.r2BucketName;
        this.publicUrl = this.config.r2PublicUrl;

        this.s3Client = new S3Client({
            region: 'auto',
            endpoint: this.config.r2Endpoint,
            credentials: {
                accessKeyId: this.config.r2AccessKeyId,
                secretAccessKey: this.config.r2SecretAccessKey,
            },
        });
    }

    async processImage(
        buffer: Buffer,
        options?: { width?: number; quality?: number },
    ): Promise<Buffer> {
        try {
            return await sharp(buffer)
                .resize({
                    width: options?.width ?? 2000,
                    height: options?.width ?? 2000,
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .webp({ quality: options?.quality ?? 80 })
                .toBuffer();
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to process image: ${message}`);
            throw new InternalServerErrorException('Failed to process image');
        }
    }

    async uploadEventImage(buffer: Buffer): Promise<string> {
        try {
            const key = `events/${uuid()}.webp`;

            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: buffer,
                    ContentType: 'image/webp',
                }),
            );

            return `${this.publicUrl}/${key}`;
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to upload event image: ${message}`);
            throw new InternalServerErrorException(
                'Failed to upload event image',
            );
        }
    }

    async uploadProfileImage(buffer: Buffer, userId: string): Promise<string> {
        try {
            const key = `profiles/${userId}/${uuid()}.webp`;

            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: buffer,
                    ContentType: 'image/webp',
                }),
            );

            return `${this.publicUrl}/${key}`;
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to upload profile image: ${message}`);
            throw new InternalServerErrorException(
                'Failed to upload profile image',
            );
        }
    }

    async deleteObject(key: string): Promise<void> {
        try {
            await this.s3Client.send(
                new DeleteObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                }),
            );
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to delete object: ${message}`);
        }
    }

    getKeyFromUrl(url: string): string {
        return url.replace(`${this.publicUrl}/`, '');
    }
}
