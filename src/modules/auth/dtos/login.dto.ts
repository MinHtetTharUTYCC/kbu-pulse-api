import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'student@ms.kbu.ac.th',
        description: 'KBU student email',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'Password' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
