import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({
        example: 'Great project! Are you looking for UI/UX designers?',
        description: 'Comment content',
    })
    @IsString()
    @IsNotEmpty()
    content: string;
}
