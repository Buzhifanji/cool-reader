import { lightTheme, darkTheme } from "naive-ui";
import { THEME } from "./constants";

export const activeTheme = useStorage(THEME, true);

export const theme = computed(() => {
  return activeTheme.value ? lightTheme : darkTheme
})