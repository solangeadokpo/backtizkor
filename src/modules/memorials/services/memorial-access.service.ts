import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  MemorialAccessRequest,
  MemorialAccessRequestDocument,
  AccessRequestStatus,
  AccessType,
} from "../schemas/memorial-access-request.schema";
import { v4 as uuidv4 } from "uuid";
import { MemorialDocument } from "../schemas/memorial.schema";
import { User, UserDocument } from "../../users/schemas/user.schema";
import { Role, RoleDocument } from "../../roles/schemas/role.schema";
import { FamilyMemberServiceInterface, IFamilyMemberService } from "src/modules/family-members/services/family-member-service.interface";

@Injectable()
export class MemorialAccessService {
  constructor(
    @InjectModel(MemorialAccessRequest.name)
    private readonly accessRequestModel: Model<MemorialAccessRequestDocument>,
    @InjectModel("Memorial")
    private readonly memorialModel: Model<MemorialDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    @Inject(FamilyMemberServiceInterface)
    private readonly familyMemberService: IFamilyMemberService,
  ) {}

  async requestAccess(
    requesterId: string,
    memorialId: string,
    message?: string,
    phoneNumber?: string,
  ) {
    const memorial = await this.memorialModel.findById(memorialId);
    if (!memorial) {
      throw new NotFoundException("Mémorial non trouvé");
    }
    const existingRequest = await this.accessRequestModel.findOne({
      requester: new Types.ObjectId(requesterId),
      memorial: new Types.ObjectId(memorialId),
      status: AccessRequestStatus.PENDING,
    });

    if (existingRequest) {
      throw new BadRequestException(
        "Une demande d'accès est déjà en attente pour ce mémorial",
      );
    }

    const existingApprovedAccess = await this.accessRequestModel.findOne({
      requester: new Types.ObjectId(requesterId),
      memorial: new Types.ObjectId(memorialId),
      status: AccessRequestStatus.APPROVED,
      $or: [{ expiresAt: { $gt: new Date() } }, { isWhitelisted: true }],
    });

    if (existingApprovedAccess) {
      throw new BadRequestException(
        "Vous avez déjà un accès actif pour ce mémorial",
      );
    }

    const isFamilyMember = await this.familyMemberService.isFamilyMember(
      requesterId,
      memorialId,
    );
    if (isFamilyMember) {
      const request = await this.accessRequestModel.create({
        requester: requesterId,
        memorial: memorialId,
        message,
        phoneNumber,
        status: AccessRequestStatus.APPROVED,
        accessType: AccessType.PERMANENT,
        isWhitelisted: true,
        respondedAt: new Date(),
      });
      return request.toObject();
    }

    const request = await this.accessRequestModel.create({
      requester: requesterId,
      memorial: memorialId,
      message,
      phoneNumber,
      status: AccessRequestStatus.PENDING,
    });
    return request.toObject();
  }

