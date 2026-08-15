import {
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { StorageService } from '@/modules/storage/storage.service';
import { UserResponseDto } from './dtos/response/user-response.dto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly storage: StorageService,
    ) {}

    async getProfile(userId: string): Promise<UserResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                major: true,
                avatarUrl: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async uploadAvatar(
        userId: string,
        file: Express.Multer.File,
    ): Promise<{ avatarUrl: string }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const processedBuffer = await this.storage.processImage(file.buffer);
        const avatarUrl = await this.storage.uploadProfileImage(
            processedBuffer,
            userId,
        );

        await this.prisma.user.update({
            where: { id: userId },
            data: { avatarUrl },
        });

        this.logger.log('Avatar uploaded for user ' + userId);

        return { avatarUrl };
    }
}
