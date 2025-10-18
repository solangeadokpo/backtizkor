// dto/verify-otp.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsPhoneNumber, IsString, Length } from "class-validator";

@Exclude()
export class VerifyOtpDto {
  @Expose()
  @IsPhoneNumber()
  @ApiProperty({
    example: "+33612345678",
    description: "Numéro de téléphone de l'utilisateur",
  })
  phone_number: string;

  @Expose()
  @IsString()
  @Length(4, 6)
  @ApiProperty({
    example: "123456",
    description: "OTP reçu par l'utilisateur (code à 6 chiffres)",
  })
  otp: string;
}
