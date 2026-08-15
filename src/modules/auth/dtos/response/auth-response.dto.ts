import { ApiProperty } from '@nestjs/swagger';
import { Major } from '@prisma/client';

export class AuthResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty({ enum: Major })
    major: Major;
}
