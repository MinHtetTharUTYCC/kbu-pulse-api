import { EventListItemDto } from '../dtos/response/event-response.dto';
import { EventDetailDto } from '../dtos/response/event-detail-response.dto';
import { EventListItemPayload, EventDetailPayload } from './select';

export function toEventListItem(
    event: EventListItemPayload,
    userId?: string,
): EventListItemDto {
    return {
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.category,
        imageUrls: event.imageUrls,
        createdAt: event.createdAt,
        author: {
            fullName: event.user.fullName,
            major: event.user.major,
        },
        upvoteCount: event._count.upvotes,
        commentCount: event._count.comments,
        hasUpvoted: false,
        hasSaved: false,
    };
}

export function toEventDetail(
    event: EventDetailPayload,
    userId?: string,
    hasUpvoted: boolean = false,
    hasSaved: boolean = false,
): EventDetailDto {
    return {
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.category,
        imageUrls: event.imageUrls,
        viewCount: event.viewCount,
        createdAt: event.createdAt,
        creator: {
            id: event.user.id,
            fullName: event.user.fullName,
            major: event.user.major,
        },
        upvoteCount: event._count.upvotes,
        commentCount: event._count.comments,
        hasUpvoted,
        hasSaved,
    };
}
