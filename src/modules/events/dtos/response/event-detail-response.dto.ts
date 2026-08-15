import { ApiProperty } from '@nestjs/swagger';
import { Category, Major } from '@prisma/client';

export class EventCreatorDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty({ enum: Major })
    major: Major;
}

export class EventDetailDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ enum: Category })
    category: Category;

    @ApiProperty({ type: [String] })
    imageUrls: string[];

    @ApiProperty()
    viewCount: number;

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;

    @ApiProperty({ type: EventCreatorDto })
    creator: EventCreatorDto;

    @ApiProperty()
    upvoteCount: number;

    @ApiProperty()
    commentCount: number;

    @ApiProperty()
    hasUpvoted: boolean;

    @ApiProperty()
    hasSaved: boolean;
}
