import { createDiscreteApi } from "naive-ui";

// naiveui 脱离上下文的 API
export const { message, notification } = createDiscreteApi([
  "message",
  "notification",
]);
