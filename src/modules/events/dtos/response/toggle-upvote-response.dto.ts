import { ApiProperty } from '@nestjs/swagger';

export class ToggleUpvoteResponseDto {
    @ApiProperty()
    hasUpvoted: boolean;

    @ApiProperty()
    totalUpvotes: number;
}
