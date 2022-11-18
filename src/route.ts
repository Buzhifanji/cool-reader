import { RouterName } from "src/enums/index";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const Book = () => import("src/views/books/books.vue");
const HighLight = () => import("src/views/highlight/highlight.vue");
const Notes = () => import("src/views/notes/notes.vue");
const Reader = () => import("src/views/reader/reader.vue");
const Layout = () => import("src/layouts/index.vue");

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    component: Layout,
    name: RouterName.book,
    redirect: "/home/book",
    children: [
      { path: "book", component: Book, name: RouterName.book },
      { path: "notes", component: Notes, name: RouterName.notes },
      { path: "highlight", component: HighLight, name: RouterName.highlight },
    ],
  },
  {
    path: "/reader",
    component: Reader,
    name: RouterName.reader,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
