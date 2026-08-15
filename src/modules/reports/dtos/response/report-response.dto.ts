import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportReason, ReportStatus } from '@prisma/client';

export class ReportUserRefDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    fullName: string;
}

export class ReportEventRefDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;
}

export class ReportCommentRefDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    content: string;
}

export class ReportResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ enum: ReportReason })
    reason: ReportReason;

    @ApiProperty({ nullable: true })
    note: string | null;

    @ApiProperty({ enum: ReportStatus })
    status: ReportStatus;

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;

    @ApiProperty({ type: ReportUserRefDto })
    reporter: ReportUserRefDto;

    @ApiPropertyOptional({ type: ReportUserRefDto })
    reportedUser?: ReportUserRefDto;

    @ApiPropertyOptional({ type: ReportEventRefDto })
    event?: ReportEventRefDto;

    @ApiPropertyOptional({ type: ReportCommentRefDto })
    comment?: ReportCommentRefDto;
}
