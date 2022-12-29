import { RouterName } from "src/enums/index";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const Book = () => import("src/views/pc/book-list/index.vue");
const HighLight = () => import("src/views/pc/highlight/index.vue");
const Notes = () => import("src/views/pc/notes/index.vue");
const Reader = () => import("src/views/pc/reader/index.vue");
const Layout = () => import("src/views/pc/layouts/index.vue");

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
