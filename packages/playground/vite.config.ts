import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vitePluginCommonjs from "vite-plugin-commonjs";
import vueJsx from "@vitejs/plugin-vue-jsx";

const dirname = resolve();
export default defineConfig(() => ({
    server: {
        host: "0.0.0.0",
        port: 8080,
    },
    resolve: {
        alias: [
            {
                find: /@\/(.*)/,
                replacement: resolve(dirname, "src", "$1"),
            },
        ],
    },
    plugins: [vue(), vueJsx(), vitePluginCommonjs()],
}));
