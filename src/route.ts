import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
const Book = () => import("./components/book-list/index.vue");
const HighLight = () => import("./components/highlight.vue");
const Home = () => import("./components/home.vue");
const Note = () => import("./components/note.vue");
const Reader = () => import("./components/reader/reading.vue");

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
  history: createWebHistory(),
  routes,
});
