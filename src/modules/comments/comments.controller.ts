import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiHeader,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentsQueryDto } from './dtos/comments-query.dto';
import { PaginatedCommentListItemDto } from './dtos/response/paginated-comment-list-item.dto';
import { CommentListItemDto } from './dtos/response/comment-response.dto';
import { ToggleLikeResponseDto } from './dtos/response/toggle-like-response.dto';

@ApiTags('Comments')
@ApiHeader({
    name: 'x-user-id',
    description: 'User UUID (from localStorage)',
    required: false,
})
@Controller('api')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get('events/:eventId/comments')
    @ApiOperation({ summary: 'List comments for an event' })
    @ApiParam({ name: 'eventId', description: 'Event UUID' })
    @ApiResponse({ status: 200, description: 'Paginated list of comments', type: PaginatedCommentListItemDto })
    async findByEvent(
        @Param('eventId') eventId: string,
        @Query() query: CommentsQueryDto,
        @CurrentUser(false) userId?: string,
    ) {
        return this.commentsService.findByEvent(eventId, query, userId);
    }

    @Post('events/:eventId/comments')

    @ApiOperation({ summary: 'Add a comment to an event' })
    @ApiParam({ name: 'eventId', description: 'Event UUID' })
    @ApiResponse({ status: 201, description: 'Comment created', type: CommentListItemDto })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    async create(
        @Param('eventId') eventId: string,
        @Body() dto: CreateCommentDto,
        @CurrentUser() userId: string,
    ) {
        return this.commentsService.create(eventId, dto, userId);
    }

    @Post('comments/:commentId/like')

    @ApiOperation({ summary: 'Toggle like on a comment' })
    @ApiParam({ name: 'commentId', description: 'Comment UUID' })
    @ApiResponse({ status: 200, description: 'Like toggled', type: ToggleLikeResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Comment not found' })
    async toggleLike(
        @Param('commentId') commentId: string,
        @CurrentUser() userId: string,
    ) {
        return this.commentsService.toggleLike(commentId, userId);
    }

    @Delete('comments/:commentId')

    @ApiOperation({ summary: 'Delete a comment (owner only)' })
    @ApiParam({ name: 'commentId', description: 'Comment UUID' })
    @ApiResponse({ status: 200, description: 'Comment deleted', type: MessageResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden — not the comment owner' })
    @ApiResponse({ status: 404, description: 'Comment not found' })
    async remove(
        @Param('commentId') commentId: string,
        @CurrentUser() userId: string,
    ) {
        await this.commentsService.remove(commentId, userId);
        return { message: 'Comment deleted' };
    }
}
