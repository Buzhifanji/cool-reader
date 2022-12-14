import { KOOKIT_CONFIG } from "src/constants";

const config = () => localStorage.getItem(KOOKIT_CONFIG)!

export function getKookitConfig(key: string) {
  const kookitConfig = JSON.parse(config()) || {};
  return kookitConfig[key];
}

export function setKookitConfig(key: string, value: string) {
  const kookitConfig = JSON.parse(config()) || {};
  kookitConfig[key] = value;
  localStorage.setItem(KOOKIT_CONFIG, JSON.stringify(kookitConfig));
}