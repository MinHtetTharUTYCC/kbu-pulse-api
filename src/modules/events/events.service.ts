import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { StorageService } from '@/modules/storage/storage.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { EventsQueryDto } from './dtos/events-query.dto';
import { SavedEventsQueryDto } from './dtos/saved-events-query.dto';
import { EventListItemDto } from './dtos/response/event-response.dto';
import { EventDetailDto } from './dtos/response/event-detail-response.dto';
import { eventListItemSelect, eventDetailSelect } from './util/select';
import { toEventListItem, toEventDetail } from './util/mapper';
import { ProfileEventDto } from '@/modules/users/dtos/response/profile-event.dto';
import { PaginationMetaDto } from '@/common/dto/pagination-meta.dto';

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly storage: StorageService,
    ) {}

    async findAll(
        query: EventsQueryDto,
        userId?: string,
    ): Promise<{ data: EventListItemDto[]; meta: PaginationMetaDto }> {
        const { page = 1, limit = 20, category, major, search, sort } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.EventWhereInput = {};
        if (category) where.category = category;
        if (major) where.user = { major };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const orderBy: Prisma.EventOrderByWithRelationInput =
            sort === 'trending'
                ? { viewCount: 'desc' }
                : { createdAt: 'desc' };

        const [events, total] = await Promise.all([
            this.prisma.event.findMany({
                where,
                orderBy,
                take: limit,
                skip,
                select: eventListItemSelect,
            }),
            this.prisma.event.count({ where }),
        ]);

        let items = events.map((e) => toEventListItem(e, userId));

        if (userId) {
            const eventIds = items.map((e) => e.id);
            const [upvotes, savedEvents] = await Promise.all([
                this.prisma.upvote.findMany({
                    where: {
                        userId,
                        eventId: { in: eventIds },
                    },
                    select: { eventId: true },
                }),
                this.prisma.savedEvent.findMany({
                    where: {
                        userId,
                        eventId: { in: eventIds },
                    },
                    select: { eventId: true },
                }),
            ]);

            const upvotedSet = new Set(upvotes.map((u) => u.eventId));
            const savedSet = new Set(savedEvents.map((s) => s.eventId));

            items = items.map((item) => ({
                ...item,
                hasUpvoted: upvotedSet.has(item.id),
                hasSaved: savedSet.has(item.id),
            }));
        }

        return {
            data: items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(
        id: string,
        userId?: string,
    ): Promise<EventDetailDto> {
        const event = await this.prisma.event.findUnique({
            where: { id },
            select: eventDetailSelect,
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        await this.prisma.event.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });

        let hasUpvoted = false;
        let hasSaved = false;

        if (userId) {
            const [upvote, saved] = await Promise.all([
                this.prisma.upvote.findUnique({
                    where: { userId_eventId: { userId, eventId: id } },
                }),
                this.prisma.savedEvent.findUnique({
                    where: { userId_eventId: { userId, eventId: id } },
                }),
            ]);
            hasUpvoted = !!upvote;
            hasSaved = !!saved;
        }

        return toEventDetail(event, userId, hasUpvoted, hasSaved);
    }

    async create(
        dto: CreateEventDto,
        userId: string,
    ): Promise<EventDetailDto> {
        const event = await this.prisma.event.create({
            data: {
                title: dto.title,
                description: dto.description,
                category: dto.category,
                userId,
            },
            select: eventDetailSelect,
        });

        this.logger.log(`Event created: ${event.id} by ${userId}`);

        return toEventDetail(event, userId);
    }

    async update(
        eventId: string,
        dto: UpdateEventDto,
        userId: string,
    ): Promise<EventDetailDto> {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true, userId: true },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        if (event.userId !== userId) {
            throw new ForbiddenException(
                'You can only update your own events',
            );
        }

        const updated = await this.prisma.event.update({
            where: { id: eventId },
            data: {
                ...(dto.title !== undefined && { title: dto.title }),
                ...(dto.description !== undefined && {
                    description: dto.description,
                }),
                ...(dto.category !== undefined && {
                    category: dto.category,
                }),
            },
            select: eventDetailSelect,
        });

        this.logger.log(`Event updated: ${eventId} by ${userId}`);

        return toEventDetail(updated, userId);
    }

    async uploadImages(
        eventId: string,
        files: Express.Multer.File[],
        userId: string,
    ): Promise<string[]> {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true, userId: true, imageUrls: true },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        if (event.userId !== userId) {
            throw new ForbiddenException(
                'You can only upload images to your own events',
            );
        }

        if (event.imageUrls.length + files.length > 4) {
            throw new BadRequestException(
                'Maximum 4 images allowed per event',
            );
        }

        const processedBuffers = await Promise.all(
            files.map((file) => this.storage.processImage(file.buffer)),
        );

        const uploadedUrls = await Promise.all(
            processedBuffers.map((buffer) =>
                this.storage.uploadEventImage(buffer),
            ),
        );

        await this.prisma.event.update({
            where: { id: eventId },
            data: {
                imageUrls: {
                    push: uploadedUrls,
                },
            },
        });

        this.logger.log(
            `Uploaded ${uploadedUrls.length} images for event ${eventId}`,
        );

        return uploadedUrls;
    }

    async remove(eventId: string, userId: string): Promise<void> {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true, userId: true },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        if (event.userId !== userId) {
            throw new ForbiddenException(
                'You can only delete your own events',
            );
        }

        await this.prisma.event.delete({ where: { id: eventId } });

        this.logger.log(`Event deleted: ${eventId} by ${userId}`);
    }

    async toggleUpvote(
        eventId: string,
        userId: string,
    ): Promise<{ hasUpvoted: boolean; totalUpvotes: number }> {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        const existing = await this.prisma.upvote.findUnique({
            where: { userId_eventId: { userId, eventId } },
        });

        if (existing) {
            await this.prisma.upvote.delete({
                where: { userId_eventId: { userId, eventId } },
            });
        } else {
            await this.prisma.upvote.create({
                data: { userId, eventId },
            });
        }

        const totalUpvotes = await this.prisma.upvote.count({
            where: { eventId },
        });

        return {
            hasUpvoted: !existing,
            totalUpvotes,
        };
    }

    async toggleSave(
        eventId: string,
        userId: string,
    ): Promise<{ isSaved: boolean }> {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        const existing = await this.prisma.savedEvent.findUnique({
            where: { userId_eventId: { userId, eventId } },
        });

        if (existing) {
            await this.prisma.savedEvent.delete({
                where: { userId_eventId: { userId, eventId } },
            });
        } else {
            await this.prisma.savedEvent.create({
                data: { userId, eventId },
            });
        }

        return { isSaved: !existing };
    }

    async findSaved(
        query: SavedEventsQueryDto,
        userId: string,
    ): Promise<{ data: EventListItemDto[]; meta: PaginationMetaDto }> {
        const { page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.SavedEventWhereInput = { userId };

        const [savedEvents, total] = await Promise.all([
            this.prisma.savedEvent.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
                select: {
                    event: {
                        select: eventListItemSelect,
                    },
                },
            }),
            this.prisma.savedEvent.count({ where }),
        ]);

        const events = savedEvents.map((se) =>
            toEventListItem(se.event, userId),
        );

        const eventIds = events.map((e) => e.id);
        const upvotes = await this.prisma.upvote.findMany({
            where: {
                userId,
                eventId: { in: eventIds },
            },
            select: { eventId: true },
        });
        const upvotedSet = new Set(upvotes.map((u) => u.eventId));

        const items = events.map((item) => ({
            ...item,
            hasUpvoted: upvotedSet.has(item.id),
            hasSaved: true,
        }));

        return {
            data: items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getMyEvents(
        userId: string,
        page: number,
        limit: number,
    ): Promise<{ data: ProfileEventDto[]; meta: PaginationMetaDto }> {
        const skip = (page - 1) * limit;

        const [events, total] = await Promise.all([
            this.prisma.event.findMany({
                where: { userId },
                include: {
                    _count: { select: { upvotes: true, comments: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.event.count({ where: { userId } }),
        ]);

        const data = events.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            category: event.category,
            imageUrls: event.imageUrls,
            createdAt: event.createdAt,
            upvoteCount: event._count.upvotes,
            commentCount: event._count.comments,
        }));

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
}
