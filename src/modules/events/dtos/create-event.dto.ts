import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { Category } from '@prisma/client';

export class CreateEventDto {
    @ApiProperty({ example: 'Smart Campus App', description: 'Event title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: 'Building a shuttle tracker for uni...',
        description: 'Event description',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        enum: Category,
        example: Category.CAPSTONE,
        description: 'Event category',
    })
    @IsEnum(Category)
    @IsNotEmpty()
    category: Category;

    @ApiProperty({
        example: ['https://example.com/img1.webp'],
        description: 'List of image URLs (max 4)',
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    imageUrls?: string[];
}
