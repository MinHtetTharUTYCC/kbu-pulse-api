import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '@/common/dto/pagination-meta.dto';
import { EventListItemDto } from './event-response.dto';

export class PaginatedEventListItemDto {
    @ApiProperty({ type: [EventListItemDto] })
    data: EventListItemDto[];

    @ApiProperty({ type: PaginationMetaDto })
    meta: PaginationMetaDto;
}
