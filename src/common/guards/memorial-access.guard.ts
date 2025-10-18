import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
  Inject,
} from "@nestjs/common";
import {
  IMemorialsService,
  MemorialsServiceInterface,
} from "src/modules/memorials/interfaces/memorial-service.interface";
import { WhitelistService } from "src/modules/memorials/services/whitelist.service";
import { AppRole } from "../constants/roles.constant";
import {
  FamilyMemberServiceInterface,
  IFamilyMemberService,
} from "src/modules/family-members/services/family-member-service.interface";
import { MemorialType } from "src/modules/memorials/enums/memorial.enum";

@Injectable()
export class MemorialAccessGuard implements CanActivate {
  constructor(
    @Inject(MemorialsServiceInterface)
    private readonly memorialsService: IMemorialsService,
    @Inject(FamilyMemberServiceInterface)
    private readonly familyMemberService: IFamilyMemberService,
    // private readonly whitelistService: WhitelistService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user) throw new UnauthorizedException("User not authenticated");

    if (user.role?.name == AppRole.ADMIN) return true;

    const memorialId = request.params.id;
    if (!memorialId) throw new NotFoundException("Memorial ID missing");

    const memorial = await this.memorialsService.findOne(memorialId);
    if (!memorial) throw new NotFoundException("Memorial not found");

    const type = memorial.type; // private | public | on_demand

    if (type === MemorialType.PUBLIC) {
      // accès libre
      return true;
    }

    // Pour private et on_demand, on doit vérifier accès
    const userId = user._id || user.id;

    // Vérifier si user est dans family_members
    const isFamilyMember = await this.familyMemberService.isFamilyMember(
      memorialId,
      userId,
    );

    if (isFamilyMember) return true;

    // Vérifier si user est dans whitelist active
    // const whitelistEntry =
    //   await this.whitelistService.findValidByMemorialAndUser(
    //     memorialId,
    //     userId,
    //   );

    // if (whitelistEntry) return true;

    // Pas d'accès
    if (type === MemorialType.PRIVATE) {
      throw new ForbiddenException("Access denied: private memorial");
    }

    if (type === "on_demand") {
      throw new UnauthorizedException("Access requires permission");
    }

    // Cas par défaut
    throw new ForbiddenException("Access denied");
  }
}
