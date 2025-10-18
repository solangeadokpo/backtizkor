import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  MemorialWhitelist,
  MemorialWhitelistDocument,
} from "../schemas/memorial-whitelist";
import { Model } from "mongoose";

@Injectable()
export class WhitelistService {
  constructor(
    @InjectModel(MemorialWhitelist.name)
    private whitelistModel: Model<MemorialWhitelistDocument>,
  ) {}

  async findValidByMemorialAndUser(
    memorialId: string,
    userId: string,
  ): Promise<MemorialWhitelist | null> {
    const now = new Date();

    return this.whitelistModel.findOne({
      memorial_id: memorialId,
      user_id: userId,
      deleted_at: null,
      start_date: { $lte: now },
      $or: [
        { access_duration: { $exists: false } },
        { access_duration: null },
        {
          // start_date + access_duration (en heures) > now
          $expr: {
            $gt: [
              {
                $add: [
                  "$start_date",
                  { $multiply: ["$access_duration", 3600000] },
                ],
              },
              now,
            ],
          },
        },
      ],
    });
  }
}
