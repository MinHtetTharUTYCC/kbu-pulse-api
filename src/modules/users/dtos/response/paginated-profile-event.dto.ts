import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '@/common/dto/pagination-meta.dto';
import { ProfileEventDto } from './profile-event.dto';

export class PaginatedProfileEventDto {
    @ApiProperty({ type: [ProfileEventDto] })
    data: ProfileEventDto[];

    @ApiProperty({ type: PaginationMetaDto })
    meta: PaginationMetaDto;
}
