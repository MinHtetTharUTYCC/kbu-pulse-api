import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Category, Major } from '@prisma/client';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export class EventsQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        enum: Category,
        description: 'Filter by event category',
    })
    @IsEnum(Category)
    @IsOptional()
    category?: Category;

    @ApiPropertyOptional({
        enum: Major,
        description: "Filter by event major",
    })
    @IsEnum(Major)
    @IsOptional()
    major?: Major;

    @ApiPropertyOptional({ description: 'Search in title and description' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({
        enum: ['newest', 'trending'],
        default: 'newest',
        description: 'Sort order',
    })
    @IsString()
    @IsOptional()
    sort?: 'newest' | 'trending' = 'newest';
}

