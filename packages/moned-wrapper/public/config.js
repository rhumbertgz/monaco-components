import editorWorker from '/src/moned-wrapper/assets/editor.worker.43309ac9.js?worker';
import jsonWorker from '/src/moned-wrapper/assets/json.worker.66c12891.js?worker';
import cssWorker from '/src/moned-wrapper/assets/css.worker.5157db2f.js?worker';
import htmlWorker from '/src/moned-wrapper/assets/html.worker.3f2697f1.js?worker';
import tsWorker from '/src/moned-wrapper/assets/ts.worker.d75e32f4.js?worker';

export default function defineWorkers(monWin) {
    if (!monWin) return;

    monWin.MonacoEnvironment = {
        getWorker: (_, label) => {
            if (label === 'json') {
                return new jsonWorker();
            }
            if (label === 'css' || label === 'scss' || label === 'less') {
                return new cssWorker();
            }
            if (label === 'html' || label === 'handlebars' || label === 'razor') {
                return new htmlWorker();
            }
            if (label === 'typescript' || label === 'javascript') {
                return new tsWorker();
            }
            return new editorWorker();
        },
    };
}

