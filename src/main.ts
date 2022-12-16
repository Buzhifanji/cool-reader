import { GlobalWorkerOptions } from "pdfjs-dist";
import App from "./App.vue";
import { router } from "./route";
import devtools from "@vue/devtools";
import { createPinia } from 'pinia'

if (process.env.NODE_ENV === "development") {
  devtools.connect("http://localhost", 8098);
}

GlobalWorkerOptions.workerSrc =
  "../node_modules/pdfjs-dist/build/pdf.worker.js";

import "./style/style.css";
import "./style/viewer.css";
import "./style/web-highlight.css"
const pinia = createPinia()

createApp(App).use(pinia).use(router).mount("#app");
