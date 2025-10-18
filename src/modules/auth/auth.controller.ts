import { Controller, Post, Body, Inject } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { RequestOtpDto } from "./dto/request-otp.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { successResponse } from "src/common/utils/json-response.helper";
import { JsonResponse } from "src/common/interfaces/json-response.interface";
import { AuthDto } from "./dto/auth.dto";
import { ApiResponseSchema } from "src/common/decorators/responses/api-response.decorator";
import {
  AuthServiceInterface,
  IAuthService,
} from "./services/auth-service.interface";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller({ path: "auth", version: "1" })
@ApiTags("Auth")
@ApiBearerAuth("access-token")
export class AuthController {
  constructor(
    @Inject(AuthServiceInterface) private readonly authService: IAuthService,
  ) {}

  @Post("otp/request")
  @ApiResponseSchema(Object)
  async requestOtp(@Body() dto: RequestOtpDto): Promise<JsonResponse<null>> {
    await this.authService.requestOtp(dto.phone_number, dto.channel);
    return successResponse(null, "OTP sent successfully");
  }

  @Post("otp/verify")
  @ApiResponseSchema(AuthDto)
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<JsonResponse<AuthDto>> {
    const data = await this.authService.verifyOtp(dto.phone_number, dto.otp);
    return successResponse(data, "Authenticated successfully");
  }
}
