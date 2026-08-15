import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
    @ApiProperty({
        example: 'student@ms.kbu.ac.th',
        description: 'KBU student email',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
