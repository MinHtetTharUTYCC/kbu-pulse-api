import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { OtpPurpose } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { VerifyRegistrationDto } from './dtos/verify-registration.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthResponseDto } from './dtos/response/auth-response.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly prisma: PrismaService) {}

    // ── OTP Helpers ────────────────────────────────────────────────

    private generateOtpCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private async createOtp(
        email: string,
        purpose: OtpPurpose,
    ): Promise<string> {
        await this.prisma.otp.deleteMany({
            where: { email, purpose },
        });

        const code = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await this.prisma.otp.create({
            data: { email, code, purpose, expiresAt },
        });

        return code;
    }

    private async verifyOtp(
        email: string,
        code: string,
        purpose: OtpPurpose,
    ): Promise<void> {
        const otp = await this.prisma.otp.findFirst({
            where: { email, code, purpose },
        });

        if (!otp) {
            throw new BadRequestException('Invalid OTP code');
        }

        if (otp.expiresAt < new Date()) {
            throw new BadRequestException('OTP code has expired');
        }

        await this.prisma.otp.delete({ where: { id: otp.id } });
    }

    // ── Register ───────────────────────────────────────────────────

    async register(
        dto: RegisterDto,
    ): Promise<{ message: string; otpCode: string }> {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@ms\.kbu\.ac\.th$/;
        if (!emailRegex.test(dto.email)) {
            throw new BadRequestException(
                'Email must end with @ms.kbu.ac.th',
            );
        }

        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                fullName: dto.fullName,
                major: dto.major,
                emailVerified: false,
            },
        });

        const otpCode = await this.createOtp(dto.email, OtpPurpose.SIGNUP);

        this.logger.log(`User registered: ${dto.email}, OTP sent`);

        return { message: 'OTP sent to email', otpCode };
    }

    // ── Verify Registration ────────────────────────────────────────

    async verifyRegistration(
        dto: VerifyRegistrationDto,
    ): Promise<AuthResponseDto> {
        await this.verifyOtp(dto.email, dto.code, OtpPurpose.SIGNUP);

        const user = await this.prisma.user.update({
            where: { email: dto.email },
            data: { emailVerified: true },
            select: {
                id: true,
                email: true,
                fullName: true,
                major: true,
            },
        });

        this.logger.log(`Email verified: ${dto.email}`);

        return user;
    }

    // ── Login ──────────────────────────────────────────────────────

    async login(dto: LoginDto): Promise<AuthResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        if (!user.emailVerified) {
            throw new UnauthorizedException(
                'Please verify your email first',
            );
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        this.logger.log(`User logged in: ${user.email}`);

        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            major: user.major,
        };
    }

    // ── Forgot Password ────────────────────────────────────────────

    async forgotPassword(
        dto: ForgotPasswordDto,
    ): Promise<{ message: string; otpCode: string }> {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new NotFoundException('Email not found');
        }

        const otpCode = await this.createOtp(
            dto.email,
            OtpPurpose.FORGOT_PASSWORD,
        );

        this.logger.log(`Forgot password: ${dto.email}, OTP sent`);

        return { message: 'OTP sent to email', otpCode };
    }

    // ── Reset Password ─────────────────────────────────────────────

    async resetPassword(
        dto: ResetPasswordDto,
    ): Promise<{ message: string }> {
        await this.verifyOtp(
            dto.email,
            dto.code,
            OtpPurpose.FORGOT_PASSWORD,
        );

        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

        await this.prisma.user.update({
            where: { email: dto.email },
            data: { password: hashedPassword },
        });

        this.logger.log(`Password reset: ${dto.email}`);

        return { message: 'Password reset successful' };
    }
}
