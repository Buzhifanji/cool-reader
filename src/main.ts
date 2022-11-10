import { GlobalWorkerOptions } from "pdfjs-dist";
import { createApp } from "vue";
import App from "./App.vue";
import { naive } from "./naive";
import { router } from "./route";
import devtools from "@vue/devtools";

if (process.env.NODE_ENV === "development") {
  devtools.connect("http://localhost", 8098);
}

GlobalWorkerOptions.workerSrc =
  "../node_modules/pdfjs-dist/build/pdf.worker.js";

import "./style/style.css";
import "./style/viewer.css";

createApp(App).use(router).use(naive).mount("#app");
