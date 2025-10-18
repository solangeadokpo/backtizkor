import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  AccessRequestStatus,
  AccessType,
} from "../schemas/memorial-access-request.schema";

export class RespondAccessRequestDto {
  @ApiProperty({
    description: "Nouveau statut de la demande",
    enum: [
      AccessRequestStatus.APPROVED,
      AccessRequestStatus.REJECTED,
      AccessRequestStatus.REVOKED,
    ],
    example: AccessRequestStatus.APPROVED,
  })
  @IsNotEmpty()
  @IsEnum([
    AccessRequestStatus.APPROVED,
    AccessRequestStatus.REJECTED,
    AccessRequestStatus.REVOKED,
  ])
  status: Exclude<AccessRequestStatus, AccessRequestStatus.PENDING>;

  @ApiProperty({
    description: "Type d'accès (temporaire ou permanent)",
    enum: [AccessType.TEMPORARY, AccessType.PERMANENT],
    required: false,
    example: AccessType.TEMPORARY,
  })
  @IsOptional()
  @IsEnum([AccessType.TEMPORARY, AccessType.PERMANENT])
  accessType?: AccessType;

  @ApiProperty({
    description: "Numéro de téléphone ou WhatsApp du demandeur",
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber(undefined, {
    message: "Le numéro de téléphone doit être valide",
  })
  phoneNumber?: string;

  @ApiProperty({
    description: "Message optionnel pour expliquer la décision",
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}
