import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MemorialDocument } from "../../memorials/schemas/memorial.schema";
import {
  FamilyMember,
  FamilyMemberDocument,
} from "../schemas/family-member.schema";
import { MongoCrudService } from "src/core/services/crud/implementations/mongo-crud.service";
import { CreateFamilyMemberDto } from "../dto/create-family-member.dto";
import { PaginationResource } from "src/common/interfaces/json-response.interface";
import { UpdateFamilyMemberDto } from "../dto/update-family-member.dto";
import { IFamilyMemberService } from "./family-member-service.interface";

@Injectable()
export class FamilyMembersService
  extends MongoCrudService<
    FamilyMemberDocument,
    CreateFamilyMemberDto,
    UpdateFamilyMemberDto
  >
  implements IFamilyMemberService
{
  constructor(
    @InjectModel(FamilyMember.name) model: Model<FamilyMemberDocument>,
  ) {
    super(model);
  }

  async addMember(
    memorial: MemorialDocument,
    dataDto: CreateFamilyMemberDto,
  ): Promise<FamilyMemberDocument> {
    return this.model.create({ ...dataDto, memorial: memorial.id });
  }

  async findAllByMemorialId(
    page = 1,
    perPage = 10,
    memorialId: string,
  ): Promise<PaginationResource<FamilyMemberDocument>> {
    const skip = (page - 1) * perPage;
    const findQuery = { deletedAt: null, memorial: memorialId };
    const [total, items] = await Promise.all([
      this.model.countDocuments(findQuery),
      this.model.find(findQuery).skip(skip).limit(perPage),
    ]);

    return {
      total,
      page,
      perPage,
      items,
    };
  }

  async isFamilyMember(memorialId: string, userId: string): Promise<boolean> {
    const member = await this.model.findOne({
      memorial: memorialId,
      user: userId,
      deletedAt: null,
    });
    return !!member;
  }
}
