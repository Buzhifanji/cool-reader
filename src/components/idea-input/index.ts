import { createDiscreteApi, MessageReactive } from "naive-ui";
import { createUUID, DomSource } from "src/core/web-highlight";
import { message } from "src/naive";
import { saveNotes, updateNotes } from "src/server/notes";
import { getReadingBook } from "src/store";
import { createTime } from "src/utils";
import { getIdeas } from "../idea/idea";
import Input from './index.vue'

let messageReactive: MessageReactive | null = null;
let source: DomSource | null = null;
let isEdit: boolean = false

const text = ref<string>("");

export function removeMessage() {
  if (messageReactive) {
    messageReactive.destroy();
    messageReactive = null;
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

  removeMessage();

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

        if (isEdit) {
          await updateNotes(source)
        } else {
          const readingBook = getReadingBook();
          source.bookId = readingBook.id;

          await saveNotes(source)
        }
        getIdeas()
        removeMessage()
      }
    } else {
      message.error("您还未填写笔记！");
    }
  }
  return { text, submit };
};
