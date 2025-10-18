import { MemorialDocument } from "src/modules/memorials/schemas/memorial.schema";
import { CreateFamilyMemberDto } from "../dto/create-family-member.dto";
import { FamilyMemberDocument } from "../schemas/family-member.schema";
import { PaginationResource } from "src/common/interfaces/json-response.interface";
import { ICrudService } from "src/core/services/crud/interfaces/crud-service.interface";
import { UpdateFamilyMemberDto } from "../dto/update-family-member.dto";

export interface IFamilyMemberService
  extends ICrudService<
    FamilyMemberDocument,
    CreateFamilyMemberDto,
    UpdateFamilyMemberDto
  > {
  /**
   * Adds a new family member to the specified memorial.
   *
   * @param memorial - The memorial document to which the family member will be added.
   * @param dataDto - The data transfer object containing information about the family member to create.
   * @returns A promise that resolves to the created FamilyMemberDocument.
   */
  addMember(
    memorial: MemorialDocument,
    dataDto: CreateFamilyMemberDto,
  ): Promise<FamilyMemberDocument>;

  /**
   * Retrieves a paginated list of family members associated with a specific memorial.
   *
   * @param page - The page number to retrieve.
   * @param perPage - The number of items per page.
   * @param memorialId - The unique identifier of the memorial.
   * @returns A promise that resolves to a PaginationResource containing FamilyMemberDocuments.
   */
  findAllByMemorialId(
    page: number,
    perPage: number,
    memorialId: string,
  ): Promise<PaginationResource<FamilyMemberDocument>>;

  /**
   * Checks if a user is a family member of a specific memorial.
   *
   * @param memorialId - The unique identifier of the memorial.
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to true if the user is a family member, otherwise false.
   */
  isFamilyMember(memorialId: string, userId: string): Promise<boolean>;
}

export const FamilyMemberServiceInterface = Symbol(
  "FamilyMemberServiceInterface",
);
