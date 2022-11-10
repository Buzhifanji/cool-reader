import { onKeyStroke } from "@vueuse/core";
import { onMounted, ref } from "vue";

export const useCatalogSection = () => {
  const showCatalog = ref<boolean>(false);
  const catalogWidth = 312;
  onMounted(() => (showCatalog.value = true));

  onKeyStroke(["m", "M"], (e) => {
    e.preventDefault();
    showCatalog.value = !showCatalog.value;
  });

  return { showCatalog, catalogWidth };
};
