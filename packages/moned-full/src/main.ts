import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';

import { styles, MonacoWrapper } from './wrapper';
import { CodeEditor, CodeEditorConfig, DefaultCodeEditorConfig } from 'moned-base';

export interface CodeEditorFull extends CodeEditor {

    updateCodeEditorConfig(codeEditorConfig: CodeEditorConfig | undefined | null): void;

}

@customElement('moned-full')
export class CodeEditorFullImpl extends LitElement implements CodeEditorFull {

    private container: Ref<HTMLElement> = createRef();
    private editorConfig: CodeEditorConfig;

    private monacoWrapper;

    @property() languageId?;
    @property() code?;
    @property() theme?;
    @property({ type: Boolean }) readOnly?;
    @property({ type: Boolean }) delayedStart?;

    constructor() {
        super();
        this.editorConfig = new DefaultCodeEditorConfig();

        // set proper defaults based on the default editor config
        this.languageId = this.editorConfig.languageId;
        this.code = this.editorConfig.code;
        this.theme = this.editorConfig.theme;
        this.readOnly = this.editorConfig.readOnly;
        this.delayedStart = this.editorConfig.delayedStart;

        this.monacoWrapper = new MonacoWrapper(this.editorConfig);
    }

    static override styles = css`
:host {
--editor-width: 100%;
--editor-height: 100vh;
}
main {
width: var(--editor-width);
height: var(--editor-height);
}
`;

    override render() {
        return html`
<style>
${styles}
</style>
<main ${ref(this.container)}></main>
`;
    }

    getCodeEditorType(): string {
        return 'CodeEditorFull';
    }

    updateCodeEditorConfig(codeEditorConfig: CodeEditorConfig | undefined | null) {
        if (codeEditorConfig) {
            this.editorConfig = codeEditorConfig;
            this.languageId = this.editorConfig.languageId;
            this.code = this.editorConfig.code;
            this.theme = this.editorConfig.theme;
            this.readOnly = this.editorConfig.readOnly;
            this.delayedStart = this.editorConfig.delayedStart;
        }
    }

    getCodeEditorConfig() {
        return this.editorConfig;
    }

    setCode(code: string): void {
        this.code = code;
        this.syncPropertiesAndEditorConfig();
    }

    setTheme(theme: string): void {
        this.theme = theme;
        this.syncPropertiesAndEditorConfig();
    }

    setLanguageId(languageId: string): void {
        this.languageId = languageId;
        this.syncPropertiesAndEditorConfig();
    }

    setDelayedStart(delayedStart: boolean) {
        this.delayedStart = delayedStart;
        this.syncPropertiesAndEditorConfig();
    }

    syncPropertiesAndEditorConfig() {
        if (this.languageId) this.editorConfig.languageId = this.languageId;
        if (this.code) this.editorConfig.code = this.code;
        if (this.theme) this.editorConfig.theme = this.theme;
        this.editorConfig.readOnly = this.readOnly === true;
        this.editorConfig.delayedStart = this.delayedStart === true;
    }

    startEditor() {
        this.monacoWrapper.updateEditorConfig(this.editorConfig);
        this.monacoWrapper.startEditor(this.container.value!, this.dispatchEvent);

        this.registerListeners();
    }

    updateEditor() {
        this.monacoWrapper.updateEditor();
    }

    firstUpdated() {
        this.syncPropertiesAndEditorConfig();

        if (!this.editorConfig.delayedStart) {
            this.startEditor();
        }
    }

    registerListeners() {
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', () => {
                this.monacoWrapper.setTheme(this.editorConfig.theme);
            });
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'moned-full': CodeEditorFullImpl;
    }
}
