import { MemorialDocument } from "../schemas/memorial.schema";

export interface ILikesService {
  toggleLike(memorialId: string): Promise<MemorialDocument>;
}

export const LikesServiceInterface = Symbol("LikesServiceInterface");
