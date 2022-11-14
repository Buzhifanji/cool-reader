import { DomSource } from "./interface";

export class Store {
  private _data = new Map<string, DomSource>()

  save(source: DomSource | DomSource[]) {
    if (Array.isArray(source)) {
      const ids: string[] = []

      source.forEach(item => ids.push(this._saveOne(item)))

      return ids
    } else {
      return this._saveOne(source)
    }
  }

  get(id: string) {
    return this._data.get(id)
  }

  // getAll() {
  //   const result: DomSource[] = []

  //   for (const source of this._data) {
  //     result.push(source[1])
  //   }

  //   return result
  // }

  remove(id: string) {
    this._data.delete(id)
  }

  // removeAll() {
  //   const ids: string[] = [];

  //   for (const source of this._data) {
  //     ids.push(source[0])
  //   }

  //   this._data.clear()

  //   return ids;
  // }

  private _saveOne(source: DomSource) {
    this._data.set(source.id, source)

    return source.id
  }
}