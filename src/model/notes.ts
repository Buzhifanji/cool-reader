import { DomMeta, DomSource } from "src/interfaces";

export class NotesModel implements DomSource {
  constructor(
    public id: string,
    public bookId: string,
    public className: string,
    public pageNumber: number,
    public text: string, // 选中的文字内容
    public startMeta: DomMeta,
    public endMeta: DomMeta,
    public notes?: string // 笔记内容
  ) { }
}
