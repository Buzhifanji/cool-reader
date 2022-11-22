import { invoke } from "@tauri-apps/api";
import { DomSource, Notes } from "src/core/web-highlight";
import { NotesRes } from "src/interfaces";
import { message } from "src/naive";
import { generateServiceParams } from "src/utils";
import { sortNotes } from "src/utils/sort";

export function saveNotes(param: DomSource) {
  const data = generateServiceParams<DomSource, NotesRes>(param);
  return invoke("add_notes", { data })
    .then(() => {
      message.success("添加成功");
    })
    .catch((err) => {
      message.error(err);
    });
}

export function updateNotes(param: DomSource) {
  const data = generateServiceParams<DomSource, NotesRes>(param);
  return invoke("update_notes", { data })
    .then(() => {
      message.success("修改成功");
    })
    .catch((err) => {
      message.error(err);
    });
}

type Filter = (notes: Notes) => boolean

function filterNotes(bookId: string, callback: Filter) {
  return getAllNotes(bookId).then(ideas => {
    return ideas.filter(idea => callback(idea.notes))
  })
}

export function getIdeasById(bookId: string) {
  return filterNotes(bookId, notes => notes.content.length > 0)
}

export function getHeighlightsById(bookId: string) {
  return filterNotes(bookId, notes => notes.content.length === 0)
}

export function getAllNotes(bookId: string): Promise<DomSource[]> {
  return new Promise((resolve) => {
    invoke("get_notes", { bookId })
      .then((value) => {
        const result = (value as NotesRes[]).map((item) =>
          generateServiceParams<NotesRes, DomSource>(item, false)
        );
        resolve(sortNotes(result));
      })
      .catch((err) => {
        message.error(err);
        resolve([]);
      });
  });
}

export function removeNotes(book_id: string, id: string,) {
  return invoke("delete_notes", { data: { book_id, id } })
    .then(() => {
      message.success("删除成功");
    })
    .catch((err) => {
      message.error(err);
    });
}