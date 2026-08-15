import { ApiProperty } from '@nestjs/swagger';
import { Major } from '@prisma/client';

export class UserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty({ enum: Major })
    major: Major;

    @ApiProperty({ required: false, nullable: true })
    avatarUrl: string | null;

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;
}
