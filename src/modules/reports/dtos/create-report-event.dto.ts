import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReportReason } from '@prisma/client';

export class CreateReportEventDto {
    @ApiProperty({ description: 'ID of the event being reported' })
    @IsString()
    @IsNotEmpty()
    eventId: string;

    @ApiProperty({ enum: ReportReason, example: ReportReason.SPAM })
    @IsEnum(ReportReason)
    @IsNotEmpty()
    reason: ReportReason;

    @ApiPropertyOptional({ description: 'Optional note about the report' })
    @IsString()
    @IsOptional()
    note?: string;
}
