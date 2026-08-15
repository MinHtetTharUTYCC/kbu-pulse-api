import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Major } from '@prisma/client';

export class RegisterDto {
    @ApiProperty({
        example: 'student@ms.kbu.ac.th',
        description: 'KBU student email (must end with @ms.kbu.ac.th)',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'Password (min 6 chars)' })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'John Snow', description: 'Full name' })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ enum: Major, example: Major.DTI, description: 'Major' })
    @IsEnum(Major)
    @IsNotEmpty()
    major: Major;
}
