import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { IAuthService } from "./auth-service.interface";
import {
  ISmsService,
  SmsServiceInterface,
} from "src/core/services/messaging/interfaces/sms-service.interface";
import {
  IWhatsappService,
  WhatsappServiceInterface,
} from "src/core/services/messaging/interfaces/whatsapp-service.interface";
import {
  IUsersService,
  UsersServiceInterface,
} from "src/modules/users/services/users-service.interface";
import { OtpService } from "./otp.service";
import { JwtService } from "src/core/services/jwt/jwt.service";
import { IJwtPayload } from "src/core/services/jwt/jwt.interface";
import { UserStatus } from "src/modules/users/user-status.enum";
import { plainToClass } from "class-transformer";
import { UserDto } from "src/modules/users/dto/user.dto";
import { AuthDto } from "../dto/auth.dto";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly otpService: OtpService,
    @Inject(SmsServiceInterface) private readonly smsService: ISmsService,
    @Inject(WhatsappServiceInterface)
    private readonly whatsappService: IWhatsappService,
    @Inject(UsersServiceInterface) private readonly userService: IUsersService,
    private readonly jwtService: JwtService,
  ) {}

  async requestOtp(phone: string, channel: "sms" | "whatsapp"): Promise<void> {
    const otp = await this.otpService.generateOtp(phone);
    const message = `Your OTP is: ${otp}`;

    if (channel === "sms") {
      await this.smsService.sendMessage(phone, message);
    } else {
      await this.whatsappService.sendMessage(phone, message);
    }
  }

  async verifyOtp(phone: string, otp: string): Promise<AuthDto> {
    const isValid = await this.otpService.verifyOtp(phone, otp);
    if (!isValid) {
      throw new UnauthorizedException(
        "Invalid OTP",
        "The provided OTP is invalid or has expired.",
      );
    }

    let user = await this.userService.findByPhoneNumber(phone);
    console.log(`User found: ${user ? user._id : "No user found"}`);

    if (!user) {
      user = await this.userService.create({ phone_number: phone });
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        "User not active",
        "The user account is not active. Please contact support.",
      );
    }

    const payload: IJwtPayload = {
      sub: user._id as string,
      phone: user.phone_number,
    };
    const token = await this.jwtService.sign(payload);

    // Update the user's last login time or other fields here
    await this.userService.update(user._id as string, {
      last_login: new Date(),
    });

    return {
      access_token: token,
      user: plainToClass(UserDto, user),
      expires_in: process.env.JWT_EXPIRES_IN
        ? parseInt(process.env.JWT_EXPIRES_IN, 10)
        : 3600,
      token_type: "Bearer",
    };
  }
}
