import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  NotFoundException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { Types } from "mongoose";
import {
  IMemorialsService,
  MemorialsServiceInterface,
} from "../interfaces/memorial-service.interface";
import { MemorialDocument } from "../schemas/memorial.schema";

@Injectable()
export class ParseMemorialPipe implements PipeTransform {
  constructor(
    @Inject(MemorialsServiceInterface)
    private readonly memorialsService: IMemorialsService,
  ) {}

  async transform(
    value: any,
    metadata: ArgumentMetadata,
  ): Promise<MemorialDocument> {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException("Invalid Memorial ID");
    }

    const memorial = await this.memorialsService.findOne(value);
    if (!memorial) {
      throw new NotFoundException(`Memorial with ID '${value}' not found`);
    }

    return memorial;
  }
}
