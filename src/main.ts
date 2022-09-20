import { createApp } from "vue";
import App from "./App.vue";
import { naive } from "./naive";
import { router } from "./route";
import "./style.css";
createApp(App).use(router).use(naive).mount("#app");
