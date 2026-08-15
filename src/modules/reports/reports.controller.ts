import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiHeader,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ReportsService } from './reports.service';
import { CreateReportUserDto } from './dtos/create-report-user.dto';
import { CreateReportEventDto } from './dtos/create-report-event.dto';
import { CreateReportCommentDto } from './dtos/create-report-comment.dto';
import { ReportResponseDto } from './dtos/response/report-response.dto';

@ApiTags('Reports')
@ApiHeader({
    name: 'x-user-id',
    description: 'User UUID (from localStorage)',
    required: false,
})
@Controller('api/reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Post('user')
    @ApiOperation({ summary: 'Report a user' })
    @ApiResponse({ status: 201, description: 'Report created', type: ReportResponseDto })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 409, description: 'Duplicate pending report or self-report' })
    async reportUser(
        @CurrentUser() reporterId: string,
        @Body() dto: CreateReportUserDto,
    ): Promise<ReportResponseDto> {
        return this.reportsService.reportUser(reporterId, dto);
    }

    @Post('event')
    @ApiOperation({ summary: 'Report an event' })
    @ApiResponse({ status: 201, description: 'Report created', type: ReportResponseDto })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    @ApiResponse({ status: 409, description: 'Duplicate pending report' })
    async reportEvent(
        @CurrentUser() reporterId: string,
        @Body() dto: CreateReportEventDto,
    ): Promise<ReportResponseDto> {
        return this.reportsService.reportEvent(reporterId, dto);
    }

    @Post('comment')
    @ApiOperation({ summary: 'Report a comment' })
    @ApiResponse({ status: 201, description: 'Report created', type: ReportResponseDto })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Comment not found' })
    @ApiResponse({ status: 409, description: 'Duplicate pending report' })
    async reportComment(
        @CurrentUser() reporterId: string,
        @Body() dto: CreateReportCommentDto,
    ): Promise<ReportResponseDto> {
        return this.reportsService.reportComment(reporterId, dto);
    }
}
