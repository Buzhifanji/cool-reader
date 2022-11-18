import { DomSource } from "src/interfaces";

const data: Map<string, DomSource> = new Map();

export function saveDomSource(source: DomSource | DomSource[]) {
  if (Array.isArray(source)) {
    source.forEach((s) => data.set(s.id, s));
  } else {
    data.set(source.id, source);
  }
}

export function removeDomSource(id: string) {
  return data.delete(id);
}

export function getDomSource(id: string) {
  return data.get(id);
}

export function hasDomSource(id: string) {
  return data.has(id);
}
