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

  remove(id: string) {
    this._data.delete(id)
  }

  private _saveOne(source: DomSource) {
    this._data.set(source.id, source)

    return source.id
  }
}