import { ApiProperty } from '@nestjs/swagger';

export class CommentAuthorDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty({ nullable: true })
    avatarUrl: string | null;
}

export class CommentListItemDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    content: string;

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;

    @ApiProperty({ type: CommentAuthorDto })
    author: CommentAuthorDto;

    @ApiProperty()
    totalLikes: number;

    @ApiProperty()
    hasLiked: boolean;
}
