import { NotificationApiInjection } from "naive-ui/es/notification/src/NotificationProvider";
export {}; // 必须保留

declare module "pdfjs-dist/build/pdf.worker.entry";

declare global {
  interface Window {
    notification: NotificationApiInjection;
  }
}
