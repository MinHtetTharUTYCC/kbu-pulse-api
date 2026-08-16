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
        author: {
            id: comment.user.id,
            fullName: comment.user.fullName,
            avatarUrl: comment.user.avatarUrl ?? null,
        },
        totalLikes: comment._count.likes,
        hasLiked,
    };
}
