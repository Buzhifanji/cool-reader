import { DomSource, Handler } from "./interface";

export enum EventType {
  click = 'click',
  range = 'range'
}

export class EventBus {
  private _map = new Map<EventType, Handler[]>()
  on(type: EventType, callback: Handler) {
    if (!this._map.has(type)) {
      this._map.set(type, [callback])
    } else {
      const list = this._map.get(type)

      if (!list.includes(callback)) {
        list.push(callback)
      }
    }

    return this;
  }
  off(type: EventType, callback?: Handler) {
    if (callback) {
      if (this._map.has(type)) {
        const list = this._map.get(type)
        const idnex = list.findIndex(item => item === callback)

        if (idnex !== -1) {
          list.splice(idnex, 1)
        }
      }
    } else {
      this._map.delete(type);
    }

    return this;
  }
  emit(type: EventType, data: DOMRect, source?: DomSource) {
    if (this._map.has(type)) {
      this._map.get(type).forEach(Handler => Handler(data, source))
    }

    return this;
  }
}