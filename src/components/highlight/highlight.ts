import { ref } from "vue";
import { highlightParam } from "../../core/notes/type";

export const highlights = ref<highlightParam[]>([]);

export const useHighlights = () => {
  function remove(value: highlightParam) {
    console.log("remove", value);
  }
  function jump(value: highlightParam) {
    console.log("jump", value);
  }
  return { remove, jump };
};
