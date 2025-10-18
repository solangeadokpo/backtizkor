import { PaginationResource } from "src/common/interfaces/json-response.interface";

export interface ICrudService<T, CreateDto, UpdateDto> {
  /**
   * Creates a new resource based on the provided createDto data.
   *
   * @param createDto The data required to create the new resource.
   * @returns A promise containing the JSON response with the details of the newly created resource.
   */
  create(createDto: CreateDto): Promise<T>;

  /**
   * Retrieves a paginated list of all resources.
   *
   * @param page The page number to retrieve.
   * @param perPage The number of resources per page.
   * @returns A promise containing the JSON response with the paginated list of resources.
   */
  findAll(page: number, perPage: number): Promise<PaginationResource<T>>;

  /**
   * Retrieves a specific resource based on its identifier.
   *
   * @param id The identifier of the resource to retrieve.
   * @returns A promise containing the JSON response with the details of the retrieved resource.
   */
  findOne(id: string, populate?: string | any[]): Promise<T>;

  /**
   * Updates a specific resource based on its identifier and the provided updateDto data.
   *
   * @param id The identifier of the resource to update.
   * @param updateDto The data required to update the resource.
   * @returns A promise containing the JSON response with the details of the updated resource.
   */
  update(id: string, updateDto: UpdateDto): Promise<T>;

  /**
   * Permanently deletes a specific resource from the database based on its identifier.
   *
   * @param id The identifier of the resource to hard delete.
   * @returns A promise containing the JSON response indicating the success of the operation.
   */
  remove(id: string): Promise<void>;

  /**
   * Restores a previously soft-deleted resource based on its identifier.
   *
   * @param id The identifier of the resource to restore.
   * @returns A promise containing the JSON response indicating the success of the operation.
   */
  restore(id: string): Promise<void>;

  /**
   * Soft deletes a specific resource based on its identifier,
   * marking it as removed without permanently deleting it from the database.
   *
   * @param id The identifier of the resource to soft delete.
   * @returns A promise containing the JSON response indicating the success of the operation.
   */
  softRemove(id: string): Promise<void>;
}
