export interface IBaseRepository<T> {
  findById<T> (id: string) : Promise<T> ;
  create<T>(data: T) : Promise<T>;
  listAll() : Promise<T[]>;
  update<T>(id: string, data: T) : Promise<T>;
  delete(id: string) : Promise<void>
  findManyById(id: string): Promise<T[]>
}