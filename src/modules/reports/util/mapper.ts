import { ReportResponseDto } from '../dtos/response/report-response.dto';
import { ReportPayload } from './select';

export function toReportResponse(report: ReportPayload): ReportResponseDto {
    return {
        id: report.id,
        reason: report.reason,
        note: report.note,
        status: report.status,
        createdAt: report.createdAt,
        reporter: {
            id: report.reporter!.id,
            fullName: report.reporter!.fullName,
        },
        reportedUser: report.reportedUser
            ? {
                  id: report.reportedUser.id,
                  fullName: report.reportedUser.fullName,
              }
            : undefined,
        event: report.event
            ? {
                  id: report.event.id,
                  title: report.event.title,
              }
            : undefined,
        comment: report.comment
            ? {
                  id: report.comment.id,
                  content: report.comment.content,
              }
            : undefined,
    };
}
