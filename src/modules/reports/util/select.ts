import { Prisma } from '@prisma/client';

export const reportSelect = {
    id: true,
    reason: true,
    note: true,
    status: true,
    createdAt: true,
    reporter: {
        select: {
            id: true,
            fullName: true,
        },
    },
    reportedUser: {
        select: {
            id: true,
            fullName: true,
        },
    },
    event: {
        select: {
            id: true,
            title: true,
        },
    },
    comment: {
        select: {
            id: true,
            content: true,
        },
    },
} satisfies Prisma.ReportSelect;

export type ReportPayload = Prisma.ReportGetPayload<{
    select: typeof reportSelect;
}>;
