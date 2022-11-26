export const useCatalogSection = () => {
  const showCatalog = ref<boolean>(false);
  const catalogWidth = 294;
  onMounted(() => (showCatalog.value = true));

  const stop = onKeyStroke(["m", "M"], (e) => {
    e.preventDefault();
    showCatalog.value = !showCatalog.value;
  });

  onUnmounted(() => {
    stop();
  })

  return { showCatalog, catalogWidth };
};
