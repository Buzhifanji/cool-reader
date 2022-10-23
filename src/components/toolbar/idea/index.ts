import { NOTES_LINE_CLASS_NAME } from "@/constants";
import { domSourceFromRange } from "@/core/toolbar";
import { reductRange } from "@/core/toolbar/selection";
import { DomSource } from "@/interfaces";
import { message } from "@/naive";
import { removeNotes, saveNotes, updateNotes } from "@/server/notes";
import { createDiscreteApi, MessageReactive } from "naive-ui";
import { Component, h, ref, unref } from "vue";
import { updateNodes } from "../../notes/notes";
import { resetToolBar, toolBar } from "../toolbar";
import Edit from "./edit.vue";
import Input from "./input.vue";

let messageReactive: MessageReactive | null = null;
const ideas = ref<string[]>([]);
let _source: DomSource | null = null;

const createMsg = (c: Component) => {
  const { message } = createDiscreteApi(["message"], {
    messageProviderProps: {
      placement: "bottom",
      containerStyle: { bottom: "50px" },
    },
  });
  removeMessage();
  messageReactive = message.create("", {
    render: () => h(c),
    closable: true,
    duration: 0,
    showIcon: false,
  });
};

export function removeMessage() {
  if (messageReactive) {
    messageReactive.destroy();
    messageReactive = null;
  }
}

export const useInputIdea = () => {
  const text = ref<string>("");
  function submit() {
    const value = unref(text);
    if (value) {
      const source = toolBar.source;
      if (source) {
        source.className = NOTES_LINE_CLASS_NAME;
        const { result } = domSourceFromRange(source);
        if (result) {
          let prevIdea = unref(ideas).join(",");
          const idea = prevIdea ? `${value},${prevIdea}` : value;
          const id = _source ? _source.id : source.id;
          const param = { ...source, id, notes: idea };

          const fn = prevIdea ? updateNotes : saveNotes;
          fn(param).then(() => {
            updateNodes();
            resetToolBar();
            removeMessage();
          });
        }
      }
    } else {
      message.error("您还未填写笔记！");
    }
  }
  return { text, submit };
};

export function openIdea() {
  createMsg(Input);
  reductRange();
}

export const useEditIdea = () => {
  async function remove(index: number) {
    ideas.value.splice(index, 1);
    const idea = ideas.value.join(",");
    if (idea) {
      await updateNotes({ ..._source!, notes: idea }, "删除成功");
    } else {
      const { bookId, id } = _source!;
      await removeNotes(bookId, id);
    }
    updateNodes();
  }
  return { ideas, remove };
};

export function editIdea(source: DomSource) {
  _source = source;
  const { notes } = source;
  if (notes) {
    ideas.value = notes.split(",");
    createMsg(Edit);
  }
}
