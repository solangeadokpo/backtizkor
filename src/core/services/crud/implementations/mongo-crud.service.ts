import { PaginationResource } from "src/common/interfaces/json-response.interface";
import { Model, UpdateQuery } from "mongoose";
import { NotFoundException } from "@nestjs/common";
import { ICrudService } from "../interfaces/crud-service.interface";

export abstract class MongoCrudService<T, CreateDto, UpdateDto>
  implements ICrudService<T, CreateDto, UpdateDto>
{
  constructor(protected readonly model: Model<T>) {}

  /**
   * Creates a new resource based on the provided createDto data.
   *
   * @param createDto The data required to create the new resource.
   * @returns A promise containing the newly created resource.
   */
  async create(createDto: CreateDto): Promise<T> {
    return await this.model.create(createDto);
  }

  /**
   * Retrieves a paginated list of all non-deleted resources.
   *
   * @param page The page number to retrieve.
   * @param perPage The number of resources per page.
   * @returns A promise containing the paginated list of resources.
   */
  async findAll(page = 1, perPage = 10): Promise<PaginationResource<T>> {
    const skip = (page - 1) * perPage;
    const findQuery = { deletedAt: null };
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

  /**
   * Retrieves a specific non-deleted resource based on its identifier.
   *
   * @param id The identifier of the resource to retrieve.
   * @returns A promise containing the retrieved resource.
   */
  async findOne(id: string, populate?: string | any[]): Promise<T> {
    let query = this.model.findOne({ _id: id, deletedAt: null });
    if (populate) {
      query = query.populate(populate);
    }
    const doc = await query;
    if (!doc)
      throw new NotFoundException(
        `${this.model.name} with id ${id} not found or has been deleted`,
      );
    return doc;
  }

  /**
   * Updates a specific resource based on its identifier and the provided updateDto data.
   *
   * @param id The identifier of the resource to update.
   * @param updateDto The data required to update the resource.
   * @returns A promise containing the updated resource.
   */
  async update(id: string, updateDto: UpdateDto): Promise<T> {
    const updated = await this.model.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: updateDto } as UpdateQuery<T>,
      { new: true },
    );
    if (!updated)
      throw new NotFoundException(`${this.model.name} with id ${id} not found`);

    return updated;
  }

  /**
   * Permanently deletes a specific resource from the database based on its identifier.
   *
   * @param id The identifier of the resource to hard delete.
   * @returns void
   */
  async remove(id: string): Promise<void> {
    const result = await this.model.findByIdAndDelete(id);
    if (!result)
      throw new NotFoundException(`${this.model.name} with id ${id} not found`);
  }

  /**
   * Soft deletes a specific resource based on its identifier,
   * marking it as removed without permanently deleting it from the database.
   *
   * @param id The identifier of the resource to soft delete.
   * @returns void
   */
  async softRemove(id: string): Promise<void> {
    const updated = await this.model.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    } as UpdateQuery<T>);
    if (!updated)
      throw new NotFoundException(`${this.model.name} with id ${id} not found`);
  }

  /**
   * Restores a previously soft-deleted resource based on its identifier.
   *
   * @param id The identifier of the resource to restore.
   * @returns void
   */
  async restore(id: string): Promise<void> {
    const updated = await this.model.findByIdAndUpdate(id, {
      deletedAt: null,
    } as UpdateQuery<T>);
    if (!updated)
      throw new NotFoundException(`${this.model.name} with id ${id} not found`);
  }
}
