import { Inject, Injectable } from "@nestjs/common";
import { ILikesService } from "../interfaces/like-service.interface";
import { LikeDocument } from "../schemas/like.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  IMemorialsService,
  MemorialsServiceInterface,
} from "../interfaces/memorial-service.interface";
import { UserContextService } from "src/core/services/user-contexte.service";
import { MemorialDocument } from "../schemas/memorial.schema";

@Injectable()
export class LikesService implements ILikesService {
  constructor(
    @InjectModel("Like") private readonly likeModel: Model<LikeDocument>,
    @Inject(MemorialsServiceInterface)
    private readonly memorialsService: IMemorialsService,
  ) {}

  async toggleLike(memorialId: string): Promise<MemorialDocument> {
    const userId = UserContextService.getCurrentUserId();
    const existingLike = await this.likeModel.findOne({
      memorial: new Types.ObjectId(memorialId),
      user: new Types.ObjectId(userId),
    });

    if (existingLike) {
      return this.removeLike(existingLike.id, memorialId);
    } else {
      return this.like(memorialId);
    }
  }

  private async like(memorialId: string): Promise<MemorialDocument> {
    const like = await this.likeModel.create({
      memorial: new Types.ObjectId(memorialId),
    });
    return this.memorialsService.updateLikesCount(memorialId);
  }

  private async removeLike(
    likeId: string,
    memorialId: string,
  ): Promise<MemorialDocument> {
    const result = await this.likeModel.findByIdAndDelete(likeId);
    return this.memorialsService.updateLikesCount(memorialId, false);
  }
}
