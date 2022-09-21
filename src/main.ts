import { GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { createApp } from "vue";
import App from "./App.vue";
import { naive } from "./naive";
import { router } from "./route";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

import "./style/style.css";
import "./style/viewer.css";

createApp(App).use(router).use(naive).mount("#app");
