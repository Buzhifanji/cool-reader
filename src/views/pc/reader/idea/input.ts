import { createDiscreteApi, MessageReactive } from "naive-ui";
import { createUUID, DomSource } from "src/core/web-highlight";
import { langField } from "src/i18n";
import { message } from "src/naive";
import { useBookNotesStore } from "src/store";
import { createTime } from "src/utils";
import { removeWebHighlightDom, removeWebHighlightDomSouce } from "../web-highlight";
import Input from './input.vue'
import { useBookNotes } from "src/core/use";

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
    const notesStore = useBookNotesStore();
    const id = source.id
    // 删除dom
    removeWebHighlightDom(id)
    // 删除没有保存到数据库的缓存数据
    if (!notesStore.hasBookNotes(id)) {
      removeWebHighlightDomSouce(id)
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
        const { updateNotes, saveNotes } = useBookNotes()
        source.notes = { id: createUUID(), tag: '', createTime: createTime(), content }
        isSave = true;

        if (isEdit) {
          await updateNotes(source)
        } else {
          await saveNotes(source)

        }
        removeMessage()
      }
    } else {
      message.error(langField.value.notesTipWrite);
    }
  }
  return { text, submit };
};
