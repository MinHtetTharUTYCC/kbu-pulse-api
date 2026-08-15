import { Prisma } from '@prisma/client';

export const eventListItemSelect = {
    id: true,
    title: true,
    description: true,
    category: true,
    imageUrls: true,
    createdAt: true,
    user: {
        select: {
            fullName: true,
            major: true,
        },
    },
    _count: {
        select: {
            upvotes: true,
            comments: true,
        },
    },
} satisfies Prisma.EventSelect;

export type EventListItemPayload = Prisma.EventGetPayload<{
    select: typeof eventListItemSelect;
}>;

export const eventDetailSelect = {
    id: true,
    title: true,
    description: true,
    category: true,
    imageUrls: true,
    viewCount: true,
    createdAt: true,
    user: {
        select: {
            id: true,
            fullName: true,
            major: true,
        },
    },
    _count: {
        select: {
            upvotes: true,
            comments: true,
        },
    },
} satisfies Prisma.EventSelect;

export type EventDetailPayload = Prisma.EventGetPayload<{
    select: typeof eventDetailSelect;
}>;
