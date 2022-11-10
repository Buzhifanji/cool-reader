import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import ViteComponents from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      dts: "./src/auto-imports.d.ts",
      imports: ["vue", "vue-router", "@vueuse/core"],
    }),
    ViteComponents({
      dts: "./src/components.d.ts",
      resolvers: [NaiveUiResolver()],
    }),
  ],

  // Vite optons tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": resolve("./src"),
      "@components": resolve("./src/components"),
      "@views": resolve("./src/views"),
      "@layouts": resolve("./src/layouts"),
      "@utils": resolve("./src/utils"),
      "@server": resolve("./src/server"),
      "@interfaces": resolve("./src/interfaces"),
      "@constants": resolve("./src/constants"),
      "@store": resolve("./src/store"),
      "@enums": resolve("./src/enums"),
      "@core": resolve("./src/core"),
      "@assets": resolve("./src/assets"),
      "@i18n": resolve("./src/i18n"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".vue", ".tsx", ".json"],
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target: ["es2021", "chrome100", "safari13"],
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
