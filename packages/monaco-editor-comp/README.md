# Lit Component for Monaco Editor

This packages provide a wrapped `monaco-editor` with full basic language support and enhanced support via workers for special languages (e.g. TS, HTML).

The component can be fully configured with inlined JavaScript. It can be configured as regular or diff editor.

## Web Component properties / configuration options

* **code**: Code or text that is shown in the editor (default: `''`);
* **languageId**: Specify the editor language (default: `javascript`)
* **modifiedCode**: Only Diff Editor: Specify the modified language (default: `javascript`)
* **modifiedLanguageId**: Only Diff Editor: Code or text that is shown in the modified editor. (default: `''`)
* **theme**: Theme of the editor that is used (default: `vs-light`)
* **enableInlineConfig**: Enable the inline editor configuration by specifying function `getMonacoEditorOptions` in inner script tag. You can directly pass monaco-editor options. See examples below. Attach the id directly to the name if you use more than one editor (e.g. `getMonacoEditorOptions42`).
* **useDiffEditor**: Use the diff editor instead of the regular editor by specifying function `getMonacoDiffEditorOptions`. It can only be used if `enableInlineConfig` is passed. See examples below.  Attach the id directly to the name if you use more than one editor (e.g. `getMonacoDiffEditorOptions42`).

## Help / Hints

Proper styling of at least the Diff Editor require that the codicon font is loaded outside the web component. Due to limitations of the Shadow DOM this can unfortunately not be transparently handled by the web component and requires user code adjustments shown [here](../../verify/monaco-editor-comp/verify-direct/index.html#L11-16) and [monaco-editor sample]( https://github.com/microsoft/monaco-editor/blob/main/samples/browser-amd-shadow-dom/index.html)).

## Usage Examples

You need to run `npm i` from the root of the project and `npm run build` here in this directory after cloning otherwise the examples below won't work properly.

You find a usage examples here:

* [Vite local dev with with two different editors](./index.html): Run `npm run dev` to start here in this directory.
* [Vite bundle test with inline editor config](../../verify/monaco-editor-comp/index.html): Run `npm run verify-vite` here: `../../verify/monaco-editor-comp`.
* [Direct bundle test with inline diff editor config](../../verify/monaco-editor-comp/index.html): Run `npm run verify-direct` here: `../../verify/monaco-editor-comp`.