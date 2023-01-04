import { emit } from "@tauri-apps/api/event";
import { config } from "src/config";
import { NOTES_CHANGE } from "src/constants";
import { langField } from "src/i18n";
import { message } from "src/naive";
import { useBookNotesStore } from "src/store";
import { createTime } from "src/utils";
import { useReadBookStore } from "../book";
import { addNotes, BookNotes, updateNotes as _updateNotes, removeNotesById as _removeNotesById } from "../data-base";
import { DomSource } from "../web-highlight";

export const useBookNotes = () => {
  function handleNotes(source: DomSource, className?: string): BookNotes {
    const bookStore = useReadBookStore();
    const { id, bookName, chapter } = bookStore.readingBook

    const notes: BookNotes = {
      ...source,
      bookName,
      chapter,
      bookId: id,
    }

    if (className) {
      notes.className = className;
    }

    return notes;
  }

  function handleSucess(msg: string) {
    message.success(msg);
    // 多窗口： 通知主窗口更新数据
    if (!config.multiWindow) {
      emit(NOTES_CHANGE)
    }
    // 更新 store 里的 notes 数据
    useBookNotesStore().getBookNotes();
  }

  function saveNotes(source: DomSource, className?: string) {
    const notes = handleNotes(source, className)
    notes.notes.createTime = createTime()

    return addNotes(notes).then(() => {
      handleSucess(langField.value.addSuccess)
    }).catch((err) => {
      message.error(err);
    })
  }

  function updateNotes(source: DomSource, className?: string) {
    const notes = handleNotes(source, className)

    return _updateNotes(notes).then(() => {
      handleSucess(langField.value.updateSuccess)
    }).catch((err) => {
      message.error(err);
    });
  }

  function removeNotesById({ id }: DomSource) {
    return _removeNotesById(id).then(() => {
      handleSucess(langField.value.deleteSuccess)
    }).catch((err) => {
      message.error(err);
    })
  }

  return { saveNotes, updateNotes, removeNotesById }
}