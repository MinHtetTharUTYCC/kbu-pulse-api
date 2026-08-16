import { ApiProperty } from '@nestjs/swagger';
import { Category, Major } from '@prisma/client';

export class EventAuthorDto {
    @ApiProperty()
    fullName: string;

    @ApiProperty({ enum: Major })
    major: Major;
}

export class EventListItemDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ enum: Category })
    category: Category;

    @ApiProperty({ enum: Major, nullable: true })
    major: Major | null;

    @ApiProperty({ type: [String] })
    imageUrls: string[];

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;

    @ApiProperty({ type: EventAuthorDto })
    author: EventAuthorDto;

    @ApiProperty()
    upvoteCount: number;

    @ApiProperty()
    commentCount: number;

    @ApiProperty()
    hasUpvoted: boolean;

    @ApiProperty()
    hasSaved: boolean;
}

