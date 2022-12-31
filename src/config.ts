import { lightTheme, darkTheme } from "naive-ui";
import { MULTI_WIN, THEME } from "./constants";

export const config = reactive({
  theme: useStorage(THEME, true),
  multiWindow: useStorage(MULTI_WIN, true),
})

export const theme = computed(() => {
  return config.theme ? lightTheme : darkTheme
})