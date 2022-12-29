import { defineStore } from 'pinia'
import { DomSource } from 'src/core/web-highlight';
import { openIdea, removeMessage } from 'src/views/pc/reader/idea/input';

export const useToolbarStore = defineStore('toolbar', () => {
  const show = ref<boolean>(false);
  const edit = ref<boolean>(false);
  const source = ref<DomSource | null>(null);

  const toolBarStyle = shallowReactive({
    top: '0px',
    left: '0px',
  })

  const action = (domSource: DomSource, top: string, left: string, isEdit: boolean) => {
    show.value = true;
    source.value = domSource;
    edit.value = isEdit;

    toolBarStyle.top = top;
    toolBarStyle.left = left;

    if (domSource.notes.content) {
      openIdea(domSource, isEdit)
    }

  }

  function openToolBar(domSource: DomSource, top: string, left: string) {
    action(domSource, top, left, false)
  }

  function closeTooBar() {
    if (edit.value) {
      source.value = null;
      edit.value = false
      toolBarStyle.top = '0px';
      toolBarStyle.left = '0px';
    }
    show.value = false;
    removeMessage() // 删除 输入想法组件 
  }

  function editTooBar(domSource: DomSource, top: string, left: string) {
    action(domSource, top, left, true)
  }

  return { show, source, edit, toolBarStyle, openToolBar, closeTooBar, editTooBar };
})