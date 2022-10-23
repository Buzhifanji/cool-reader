import { NOTES_LINE_CLASS_NAME } from "@/constants";
import { domSourceFromRange } from "@/core/toolbar";
import { reductRange } from "@/core/toolbar/selection";
import { message } from "@/naive";
import { saveNotes } from "@/server/notes";
import { createDiscreteApi, MessageReactive } from "naive-ui";
import { Component, h, ref, unref } from "vue";
import { updateNodes } from "../../notes/notes";
import { resetToolBar, toolBar } from "../toolbar";
import Input from "./input.vue";

let messageReactive: MessageReactive | null = null;
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
          saveNotes({ ...source, notes: value }).then(() => {
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
  const list = ref([]);
  function remove() {}
  return { list, remove };
};

export function editIdea() {}
