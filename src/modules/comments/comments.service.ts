import {
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentsQueryDto } from './dtos/comments-query.dto';
import { CommentListItemDto } from './dtos/response/comment-response.dto';
import { commentListItemSelect } from './util/select';
import { toCommentListItem } from './util/mapper';
import { ProfileCommentDto } from '@/modules/users/dtos/response/profile-comment.dto';
import { PaginationMetaDto } from '@/common/dto/pagination-meta.dto';

@Injectable()
export class CommentsService {
    private readonly logger = new Logger(CommentsService.name);

    constructor(private readonly prisma: PrismaService) {}

    async findByEvent(
        eventId: string,
        query: CommentsQueryDto,
        userId?: string,
    ): Promise<{ data: CommentListItemDto[]; meta: PaginationMetaDto }> {
        const { page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;

        const where = { eventId };

        const [comments, total] = await Promise.all([
            this.prisma.comment.findMany({
                where,
                orderBy: { createdAt: 'asc' },
                take: limit,
                skip,
                select: commentListItemSelect,
            }),
            this.prisma.comment.count({ where }),
        ]);

        let items = comments.map((c) => toCommentListItem(c));

        if (userId) {
            const commentIds = items.map((c) => c.id);
            const likes = await this.prisma.commentLike.findMany({
                where: {
                    userId,
                    commentId: { in: commentIds },
                },
                select: { commentId: true },
            });
            const likedSet = new Set(likes.map((l) => l.commentId));

            items = items.map((item) => ({
                ...item,
                hasLiked: likedSet.has(item.id),
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

    async create(
        eventId: string,
        dto: CreateCommentDto,
        userId: string,
    ): Promise<CommentListItemDto> {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        const comment = await this.prisma.comment.create({
            data: {
                content: dto.content,
                eventId,
                userId,
            },
            select: commentListItemSelect,
        });

        this.logger.log(`Comment created: ${comment.id} by ${userId}`);

        return toCommentListItem(comment);
    }

    async toggleLike(
        commentId: string,
        userId: string,
    ): Promise<{ hasLiked: boolean; totalLikes: number }> {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            select: { id: true },
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        const existing = await this.prisma.commentLike.findUnique({
            where: { userId_commentId: { userId, commentId } },
        });

        if (existing) {
            await this.prisma.commentLike.delete({
                where: { userId_commentId: { userId, commentId } },
            });
        } else {
            await this.prisma.commentLike.create({
                data: { userId, commentId },
            });
        }

        const totalLikes = await this.prisma.commentLike.count({
            where: { commentId },
        });

        return {
            hasLiked: !existing,
            totalLikes,
        };
    }

    async remove(commentId: string, userId: string): Promise<void> {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            select: { id: true, userId: true },
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        if (comment.userId !== userId) {
            throw new ForbiddenException(
                'You can only delete your own comments',
            );
        }

        await this.prisma.comment.delete({ where: { id: commentId } });

        this.logger.log(`Comment deleted: ${commentId} by ${userId}`);
    }

    async getMyComments(
        userId: string,
        page: number,
        limit: number,
    ): Promise<{ data: ProfileCommentDto[]; meta: PaginationMetaDto }> {
        const skip = (page - 1) * limit;

        const [comments, total] = await Promise.all([
            this.prisma.comment.findMany({
                where: { userId },
                include: {
                    event: { select: { id: true, title: true } },
                    _count: { select: { likes: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.comment.count({ where: { userId } }),
        ]);

        const data = comments.map((comment) => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            event: comment.event,
            totalLikes: comment._count.likes,
        }));

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
}
