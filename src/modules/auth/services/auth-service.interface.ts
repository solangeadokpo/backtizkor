import { AuthDto } from "../dto/auth.dto";

export interface IAuthService {
  /**
   * Requests an OTP for the given phone number and channel.
   * @param phoneNumber The phone number to send the OTP to.
   * @param channel The channel through which the OTP will be sent (e.g., SMS, email).
   */
  requestOtp(phoneNumber: string, channel: string): Promise<void>;

  /**
   * Verifies the OTP for the given phone number.
   * @param phoneNumber The phone number associated with the OTP.
   * @param otp The OTP to verify.
   * @returns An AuthDto containing authentication details if verification is successful.
   */
  verifyOtp(phoneNumber: string, otp: string): Promise<AuthDto>;
}

export const AuthServiceInterface = Symbol("AuthServiceInterface");
