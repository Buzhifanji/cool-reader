import { NOTES_LINE_CLASS_NAME } from "src/constants";
import { deleteDomSource, domSourceFromRange } from "src/core/toolbar";
import { reductRange } from "src/core/toolbar/selection";
import { DomSource } from "src/interfaces";
import { message } from "src/naive";
import { removeNotes, saveNotes, updateNotes } from "src/server/notes";
import { removeDomSource } from "src/store";
import { createDiscreteApi, MessageReactive } from "naive-ui";
import { notes, updateNodes } from "../../notes/notes";
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
  async function submit() {
    const value = unref(text);
    if (value) {
      const source = toolBar.source;
      if (source) {
        source.className = NOTES_LINE_CLASS_NAME;

        let param = { ...source, notes: value };
        if (_source && _source.id === source.id) {
          // 往旧的笔记里添加新的笔记
          const old = notes.value.find((item) => item.id === _source!.id);
          param = { ..._source, notes: `${value},${old!.notes}` };
          await updateNotes(param);
        } else {
          // 第一次新增
          await saveNotes(param);
          domSourceFromRange(param);
        }
        _source = param;
        updateNodes();
        resetToolBar();
        removeMessage();
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
      const param = { ..._source!, notes: idea };
      await updateNotes(param, "删除成功");
    } else {
      const { bookId, id } = _source!;
      // 清除 ui
      deleteDomSource(_source!);
      // 清除缓存
      removeDomSource(id);
      await removeNotes(bookId, id);
      resetToolBar();
      removeMessage();
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
