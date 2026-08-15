import { ApiProperty } from '@nestjs/swagger';

export class CommentAuthorDto {
    @ApiProperty()
    fullName: string;
}

export class CommentListItemDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    content: string;

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;

    @ApiProperty()
    userId: string;

    @ApiProperty({ type: CommentAuthorDto })
    author: CommentAuthorDto;

    @ApiProperty()
    totalLikes: number;

    @ApiProperty()
    hasLiked: boolean;
}
