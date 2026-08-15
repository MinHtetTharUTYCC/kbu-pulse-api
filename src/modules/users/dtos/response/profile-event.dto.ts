import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';

export class ProfileEventDto {
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

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;

    @ApiProperty()
    upvoteCount: number;

    @ApiProperty()
    commentCount: number;
}
