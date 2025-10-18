/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { Model, Types } from "mongoose";
import { IUsersService } from "./users-service.interface";
import { MongoCrudService } from "src/core/services/crud/implementations/mongo-crud.service";
import {
  IRolesService,
  RolesServiceInterface,
} from "src/modules/roles/services/roles-service.interface";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { AppRole } from "src/common/constants/roles.constant";
import { PaginationResource } from "src/common/interfaces/json-response.interface";
import { Logger } from "@nestjs/common";

@Injectable()
export class UsersService
  extends MongoCrudService<UserDocument, CreateUserDto, UpdateUserDto>
  implements IUsersService
{
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(RolesServiceInterface) private rolesService: IRolesService,
  ) {
    super(userModel);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    this.logger.log("Données reçues pour création:", createUserDto);
    this.logger.log("phoneNumber:", createUserDto.phone_number);

    const userPayload: Partial<UserDocument> = {
      ...createUserDto,
    } as Partial<UserDocument>;

    if (createUserDto.role) {
      const role = await this.rolesService.findByName(
        createUserDto.role.toString(),
      );
      if (!role) {
        throw new NotFoundException(
          "Role not found",
          `Role with id ${createUserDto.role.toString()} not found`,
        );
      }
      userPayload.role = role._id as Types.ObjectId;
    } else {
      const defaultRole = await this.rolesService.findByName(AppRole.VISITOR);
      if (!defaultRole) {
        throw new NotFoundException(
          "Default role not found",
          `Default role not found: ${AppRole.VISITOR}`,
        );
      }
      userPayload.role = defaultRole._id as Types.ObjectId;
    }

    const user = new this.userModel(userPayload);
    this.logger.log("User avant save:", user);
    return user.save();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    this.logger.log(
      `Mise à jour utilisateur ID: ${id} avec DTO:`,
      updateUserDto,
    );
    const updatePayload: Partial<UserDocument> = {
      ...updateUserDto,
    } as Partial<UserDocument>;

    if (updateUserDto.role) {
      const role = await this.rolesService.findByName(
        updateUserDto.role.toString(),
      );
      if (!role) {
        throw new NotFoundException(
          "Role not found for update",
          `Role not found: ${updateUserDto.role.toString()}`,
        );
      }
      updatePayload.role = role._id as Types.ObjectId;
    } else if (
      Object.prototype.hasOwnProperty.call(updateUserDto, "role") &&
      updateUserDto.role === null
    ) {
      delete updatePayload.role;
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updatePayload, { new: true })
      .populate("role", "name")
      .exec();
    if (!user) {
      throw new NotFoundException("User not found", `User not found: ${id}`);
    }
    this.logger.log("Utilisateur mis à jour:", user);
    return user;
  }

  async delete(id: string): Promise<void> {
    this.logger.log(
      `Tentative de suppression douce pour l'utilisateur ID: ${id}`,
    );
    const user = await this.userModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(
        "User not found for deletion",
        `User not found: ${id}`,
      );
    }
    this.logger.log("Utilisateur supprimé (doux):", user);
  }

  async findAll(
    page: number = 1,
    perPage: number = 10,
  ): Promise<PaginationResource<UserDocument>> {
    const skip = (page - 1) * perPage;

    const queryConditions = { deletedAt: null };

    const total = await this.userModel.countDocuments(queryConditions).exec();
    const users = await this.userModel
      .find(queryConditions)
      .populate("role", "name")
      .skip(skip)
      .limit(perPage)
      .lean()
      .exec();

    return {
      items: users,
      total,
      page,
      perPage,
    } as PaginationResource<UserDocument>;
  }

  async findById(id: string): Promise<UserDocument> {
    this.logger.log(
      `Recherche utilisateur par ID: ${id} avec population du rôle`,
    );
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(id), deletedAt: null })
      .populate("role", "name")
      .exec();
    if (!user) {
      this.logger.warn(`Utilisateur non trouvé ou supprimé pour ID: ${id}`);
      throw new NotFoundException(
        `User with id ${id} not found or has been deleted`,
      );
    }
    this.logger.log("Utilisateur trouvé:", user.role);
    return user;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserDocument | null> {
    this.logger.log(
      `Recherche utilisateur par phoneNumber: ${phoneNumber} (non supprimé)`,
    );
    return this.userModel
      .findOne({ phone_number: phoneNumber, deletedAt: null })
      .populate("role", "name")
      .lean()
      .exec();
  }

  async findByZehoutId(zehoutId: string): Promise<UserDocument | null> {
    this.logger.log(
      `Recherche utilisateur par zehoutId: ${zehoutId} (non supprimé)`,
    );
    return this.userModel
      .findOne({ zehout_id: zehoutId, deletedAt: null })
      .populate("role", "name")
      .lean()
      .exec();
  }
}
