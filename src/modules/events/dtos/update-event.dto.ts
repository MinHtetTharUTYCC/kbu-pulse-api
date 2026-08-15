import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Category } from '@prisma/client';

export class UpdateEventDto {
    @ApiPropertyOptional({ example: 'Smart Campus App v2' })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({ example: 'Updated description...' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        enum: Category,
        example: Category.HACKATHON,
    })
    @IsEnum(Category)
    @IsOptional()
    category?: Category;
}
