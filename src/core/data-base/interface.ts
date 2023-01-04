import { DomSource } from "../web-highlight";

export interface BookNotes extends DomSource {
  bookName: string;
  bookId: string;
  chapter: string; // 对应的章节
}