import { NOTES_LINE_CLASS_NAME } from "@/constants";
import { domSourceFromRange } from "@/core/toolbar";
import { reductRange } from "@/core/toolbar/selection";
import { DomSource } from "@/interfaces";
import { message } from "@/naive";
import { saveNotes, updateNotes } from "@/server/notes";
import { createDiscreteApi, MessageReactive } from "naive-ui";
import { Component, h, ref, unref } from "vue";
import { updateNodes } from "../../notes/notes";
import { resetToolBar, toolBar } from "../toolbar";
import Edit from "./edit.vue";
import Input from "./input.vue";

let messageReactive: MessageReactive | null = null;
const ideas = ref<string[]>([]);
let _id: null | string = null;

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
          const param = { ...source, id: _id as string, notes: idea };

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
  function remove() {}
  return { ideas, remove };
};

export function editIdea({ notes, id }: DomSource) {
  if (notes) {
    _id = id;
    ideas.value = notes.split(",");
    createMsg(Edit);
  }
}
