import { LangField } from "@/interfaces";
import { useNavigatorLanguage } from "@vueuse/core";
import { dateEnUS, dateZhCN, enUS, NDateLocale, NLocale, zhCN } from "naive-ui";
import { enUS as enUSLocal } from "./en";
import { zhCN as zhCNLocal } from "./zh";

export const langField = ref<LangField>(zhCNLocal);

export enum Langs {
  zhCN = "zh-CN", // 简体中文
  enUS = "en-US", // 英语
}

export const language = ref<Langs>(Langs.zhCN);
export function changeLanguage(lang: Langs) {
  language.value = lang;
}

// 浏览器语言
function navigatorLanguage() {
  const { language: browserLang } = useNavigatorLanguage();
  switch (browserLang.value) {
    case "zh-CN":
      language.value = Langs.zhCN;
      langField.value = zhCNLocal;
      break;
    default:
      language.value = Langs.enUS;
      langField.value = enUSLocal;
      break;
  }
}
navigatorLanguage();

export function loadLang(key: keyof LangField) {
  switch (language.value) {
    case Langs.zhCN:
      return zhCNLocal[key];
    case Langs.enUS:
      return enUSLocal[key];
    default:
      return "";
  }
}

// naive-ui 库多语言配置
export const naiveUiLanguage = reactive({
  locale: enUS,
  date: dateEnUS,
});

function updateLang(field: LangField, locale: NLocale, date: NDateLocale) {
  naiveUiLanguage.locale = locale;
  naiveUiLanguage.date = date;
  langField.value = field;
}

watch(language, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    switch (newValue) {
      case Langs.zhCN:
        updateLang(zhCNLocal, zhCN, dateZhCN);
        break;
      case Langs.enUS:
        updateLang(enUSLocal, enUS, dateEnUS);
        break;
      default:
        console.warn("TODO: Unknown language: " + language.value);
        break;
    }
  }
});
