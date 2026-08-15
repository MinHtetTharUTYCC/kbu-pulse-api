import { Prisma } from '@prisma/client';

export const commentListItemSelect = {
    id: true,
    content: true,
    createdAt: true,
    userId: true,
    user: {
        select: {
            fullName: true,
        },
    },
    _count: {
        select: {
            likes: true,
        },
    },
} satisfies Prisma.CommentSelect;

export type CommentListItemPayload = Prisma.CommentGetPayload<{
    select: typeof commentListItemSelect;
}>;
