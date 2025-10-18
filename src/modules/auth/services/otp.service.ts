import { Injectable } from "@nestjs/common";
import { IOtpService } from "./otp-service.interface";
import { RedisCacheService } from "src/core/cache/redis/redis-cache.service";

@Injectable()
export class OtpService implements IOtpService {
  constructor(private readonly cacheService: RedisCacheService) {}

  /**
   * Generates a random one-time password (OTP) of the specified length.
   * @param length The length of the OTP to generate (default is 6).
   * @returns A string representing the generated OTP.
   */
  private generateRandomOtp(length: number = 6): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join(
      "",
    );
  }

  /**
   * Generates a one-time password (OTP) for the specified user.
   * @param phone The ID of the user for whom the OTP is being generated.
   * @param ttl The time-to-live for the OTP in milliseconds (default is 5 minutes).
   * @returns A promise that resolves to the generated OTP.
   */
  async generateOtp(
    phone: string,
    ttl: number = 5 * 60 * 1000,
  ): Promise<string> {
    const otp = this.generateRandomOtp();
    await this.cacheService.set(`otp:${phone}`, otp, ttl);

    return otp;
  }

  /**
   * Verifies the provided OTP for the specified user.
   * @param phone The ID of the user whose OTP is being verified.
   * @param otp The OTP to verify.
   * @returns A promise that resolves to a boolean indicating whether the OTP is valid.
   */
  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    const record = await this.cacheService.get<string>(`otp:${phone}`);

    return record ? record === otp : false;
  }

  /**
   * Resends the OTP to the user.
   * @param phone The ID of the user to whom the OTP is being resent.
   * @returns A promise that resolves to the resent OTP.
   */
  async resendOtp(phone: string): Promise<string> {
    return this.generateOtp(phone);
  }
}
