import { ApiProperty } from '@nestjs/swagger';

export class ToggleLikeResponseDto {
    @ApiProperty()
    hasLiked: boolean;

    @ApiProperty()
    totalLikes: number;
}
