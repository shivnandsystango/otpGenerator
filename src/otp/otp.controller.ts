import { Controller, Post, Body, Param } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('_generate/:id')
  generateOtp(@Param('id') userId: string) {
    const otp = this.otpService.generateOtp(userId);
    return { userId, otp };
  }

  @Post('_verify/:id')
  verifyOtp(@Param('id') userId: string, @Body('otp') otp: string) {
    const result = this.otpService.verifyOtp(userId, otp);
    return { userId, result };
  }
}
