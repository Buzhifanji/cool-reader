import { invoke } from "@tauri-apps/api";
import { DomSource, Notes } from "src/core/web-highlight";
import { langField } from "src/i18n";
import { NotesRes } from "src/interfaces";
import { message } from "src/naive";
import { generateServiceParams } from "src/utils";
import { sortNotes } from "src/utils/sort";

export function saveNotes(param: DomSource) {
  const data = generateServiceParams<DomSource, NotesRes>(param);
  return invoke("add_notes", { data })
    .then(() => {
      message.success(langField.value.addSuccess);
    })
    .catch((err) => {
      message.error(err);
    });
}

export function updateNotes(param: DomSource) {
  const data = generateServiceParams<DomSource, NotesRes>(param);
  return invoke("update_notes", { data })
    .then(() => {
      message.success(langField.value.updateSuccess);
    })
    .catch((err) => {
      message.error(err);
    });
}

type Filter = (notes: Notes) => boolean

function filterNotes(bookId: string, callback: Filter) {
  return getNotesByBookId(bookId).then(ideas => {
    return ideas.filter(idea => callback(idea.notes))
  })
}

export function getIdeasById(bookId: string) {
  return filterNotes(bookId, notes => notes.content.length > 0)
}

export function getHeighlightsById(bookId: string) {
  return filterNotes(bookId, notes => notes.content.length === 0)
}

export function getAllNotes(): Promise<DomSource[]> {
  return new Promise((resolve) => {
    invoke("get_all_notes", {}).then(value => {
      const result = (value as NotesRes[]).map((item) =>
        generateServiceParams<NotesRes, DomSource>(item, false)
      );
      resolve(result)
    }).catch((err) => {
      resolve([])
      message.error(err);
    });
  })
}

export function getNotesByBookId(bookId: string): Promise<DomSource[]> {
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
      message.success(langField.value.deleteSuccess);
    })
    .catch((err) => {
      message.error(err);
    });
}