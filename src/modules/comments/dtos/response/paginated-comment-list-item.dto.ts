import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '@/common/dto/pagination-meta.dto';
import { CommentListItemDto } from './comment-response.dto';

export class PaginatedCommentListItemDto {
    @ApiProperty({ type: [CommentListItemDto] })
    data: CommentListItemDto[];

    @ApiProperty({ type: PaginationMetaDto })
    meta: PaginationMetaDto;
}
