import { DatastoreAdapter, ClassType, Model } from 'lapisdb'
import low, { LowdbAsync } from 'lowdb'
import FileSync from 'lowdb/adapters/FileAsync'
import { join } from 'path';
import { plainToClass, classToPlain } from 'class-transformer'

export class LowDbAdapter<T extends Model<T>> implements DatastoreAdapter<T> {
  private name: string;
  private directory: string;
  private type: ClassType<T>;
  private db?: LowdbAsync<any>;

  private convertToClass(item: object): T {
    return plainToClass(this.type, item)
  }

  constructor(type: ClassType<T>, options: { name: string, directory: string }) {
    this.type = type
    this.name = options.name
    this.directory = options.directory

    this.open()
  }

  async open(): Promise<void> {
    this.db = await low(new FileSync(join(this.directory, `${this.name}.json`)))
    this.db.defaults({})
  }

  async close(): Promise<void> {
    this.db = undefined
  }

  async get(id: string): Promise<T | null> {
    if (this.db == null) {
      throw Error('Database is not open. Perhaps you forgot to call open()?')
    }
    else {
      const item = this.db.get(id).value()
      return this.convertToClass(item)
    }
  }

  async put(item: T): Promise<T> {
    if (this.db == null) {
      throw Error('Database is not open. Perhaps you forgot to call open()?')
    }
    else {
      if (!item.hasMetadata()) {
        throw Error('Item has no metadata.')
      }
      const plain = classToPlain(item)
      await this.db.set(item.meta.id, plain).write()
      return item
    }
  }

  async remove(id: string): Promise<T | null> {
    if (this.db == null) {
      throw Error('Database is not open. Perhaps you forgot to call open()?')
    }
    else {
      const item = await this.get(id)
      if (item != null) {
        await this.db.unset(id).write()
        return item
      }
      else {
        return null
      }
    }
  }

  async stream(callback: (item: T) => void): Promise<void> {
    if (this.db == null) {
      throw Error('Database is not open. Perhaps you forgot to call open()?')
    }
    else {
      const items = this.db.value()
      for (const item of Object.values(items)) {
        callback(this.convertToClass(item as object))
      }
    }
  }
}
