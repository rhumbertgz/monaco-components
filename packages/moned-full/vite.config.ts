import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/main.ts'),
            name: 'moned-full',
            fileName: () => 'moned-full.js',
            formats: ['es']
        },
        outDir: 'dist',
        emptyOutDir: false,
        cssCodeSplit: false,
        rollupOptions: {
            external: [],
            output: {
                inlineDynamicImports: true,
                name: 'moned-full',
                exports: 'named',
                sourcemap: false,
            }
        }
    },
    server: {
        port: 20002
    }
});
