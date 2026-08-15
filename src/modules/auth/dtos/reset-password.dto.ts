import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({
        example: 'student@ms.kbu.ac.th',
        description: 'KBU student email',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: '123456',
        description: '6-digit OTP code',
    })
    @IsString()
    @Length(6, 6)
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        example: 'newPassword123',
        description: 'New password (min 6 chars)',
    })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    newPassword: string;
}
