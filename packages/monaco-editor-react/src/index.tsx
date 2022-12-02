import React, { CSSProperties } from 'react';
import { LanguageExtensionConfig, monaco, MonacoEditorLanguageClientWrapper, vscode } from 'monaco-editor-wrapper';

export interface MonacoEditorProps {
    languageId: string;
    text: string;
    style?: CSSProperties;
    className?: string;
    webworkerUri?: string;
    readOnly?: boolean;
    syntax: monaco.languages.IMonarchLanguage;
    languageExtensionConfig?: LanguageExtensionConfig;
    theme?: string,
    workerName?: string,
    workerType?: WorkerType,
    rawMonacoEditorOptions?: monaco.editor.IEditorOptions & monaco.editor.IGlobalEditorOptions,
    onTextChanged?: (text: string, isDirty: boolean) => void;
    onLoading?: () => void;
    onLoad?: () => void;
}

MonacoEditorLanguageClientWrapper.addMonacoStyles('monaco-editor-styles');

export class MonacoEditorReactComp extends React.Component<MonacoEditorProps> {
    private editor: MonacoEditorLanguageClientWrapper | null = null;

    private containerElement?: HTMLDivElement;

    private _subscription: monaco.IDisposable | null = null;

    private isStarting?: Promise<string>;

    constructor(props: MonacoEditorProps) {
        super(props);
        this.containerElement = undefined;
    }

    componentDidMount() {
        this.destroyMonaco().then(() => this.initMonaco());
    }

    componentDidUpdate(prevProps: MonacoEditorProps) {
        const { className, text, webworkerUri, syntax, languageId } = this.props;

        const { editor } = this;

        const editorConfig = editor!.getEditorConfig();
        const innerEditor: monaco.editor.IStandaloneCodeEditor =
            // eslint-disable-next-line dot-notation
            editor!['editor'];

        if (prevProps.className !== className && this.containerElement) {
            this.containerElement.className = className ?? '';
        }
        if (prevProps.webworkerUri !== webworkerUri) {
            this.destroyMonaco().then(() => this.initMonaco());
        } else {
            editorConfig.setMainLanguageId(languageId);
            editorConfig.setMonarchTokensProvider(syntax);
            // eslint-disable-next-line dot-notation
            editor!['updateMonacoConfig']();
            const model = innerEditor.getModel();
            if (model && text !== model.getValue()) {
                model.setValue(text);
            }
        }
    }

    componentWillUnmount() {
        this.destroyMonaco();
    }

    private assignRef = (component: HTMLDivElement) => {
        this.containerElement = component;
    };

    private async destroyMonaco(): Promise<void> {
        if (this.editor) {
            await this.isStarting;
            try {
                await this.editor.dispose();
            } catch {
                // This is fine
                // Sometimes the language client throws an error during disposal
                // This should not prevent us from continue working
            }
            // eslint-disable-next-line dot-notation
            this.editor['languageClient'] = undefined;
        }
        if (this._subscription) {
            this._subscription.dispose();
        }
    }

    private async initMonaco() {
        const {
            className,
            text,
            syntax,
            languageId,
            webworkerUri,
            rawMonacoEditorOptions,
            workerName,
            workerType,
            theme,
            languageExtensionConfig,
            onTextChanged,
            onLoading,
            onLoad,
        } = this.props;

        if (this.containerElement) {
            this.containerElement.className = className ?? '';
            this.editor = new MonacoEditorLanguageClientWrapper('42');
            const editorConfig = this.editor.getEditorConfig();
            editorConfig.setMainLanguageId(languageId);
            editorConfig.setMonarchTokensProvider(syntax);
            if (languageExtensionConfig) {
                editorConfig.setLanguageExtensionConfig(languageExtensionConfig);
            }
            editorConfig.setMainCode(text);
            editorConfig.setUseWebSocket(false);
            editorConfig.setUseLanguageClient(false);
            editorConfig.setTheme(theme ?? 'vs-dark');
            if (rawMonacoEditorOptions) {
                editorConfig.setMonacoEditorOptions(rawMonacoEditorOptions);
            }
            else {
                editorConfig.setMonacoEditorOptions({});
            }

            if (webworkerUri) {
                editorConfig.setUseLanguageClient(true);
                const workerURL = new URL(webworkerUri, window.origin);
                const lsWorker = new Worker(workerURL.href, {
                    type: workerType ?? 'classic',
                    name: workerName ?? 'LanguageServerWorker',
                });
                this.editor.setWorker(lsWorker);
            }

            this.isStarting = this.editor.startEditor(this.containerElement);
            await this.isStarting;

            onLoading && onLoading();
            onLoad && this.isStarting.then(() => onLoad());

            if (onTextChanged) {
                // eslint-disable-next-line dot-notation
                const innerEditor: monaco.editor.IStandaloneCodeEditor = this.editor['editor'];
                const model = innerEditor.getModel();
                if (model) {
                    this._subscription = model.onDidChangeContent(() => {
                        const modelText = model.getValue();
                        onTextChanged(modelText, modelText !== text);
                    });
                    const currentValue = model.getValue();
                    if (currentValue !== text) {
                        onTextChanged(currentValue, true);
                    }
                }
            }
        }
    }

    updateLayout(): void {
        this.editor!.updateLayout();
    }

    getText(): string {
        try {
            // eslint-disable-next-line dot-notation
            const innerEditor: monaco.editor.IStandaloneCodeEditor = this.editor!['editor'];
            const model = innerEditor.getModel();
            return model?.getValue() ?? '';
        } catch {
            return '';
        }
    }

    /**
     * Executes a custom LSP command by name with args, and returns the result
     * @param cmd Command to execute
     * @param args Arguments to pass along with this command
     * @returns The result of executing this command in the language server
     */
    executeCommand(cmd: string, ...args: unknown[]): Thenable<unknown> {
        return vscode.commands.executeCommand(cmd, ...args);
    }

    render() {
        return (
            <div
                ref={this.assignRef}
                style={this.props.style}
                className={this.props.className}
            />
        );
    }
}
