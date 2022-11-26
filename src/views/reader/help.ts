import { langField } from "src/i18n";

export const useHelp = () => {
  const showHelp = ref<boolean>(false)

  onKeyStroke(["h", "H"], (e) => {
    e.preventDefault();
    showHelp.value = !showHelp.value;
  });
  const { shortcutKey, catalogShortcutKey, notesShortcutKey } = langField.value;
  const helpList = ref([
    {
      title: shortcutKey,
      list: [
        { name: 'M / m', value: catalogShortcutKey },
        { name: 'N / n', value: notesShortcutKey },
      ]
    }
  ])

  return { showHelp, helpList, }
}