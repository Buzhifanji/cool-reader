export const useCatalogSection = () => {
  const showCatalog = ref<boolean>(false);
  const catalogWidth = 294;
  onMounted(() => (showCatalog.value = true));

  onKeyStroke(["m", "M"], (e) => {
    e.preventDefault();
    showCatalog.value = !showCatalog.value;
  });

  return { showCatalog, catalogWidth };
};
