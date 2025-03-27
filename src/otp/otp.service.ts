import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface OTPEntry {
  userId: string;
  otp: string;
  generationTime: number;
}

@Injectable()
export class OtpService {
  private otpFilePath = path.join(__dirname, '../../otpStore.json');

  constructor() {
    if (!fs.existsSync(this.otpFilePath)) {
      fs.writeFileSync(this.otpFilePath, JSON.stringify([]));
    }
  }

  private readOTPStore(): OTPEntry[] {
    return JSON.parse(fs.readFileSync(this.otpFilePath, 'utf-8'));
  }

  private writeOTPStore(data: OTPEntry[]) {
    fs.writeFileSync(this.otpFilePath, JSON.stringify(data, null, 2));
  }

  generateOtp(userId: string): string {
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    const otpData = this.readOTPStore();
    const newEntry: OTPEntry = { userId, otp, generationTime: Date.now() };

    // Replace existing OTP for the user if exists
    const index = otpData.findIndex(entry => entry.userId === userId);
    if (index !== -1) {
      otpData[index] = newEntry;
    } else {
      otpData.push(newEntry);
    }

    this.writeOTPStore(otpData);
    return otp;
  }

  verifyOtp(userId: string, otp: string): string {
    const otpData = this.readOTPStore();
    const userEntry = otpData.find(entry => entry.userId === userId);

    if (!userEntry) {
      return 'Invalid OTP';
    }

    const currentTime = Date.now();
    const timeDiff = (currentTime - userEntry.generationTime) / (1000 * 60); // Convert to minutes

    if (timeDiff > 10) {
      return 'OTP Expired';
    }

    return userEntry.otp === otp ? 'OTP Verified' : 'Invalid OTP';
  }
}
