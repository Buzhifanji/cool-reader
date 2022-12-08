import { emit } from "@tauri-apps/api/event";
import { createDiscreteApi, MessageReactive } from "naive-ui";
import { NOTES_CHANGE } from "src/constants";
import { createUUID, DomSource } from "src/core/web-highlight";
import { langField } from "src/i18n";
import { message } from "src/naive";
import { saveNotes, updateNotes } from "src/server/notes";
import { getReadingBook, removeWebHighlightCache, removeWebHighlightDom } from "src/store";
import { createTime } from "src/utils";
import { hasHighlight } from "../highlight/highlight";
import { getIdeas, hasIdea } from "../idea/idea";
import Input from './index.vue'

let messageReactive: MessageReactive | null = null;
let source: DomSource | null = null;
let isEdit: boolean = false
let isSave: boolean = false

const text = ref<string>("");

export function removeMessage() {
  if (messageReactive) {
    messageReactive.destroy();
    messageReactive = null;
  }

  if (!isSave && source) {
    const id = source.id
    // 删除dom
    removeWebHighlightDom(id)
    // 删除没有保存到数据库的缓存数据
    if (!(hasIdea(id) || hasHighlight(id))) {
      removeWebHighlightCache(id)
    }
  }
}

export function openIdea(_source: DomSource, _isEdit: boolean) {
  source = _source;
  isEdit = _isEdit;

  const { message } = createDiscreteApi(["message"], {
    messageProviderProps: {
      placement: "bottom",
      containerStyle: { bottom: "50px" },
    },
  });

  isSave = true;
  removeMessage()
  isSave = false;

  text.value = source.notes.content;

  messageReactive = message.create("", {
    render: () => h(Input),
    closable: true,
    duration: 0,
    showIcon: false,
  });
}

export const useInputIdea = () => {
  async function submit() {
    const content = unref(text);
    if (content) {
      if (source) {
        source.notes = { id: createUUID(), tag: '', createTime: createTime(), content }
        isSave = true;

        if (isEdit) {
          await updateNotes(source)
        } else {
          const readingBook = getReadingBook();
          source.bookId = readingBook.id;

          await saveNotes(source)
        }
        emit(NOTES_CHANGE, source)
        getIdeas()
        removeMessage()
      }
    } else {
      message.error(langField.value.notesTipWrite);
    }
  }
  return { text, submit };
};
