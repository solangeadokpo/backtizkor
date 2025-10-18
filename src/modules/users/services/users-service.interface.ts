import { ICrudService } from "src/core/services/crud/interfaces/crud-service.interface";
import { UserDocument } from "../schemas/user.schema";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export interface IUsersService
  extends ICrudService<UserDocument, CreateUserDto, UpdateUserDto> {
  findById(id: string): Promise<UserDocument>;

  delete(id: string): Promise<void>;

  /**
   * Finds a user by their phone number.
   * @param phone - The phone number of the user to find.
   * @returns A promise that resolves to the User object if found, or null if not found.
   */
  findByPhoneNumber(phone: string): Promise<UserDocument | null>;

  /**
   * Finds a user by their Zehout ID.
   * @param zehout_id - The Zehout ID of the user to find.
   * @returns A promise that resolves to the User object if found, or null if not found.
   */
  findByZehoutId(zehout_id: string): Promise<UserDocument | null>;
}

export const UsersServiceInterface = Symbol("UsersServiceInterface");
