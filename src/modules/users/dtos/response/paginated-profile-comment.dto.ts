import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '@/common/dto/pagination-meta.dto';
import { ProfileCommentDto } from './profile-comment.dto';

export class PaginatedProfileCommentDto {
    @ApiProperty({ type: [ProfileCommentDto] })
    data: ProfileCommentDto[];

    @ApiProperty({ type: PaginationMetaDto })
    meta: PaginationMetaDto;
}