  async respondToRequest(
    requestId: string,
    responderId: string,
    status:
      | AccessRequestStatus.APPROVED
      | AccessRequestStatus.REJECTED
      | AccessRequestStatus.REVOKED,
    accessType?: AccessType,
    phoneNumber?: string,
    message?: string,
  ) {
    const request = await this.accessRequestModel.findById(requestId);
    if (!request) {
      throw new NotFoundException("Demande non trouvée");
    }

    const memorial = await this.memorialModel.findById(request.memorial);
    if (!memorial) {
      throw new NotFoundException("Mémorial non trouvé");
    }

    const isAuthorized = await this.isMemorialOwnerOrAdmin(
      responderId,
      memorial._id instanceof Types.ObjectId
        ? memorial._id.toString()
        : String(memorial._id),
    );
    if (!isAuthorized) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à répondre à cette demande",
      );
    }

    request.status = status;
    request.respondedBy = new Types.ObjectId(responderId);

    const now = new Date();
    request.respondedAt = now;

    if (message) {
      request.message = message;
    }

    if (phoneNumber) {
      request.phoneNumber = phoneNumber;
    }

    if (status === AccessRequestStatus.APPROVED) {
      if (!accessType) {
        throw new BadRequestException(
          "Le type d'accès est requis pour approuver une demande",
        );
      }

      request.accessType = accessType;

      request.accessToken = uuidv4();

      if (accessType === AccessType.TEMPORARY) {
        const now = new Date();
        const expirationDate = new Date(now.getTime() + 3600000);
        request.expiresAt = expirationDate;
        request.isWhitelisted = false;

        console.log(
          `Date d'expiration définie: ${expirationDate.toISOString()}`,
        );
      } else if (accessType === AccessType.PERMANENT) {
        request.isWhitelisted = true;
        request.expiresAt = undefined;
      }
    } else if (
      status === AccessRequestStatus.REJECTED ||
      status === AccessRequestStatus.REVOKED
    ) {
      request.accessType = undefined;
      request.expiresAt = undefined;
      request.accessToken = undefined;
      request.isWhitelisted = false;
    }

    if (
      status === AccessRequestStatus.APPROVED &&
      accessType === AccessType.TEMPORARY
    ) {
      // Vérifier que expiresAt est une date valide
      if (!request.expiresAt || !(request.expiresAt instanceof Date)) {
        request.expiresAt = new Date(Date.now() + 3600000); // +1 heure
      }
    }

    const savedRequest = await request.save();

    const result = savedRequest.toObject() as Record<string, any>;

    if (result.respondedAt && result.respondedAt instanceof Date) {
      result.respondedAt = result.respondedAt.toISOString();
    }

    if (result.expiresAt && result.expiresAt instanceof Date) {
      result.expiresAt = result.expiresAt.toISOString();
    }

    if (result.createdAt && result.createdAt instanceof Date) {
      result.createdAt = result.createdAt.toISOString();
    }

    if (result.updatedAt && result.updatedAt instanceof Date) {
      result.updatedAt = result.updatedAt.toISOString();
    }

    return result;
  }

  async getUserAccessRequests(userId: string): Promise<Record<string, any>[]> {
    return this.accessRequestModel
      .find({ requester: userId })
      .populate("memorial", "name reference")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async getMemorialAccessRequests(
    memorialId: string,
  ): Promise<Record<string, any>[]> {
    return this.accessRequestModel
      .find({ memorial: memorialId })
      .populate("requester", "firstName lastName email")
      .sort({ status: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  async hasAccess(userId: string, memorialId: string): Promise<boolean> {
    const isFamilyMember = await this.familyMemberService.isFamilyMember(
      userId,
      memorialId,
    );
    if (isFamilyMember) {
      return true;
    }

    const access = await this.accessRequestModel.findOne({
      requester: new Types.ObjectId(userId),
      memorial: new Types.ObjectId(memorialId),
      status: AccessRequestStatus.APPROVED,
      $or: [{ isWhitelisted: true }, { expiresAt: { $gt: new Date() } }],
    });

    return !!access;
  }

  async isMemorialOwnerOrAdmin(
    userId: string,
    memorialId: string,
  ): Promise<boolean> {
    const isFamilyMember = await this.familyMemberService.isFamilyMember(
      userId,
      memorialId,
    );
    if (isFamilyMember) {
      return true;
    }

    const memorial = await this.memorialModel.findById(memorialId);
    if (memorial && memorial.created_by.toString() === userId) {
      return true;
    }
    try {
      const user = await this.userModel
        .findById(userId)
        .populate("role")
        .lean();

      if (!user || !user.role) {
        return false;
      }

      const role = await this.roleModel.findById(user.role._id).lean();
      if (!role) {
        return false;
      }
      return role.permissions.includes("manage_memorial_access");
    } catch (error: any) {
      console.error("Erreur lors de la vérification des permissions:", error);
      return false;
    }
  }

  async validateAccessToken(
    token: string,
    memorialId: string,
  ): Promise<boolean> {
    try {
      const access = await this.accessRequestModel.findOne({
        accessToken: token,
        memorial: new Types.ObjectId(memorialId),
        status: AccessRequestStatus.APPROVED,
      });

      if (!access) {
        console.log(
          `Token ${token} introuvable pour le mémorial ${memorialId}`,
        );
        return false;
      }

      console.log(`Token trouvé: ${JSON.stringify(access)}`);

      if (access.isWhitelisted) {
        console.log(`Accès permanent (whitelisted) validé`);
        if (!access.hasVisited) {
          access.hasVisited = true;
          await access.save();
        }
        return true;
      }

      if (access.accessType === AccessType.TEMPORARY) {
        const now = new Date();

        if (!access.expiresAt || typeof access.expiresAt !== "object") {
          console.log(
            `Date d'expiration manquante ou invalide, création d'une nouvelle date`,
          );
          access.expiresAt = new Date(now.getTime() + 3600000);
          await access.save();
          return true;
        }

        try {
          const expiryDate = new Date(access.expiresAt);
          console.log(
            `Vérification de la date d'expiration: ${expiryDate.toISOString()} vs ${now.toISOString()}`,
          );

          if (expiryDate > now) {
            console.log(`Token valide, non expiré`);
            if (!access.hasVisited) {
              access.hasVisited = true;
              await access.save();
            }
            return true;
          } else {
            console.log(`Token expiré: ${expiryDate.toISOString()}`);
            return false;
          }
        } catch (error) {
          console.error(
            `Erreur lors de la conversion de la date d'expiration:`,
            error,
          );
          access.expiresAt = new Date(now.getTime() + 3600000);
          await access.save();
          return true;
        }
      }

      console.log(`Accès refusé par défaut`);
      return false;
    } catch (error) {
      console.error(`Erreur lors de la validation du token:`, error);
      return false;
    }
  }

  async getAccessInfoByToken(
    token: string,
  ): Promise<Record<string, any> | null> {
    const accessRequest = await this.accessRequestModel
      .findOne({
        accessToken: token,
        status: AccessRequestStatus.APPROVED,
      })
      .populate("memorial", "name reference")
      .populate("requester", "first_name last_name phone_number")
      .lean()
      .exec();

    return accessRequest;
  }

  async getWhitelist(memorialId: string): Promise<Record<string, any>[]> {
    return this.accessRequestModel
      .find({
        memorial: new Types.ObjectId(memorialId),
        isWhitelisted: true,
        status: AccessRequestStatus.APPROVED,
      })
      .populate("requester", "first_name last_name phone_number")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
}
