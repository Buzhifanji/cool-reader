import { DomSource } from "src/core/web-highlight";

interface _DomSource extends DomSource {
  id: string
}

interface NotesTime {
  id: string;
  time: string
}
export type NotesSource = _DomSource | NotesTime
