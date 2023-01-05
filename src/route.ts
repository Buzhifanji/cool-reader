import { RouterName } from "src/enums/index";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const Book = () => import("src/views/pc/book-list/index.vue");
const Notes = () => import("src/views/pc/notes/index.vue");
const Reader = () => import("src/views/pc/reader/index.vue");
const Layout = () => import("src/views/pc/layouts/index.vue");
const Reading = () => import("src/views/pc/reading/index.vue");

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layout,
    name: RouterName.reading,
    redirect: "/reading",
    children: [
      { path: "reading", component: Reading, name: RouterName.reading },
      { path: "books", component: Book, name: RouterName.books },
      { path: "notes", component: Notes, name: RouterName.notes },
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
