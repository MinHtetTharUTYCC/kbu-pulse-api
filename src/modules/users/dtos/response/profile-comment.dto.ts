import { ApiProperty } from '@nestjs/swagger';

export class ProfileCommentEventDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;
}

export class ProfileCommentDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    content: string;

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;

    @ApiProperty({ type: ProfileCommentEventDto })
    event: ProfileCommentEventDto;

    @ApiProperty()
    totalLikes: number;
}
