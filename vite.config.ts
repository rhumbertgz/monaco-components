import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                wrapper: path.resolve(__dirname, '/packages/examples/wrapper.html'),
                wrapperWs: path.resolve(__dirname, '/packages/examples/wrapper_ws.html'),
                wrapperTs: path.resolve(__dirname, '/packages/examples/wrapper_ts.html'),
                comp: path.resolve(__dirname, '/packages/examples/comp.html'),
                compAdvanced: path.resolve(__dirname, '/packages/examples/comp-adv.html'),
                react: path.resolve(__dirname, '/packages/examples/react.html'),
                reactTs: path.resolve(__dirname, '/packages/examples/react_ts.html'),
                workers: path.resolve(__dirname, '/packages/examples/workers.html'),
                verifyWrapper: path.resolve(__dirname, '/packages/examples/verify_wrapper.html'),
                verifyComp: path.resolve(__dirname, '/packages/examples/verify_comp.html'),
                verifyCompLc: path.resolve(__dirname, '/packages/examples/verify_comp_lc.html')
            }
        }
    },
    resolve: {
        alias: {
            path: 'path-browserify'
        }
    },
    server: {
        port: 20001
    }
});
