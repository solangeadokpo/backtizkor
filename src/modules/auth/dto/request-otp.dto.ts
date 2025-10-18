import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsPhoneNumber, IsIn } from "class-validator";

@Exclude()
export class RequestOtpDto {
  @Expose()
  @IsPhoneNumber()
  @ApiProperty({
    example: "+33612345678",
    description: "Numéro de téléphone de l’utilisateur",
  })
  phone_number: string;

  @Expose()
  @IsIn(["sms", "whatsapp"])
  @ApiProperty({
    example: "sms",
    description: "Canal de réception de l’OTP (sms ou whatsapp)",
    enum: ["sms", "whatsapp"],
  })
  channel: "sms" | "whatsapp";
}
