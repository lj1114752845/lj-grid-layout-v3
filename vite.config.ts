import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import dtsPlugin from "vite-plugin-dts";
import libCss from "vite-plugin-libcss";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), dtsPlugin(), libCss()],
    build: {
        lib: {
            entry: './src/index.ts',
            name: 'lj-grid-layout-v3',
            fileName: 'lj-grid-layout-v3',
            formats: ["es", "umd"]
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: "Vue"
                }
            }
        }
    },
    server: {
        host: '0.0.0.0',
        port: 7884
    }
})
