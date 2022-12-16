import { defineStore } from 'pinia'
import { DomSource } from 'src/core/web-highlight';

export const useToolbarStore = defineStore('toolbar', () => {
  const show = ref<boolean>(false);
  const edit = ref<boolean>(false);
  const source = ref<DomSource | null>(null);

  const toolBarStyle = shallowReactive({
    top: '0px',
    left: '0px',
  })

  function openToolBar(domSource: DomSource, top: string, left: string) {
    show.value = true;
    source.value = domSource;
    edit.value = false;

    toolBarStyle.top = top;
    toolBarStyle.left = left;
  }

  function closeTooBar() {
    if (edit.value) {
      source.value = null;
      edit.value = false
      toolBarStyle.top = '0px';
      toolBarStyle.left = '0px';
    }
    show.value = false;
  }

  return { show, source, edit, toolBarStyle, openToolBar, closeTooBar };
})