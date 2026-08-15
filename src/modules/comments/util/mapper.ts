import { CommentListItemDto } from '../dtos/response/comment-response.dto';
import { CommentListItemPayload } from './select';

export function toCommentListItem(
    comment: CommentListItemPayload,
    hasLiked: boolean = false,
): CommentListItemDto {
    return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        userId: comment.userId,
        author: {
            fullName: comment.user.fullName,
        },
        totalLikes: comment._count.likes,
        hasLiked,
    };
}
