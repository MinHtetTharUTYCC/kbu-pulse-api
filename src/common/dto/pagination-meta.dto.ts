import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
    @ApiProperty({ type: 'number' })
    total: number;

    @ApiProperty({ type: 'number' })
    page: number;

    @ApiProperty({ type: 'number' })
    limit: number;

    @ApiProperty({ type: 'number' })
    totalPages: number;
}
