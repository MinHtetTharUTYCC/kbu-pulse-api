import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { VerifyRegistrationDto } from './dtos/verify-registration.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthResponseDto } from './dtos/response/auth-response.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user account (returns OTP)' })
    @ApiResponse({
        status: 201,
        description: 'OTP sent to email',
        schema: {
            example: {
                message: 'OTP sent to email',
                otpCode: '123456',
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Invalid email domain or validation failed' })
    @ApiResponse({ status: 409, description: 'Email already registered' })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('verify-registration')
    @ApiOperation({ summary: 'Verify registration with OTP code' })
    @ApiResponse({
        status: 200,
        description: 'Email verified, user returned',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Invalid or expired OTP code' })
    async verifyRegistration(
        @Body() dto: VerifyRegistrationDto,
    ): Promise<AuthResponseDto> {
        return this.authService.verifyRegistration(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials or email not verified' })
    async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
        return this.authService.login(dto);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Request password reset OTP' })
    @ApiResponse({
        status: 200,
        description: 'OTP sent to email',
        schema: {
            example: {
                message: 'OTP sent to email',
                otpCode: '123456',
            },
        },
    })
    @ApiResponse({ status: 404, description: 'Email not found' })
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto);
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password with OTP code' })
    @ApiResponse({
        status: 200,
        description: 'Password reset successful',
        schema: {
            example: { message: 'Password reset successful' },
        },
    })
    @ApiResponse({ status: 400, description: 'Invalid or expired OTP code' })
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }
}
