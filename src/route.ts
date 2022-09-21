import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Book from "./components/book.vue";
import HighLight from "./components/highlight.vue";
import Home from "./components/home.vue";
import Note from "./components/note.vue";
import Reader from "./components/reader/reading.vue";

export enum RouterName {
  book = "book",
  note = "note",
  highlight = "highlight",
  reader = "reader",
}

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    component: Home,
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
  history: createWebHashHistory(),
  routes,
});
