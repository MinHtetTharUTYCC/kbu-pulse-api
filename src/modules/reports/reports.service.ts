import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { CreateReportUserDto } from './dtos/create-report-user.dto';
import { CreateReportEventDto } from './dtos/create-report-event.dto';
import { CreateReportCommentDto } from './dtos/create-report-comment.dto';
import { ReportResponseDto } from './dtos/response/report-response.dto';
import { reportSelect } from './util/select';
import { toReportResponse } from './util/mapper';

@Injectable()
export class ReportsService {
    private readonly logger = new Logger(ReportsService.name);

    constructor(private readonly prisma: PrismaService) {}

    async reportUser(
        reporterId: string,
        dto: CreateReportUserDto,
    ): Promise<ReportResponseDto> {
        if (reporterId === dto.reportedUserId) {
            throw new ConflictException('You cannot report yourself');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: dto.reportedUserId },
            select: { id: true },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const existing = await this.prisma.report.findFirst({
            where: {
                reporterId,
                reportedUserId: dto.reportedUserId,
                status: 'PENDING',
            },
        });
        if (existing) {
            throw new ConflictException(
                'You already have a pending report on this user',
            );
        }

        const report = await this.prisma.report.create({
            data: {
                reporterId,
                reportedUserId: dto.reportedUserId,
                reason: dto.reason,
                note: dto.note,
            },
            select: reportSelect,
        });

        this.logger.log(
            `Report created by ${reporterId} on user ${dto.reportedUserId}`,
        );

        return toReportResponse(report);
    }

    async reportEvent(
        reporterId: string,
        dto: CreateReportEventDto,
    ): Promise<ReportResponseDto> {
        const event = await this.prisma.event.findUnique({
            where: { id: dto.eventId },
            select: { id: true },
        });
        if (!event) {
            throw new NotFoundException('Event not found');
        }

        const existing = await this.prisma.report.findFirst({
            where: {
                reporterId,
                eventId: dto.eventId,
                status: 'PENDING',
            },
        });
        if (existing) {
            throw new ConflictException(
                'You already have a pending report on this event',
            );
        }

        const report = await this.prisma.report.create({
            data: {
                reporterId,
                eventId: dto.eventId,
                reason: dto.reason,
                note: dto.note,
            },
            select: reportSelect,
        });

        this.logger.log(
            `Report created by ${reporterId} on event ${dto.eventId}`,
        );

        return toReportResponse(report);
    }

    async reportComment(
        reporterId: string,
        dto: CreateReportCommentDto,
    ): Promise<ReportResponseDto> {
        const comment = await this.prisma.comment.findUnique({
            where: { id: dto.commentId },
            select: { id: true },
        });
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        const existing = await this.prisma.report.findFirst({
            where: {
                reporterId,
                commentId: dto.commentId,
                status: 'PENDING',
            },
        });
        if (existing) {
            throw new ConflictException(
                'You already have a pending report on this comment',
            );
        }

        const report = await this.prisma.report.create({
            data: {
                reporterId,
                commentId: dto.commentId,
                reason: dto.reason,
                note: dto.note,
            },
            select: reportSelect,
        });

        this.logger.log(
            `Report created by ${reporterId} on comment ${dto.commentId}`,
        );

        return toReportResponse(report);
    }
}
