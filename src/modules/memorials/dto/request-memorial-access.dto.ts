import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RequestMemorialAccessDto {
  @ApiProperty({
    description: "ID du mémorial pour lequel l'accès est demandé",
  })
  @IsNotEmpty()
  @IsString()
  memorialId: string;

  @ApiProperty({
    description: "Message optionnel accompagnant la demande",
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: "Numéro de téléphone ou WhatsApp du demandeur",
    required: false,
    example: "+33612345678",
  })
  @IsOptional()
  @IsPhoneNumber(undefined, {
    message: "Le numéro de téléphone doit être valide",
  })
  phoneNumber?: string;
}
