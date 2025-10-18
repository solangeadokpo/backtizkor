export interface IOtpService {
  /**
   * Generates a one-time password (OTP) for the specified user.
   * @param userId The ID of the user for whom the OTP is being generated.
   * @returns A promise that resolves to the generated OTP.
   */
  generateOtp(userId: string): Promise<string>;

  /**
   * Verifies the provided OTP for the specified user.
   * @param userId The ID of the user whose OTP is being verified.
   * @param otp The OTP to verify.
   * @returns A promise that resolves to a boolean indicating whether the OTP is valid.
   */
  verifyOtp(userId: string, otp: string): Promise<boolean>;

  /**
   * Resends the OTP to the user.
   * @param userId The ID of the user to whom the OTP is being resent.
   * @returns A promise that resolves to the resent OTP.
   */
  resendOtp(userId: string): Promise<string>;
}

export const OtpServiceInterface = Symbol("OtpServiceInterface");
