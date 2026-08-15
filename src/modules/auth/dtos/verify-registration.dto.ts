import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyRegistrationDto {
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
}
