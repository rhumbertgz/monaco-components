import path from 'path';
import { defineConfig } from 'vite';

const config = defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/workerBuilder.js'),
            name: 'monaco-editor-comp-workers',
            fileName: () => 'monaco-editor-comp-workers.js',
            formats: ['es']
        },
        outDir: 'dist',
        emptyOutDir: false
    }
});

export default config;