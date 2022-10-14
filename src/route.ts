import { RouterName } from "@enums/index";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const Book = () => import("@views/books/books.vue");
const HighLight = () => import("@views/highlight/highlight.vue");
const Note = () => import("@views/notes/notes.vue");
const Reader = () => import("@views/reader/reader.vue");
const Layout = () => import("@layouts/index.vue");

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    component: Layout,
    name: RouterName.book,
    redirect: "/home/book",
    children: [
      { path: "book", component: Book, name: RouterName.book },
      { path: "notes", component: Note, name: RouterName.note },
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
