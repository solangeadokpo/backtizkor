import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthGuard } from "../../../common/guards/auth.guard";
import { RolesGuard } from "../../../common/guards/roles.guard";
import { MemorialAccessService } from "../services/memorial-access.service";
import { RequestMemorialAccessDto } from "../dto/request-memorial-access.dto";
import { RespondAccessRequestDto } from "../dto/respond-access-request.dto";
import { AccessRequestStatus } from "../schemas/memorial-access-request.schema";
import { AppRole } from "src/common/constants/roles.constant";
import { Roles } from "src/common/decorators/metadata/roles.decorator";

@ApiTags("memorial-access")
@ApiBearerAuth("access-token")
@Controller("memorial-access")
export class MemorialAccessController {
  constructor(private readonly memorialAccessService: MemorialAccessService) {}

  @Post("request")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Demander l'accès à un mémorial [Authentification requise]",
  })
  @ApiResponse({
    status: 201,
    description: "Demande d'accès créée avec succès",
  })
  async requestAccess(
    @Req() req: { user: { _id: string } },
    @Body() requestDto: RequestMemorialAccessDto,
  ) {
    return this.memorialAccessService.requestAccess(
      req.user._id,
      requestDto.memorialId,
      requestDto.message,
      requestDto.phoneNumber,
    );
  }

  @Post("request/anonymous/:memorialId")
  // Route publique - pas besoin de token
  @ApiOperation({
    summary:
      "Demander l'accès à un mémorial sans authentification (via QR code) [Route publique]",
  })
  @ApiResponse({
    status: 201,
    description: "Demande d'accès anonyme créée avec succès",
  })
  @ApiParam({ name: "memorialId", description: "ID du mémorial" })
  async requestAnonymousAccess(
    @Param("memorialId") memorialId: string,
    @Body() requestDto: RequestMemorialAccessDto,
  ) {
    if (!requestDto.phoneNumber) {
      throw new BadRequestException(
        "Le numéro de téléphone est requis pour les demandes d'accès anonymes",
      );
    }

    return this.memorialAccessService.requestAccess(
      requestDto.phoneNumber,
      memorialId,
      requestDto.message,
      requestDto.phoneNumber,
    );
  }

  @Post("respond/:requestId")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN, AppRole.RELATIVE, AppRole.CLIENT)
  @ApiOperation({
    summary:
      "Répondre à une demande d'accès [Authentification requise] [Rôles: ADMIN, RELATIVE, CLIENT]",
  })
  @ApiResponse({
    status: 200,
    description: "Réponse à la demande d'accès envoyée avec succès",
  })
  @ApiParam({ name: "requestId", description: "ID de la demande d'accès" })
  async respondToRequest(
    @Req() req: { user: { _id: string } },
    @Param("requestId") requestId: string,
    @Body() respondDto: RespondAccessRequestDto,
  ) {
    if (
      respondDto.status === AccessRequestStatus.APPROVED &&
      !respondDto.accessType
    ) {
      throw new BadRequestException(
        "Le type d'accès est requis pour approuver une demande",
      );
    }

    return this.memorialAccessService.respondToRequest(
      requestId,
      req.user._id,
      respondDto.status,
      respondDto.accessType,
      respondDto.phoneNumber,
      respondDto.message,
    );
  }

  @Get("user/requests")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary:
      "Récupérer les demandes d'accès de l'utilisateur connecté [Authentification requise]",
  })
  @ApiResponse({
    status: 200,
    description: "Liste des demandes d'accès de l'utilisateur",
  })
  async getUserAccessRequests(@Req() req: { user: { _id: string } }) {
    return this.memorialAccessService.getUserAccessRequests(req.user._id);
  }

  @Get("memorial/:memorialId/requests")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN, AppRole.RELATIVE, AppRole.CLIENT)
  @ApiOperation({
    summary:
      "Récupérer les demandes d'accès pour un mémorial [Authentification requise] [Rôles: ADMIN, RELATIVE, CLIENT]",
  })
  @ApiResponse({
    status: 200,
    description: "Liste des demandes d'accès pour le mémorial",
  })
  @ApiParam({ name: "memorialId", description: "ID du mémorial" })
  async getMemorialAccessRequests(@Param("memorialId") memorialId: string) {
    return this.memorialAccessService.getMemorialAccessRequests(memorialId);
  }

  @Get("check/:memorialId")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary:
      "Vérifier si l'utilisateur a accès à un mémorial [Authentification requise]",
  })
  @ApiResponse({
    status: 200,
    description: "Statut de l'accès de l'utilisateur au mémorial",
  })
  @ApiParam({ name: "memorialId", description: "ID du mémorial" })
  async checkAccess(
    @Req() req: { user: { _id: string } },
    @Param("memorialId") memorialId: string,
  ) {
    const hasAccess = await this.memorialAccessService.hasAccess(
      req.user._id,
      memorialId,
    );
    return { hasAccess };
  }

  @Get("validate-token/:memorialId")
  @ApiOperation({
    summary: "Valider un token d'accès temporaire [Route publique]",
  })
  @ApiResponse({
    status: 200,
    description: "Statut de validité du token d'accès",
  })
  @ApiParam({ name: "memorialId", description: "ID du mémorial" })
  @ApiQuery({ name: "token", description: "Token d'accès à valider" })
  async validateToken(
    @Param("memorialId") memorialId: string,
    @Query("token") token: string,
  ) {
    if (!token) {
      throw new BadRequestException("Le token d'accès est requis");
    }

    const isValid = await this.memorialAccessService.validateAccessToken(
      token,
      memorialId,
    );

    if (!isValid) {
      throw new UnauthorizedException("Token d'accès invalide ou expiré");
    }

    return { isValid };
  }

  @Get("token-info")
  @ApiOperation({ summary: "Récupérer les informations d'un token d'accès" })
  @ApiResponse({
    status: 200,
    description: "Informations sur le token d'accès",
  })
  @ApiQuery({ name: "token", description: "Token d'accès" })
  async getTokenInfo(@Query("token") token: string) {
    if (!token) {
      throw new BadRequestException("Le token d'accès est requis");
    }

    const accessInfo =
      await this.memorialAccessService.getAccessInfoByToken(token);

    if (!accessInfo) {
      throw new NotFoundException("Token d'accès non trouvé");
    }

    return accessInfo;
  }

  @Get("whitelist/:memorialId")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN, AppRole.RELATIVE, AppRole.CLIENT)
  @ApiOperation({ summary: "Récupérer la liste blanche d'un mémorial" })
  @ApiResponse({
    status: 200,
    description: "Liste des accès permanents pour le mémorial",
  })
  @ApiParam({ name: "memorialId", description: "ID du mémorial" })
  async getWhitelist(@Param("memorialId") memorialId: string) {
    return this.memorialAccessService.getWhitelist(memorialId);
  }
}
