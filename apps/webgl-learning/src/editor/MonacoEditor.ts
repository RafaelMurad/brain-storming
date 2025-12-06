import * as monaco from 'monaco-editor';

// Three.js Academy custom theme
const THEME_NAME = 'threejs-academy-dark';

// Register custom theme
monaco.editor.defineTheme(THEME_NAME, {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6a6a6a', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'FF4D00' },
    { token: 'string', foreground: '98c379' },
    { token: 'number', foreground: 'd19a66' },
    { token: 'type', foreground: 'e5c07b' },
    { token: 'class', foreground: 'e5c07b' },
    { token: 'function', foreground: '61afef' },
    { token: 'variable', foreground: 'e06c75' },
    { token: 'operator', foreground: 'FF4D00' },
  ],
  colors: {
    'editor.background': '#0a0a0a',
    'editor.foreground': '#e0e0e0',
    'editor.lineHighlightBackground': '#1a1a1a',
    'editor.selectionBackground': '#FF4D0033',
    'editor.inactiveSelectionBackground': '#FF4D0022',
    'editorCursor.foreground': '#FF4D00',
    'editorLineNumber.foreground': '#4a4a4a',
    'editorLineNumber.activeForeground': '#FF4D00',
    'editorIndentGuide.background': '#2a2a2a',
    'editorIndentGuide.activeBackground': '#3a3a3a',
    'editor.selectionHighlightBackground': '#FF4D0022',
    'editorBracketMatch.background': '#FF4D0033',
    'editorBracketMatch.border': '#FF4D00',
    'scrollbarSlider.background': '#3a3a3a80',
    'scrollbarSlider.hoverBackground': '#4a4a4a80',
    'scrollbarSlider.activeBackground': '#FF4D0080',
  },
});

export interface MonacoEditorOptions {
  container: HTMLElement;
  value?: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export class MonacoEditor {
  private editor: monaco.editor.IStandaloneCodeEditor;
  private container: HTMLElement;
  private disposables: monaco.IDisposable[] = [];

  constructor(options: MonacoEditorOptions) {
    this.container = options.container;

    // Configure TypeScript/JavaScript for Three.js
    // Use type assertion to handle Monaco's complex types
    try {
      const ts = (monaco.languages as any).typescript;
      if (ts && ts.typescriptDefaults) {
        ts.typescriptDefaults.setCompilerOptions({
          target: ts.ScriptTarget?.ES2020 || 7,
          allowNonTsExtensions: true,
          moduleResolution: ts.ModuleResolutionKind?.NodeJs || 2,
          module: ts.ModuleKind?.ESNext || 99,
          noEmit: true,
          esModuleInterop: true,
          jsx: ts.JsxEmit?.React || 2,
          allowJs: true,
          typeRoots: ['node_modules/@types'],
        });

        // Add Three.js type definitions hint
        ts.typescriptDefaults.addExtraLib(
          `
          declare module 'three' {
            export * from 'three';
          }
          declare const THREE: typeof import('three');
          declare const scene: THREE.Scene;
          declare const camera: THREE.PerspectiveCamera;
          declare const renderer: THREE.WebGLRenderer;
          `,
          'ts:three-globals.d.ts'
        );
      }
    } catch (e) {
      console.warn('Failed to configure TypeScript defaults:', e);
    }

    this.editor = monaco.editor.create(this.container, {
      value: options.value || '',
      language: options.language || 'typescript',
      theme: THEME_NAME,
      readOnly: options.readOnly || false,
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      fontFamily: "'Space Mono', 'Fira Code', 'Consolas', monospace",
      fontLigatures: true,
      lineNumbers: 'on',
      lineHeight: 22,
      padding: { top: 16, bottom: 16 },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      tabSize: 2,
      insertSpaces: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showClasses: true,
        showFunctions: true,
        showVariables: true,
      },
    });

    // Handle content changes
    if (options.onChange) {
      const disposable = this.editor.onDidChangeModelContent(() => {
        options.onChange!(this.getValue());
      });
      this.disposables.push(disposable);
    }

    // Add keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  private setupKeyboardShortcuts(): void {
    // Ctrl/Cmd + S to trigger save (prevent browser save dialog)
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Dispatch custom event for save
      const event = new CustomEvent('editor-save', { detail: this.getValue() });
      document.dispatchEvent(event);
    });

    // Ctrl/Cmd + Enter to run code
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const event = new CustomEvent('editor-run', { detail: this.getValue() });
      document.dispatchEvent(event);
    });
  }

  getValue(): string {
    return this.editor.getValue();
  }

  setValue(value: string): void {
    this.editor.setValue(value);
  }

  setLanguage(language: string): void {
    const model = this.editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, language);
    }
  }

  setReadOnly(readOnly: boolean): void {
    this.editor.updateOptions({ readOnly });
  }

  focus(): void {
    this.editor.focus();
  }

  layout(): void {
    this.editor.layout();
  }

  // Insert code at cursor position
  insertAtCursor(text: string): void {
    const selection = this.editor.getSelection();
    if (selection) {
      this.editor.executeEdits('', [
        {
          range: selection,
          text,
          forceMoveMarkers: true,
        },
      ]);
    }
  }

  // Add error markers
  setErrors(errors: Array<{ line: number; column: number; message: string }>): void {
    const model = this.editor.getModel();
    if (!model) return;

    const markers: monaco.editor.IMarkerData[] = errors.map((error) => ({
      severity: monaco.MarkerSeverity.Error,
      startLineNumber: error.line,
      startColumn: error.column,
      endLineNumber: error.line,
      endColumn: error.column + 1,
      message: error.message,
    }));

    monaco.editor.setModelMarkers(model, 'validation', markers);
  }

  clearErrors(): void {
    const model = this.editor.getModel();
    if (model) {
      monaco.editor.setModelMarkers(model, 'validation', []);
    }
  }

  // Highlight line (for debugging/stepping)
  highlightLine(lineNumber: number): monaco.editor.IEditorDecorationsCollection {
    return this.editor.createDecorationsCollection([
      {
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: 'highlighted-line',
          glyphMarginClassName: 'highlighted-glyph',
        },
      },
    ]);
  }

  dispose(): void {
    this.disposables.forEach((d) => d.dispose());
    this.editor.dispose();
  }

  // Alias methods for compatibility
  getCode(): string {
    return this.getValue();
  }

  setCode(code: string): void {
    this.setValue(code);
  }

  destroy(): void {
    this.dispose();
  }

  // Static method to create and initialize
  static async create(options: MonacoEditorOptions): Promise<MonacoEditor> {
    return new MonacoEditor(options);
  }

  async init(): Promise<void> {
    // Editor is already initialized in constructor
    // This is just for compatibility with the app
  }
}

// GLSL language configuration for shaders
monaco.languages.register({ id: 'glsl' });

monaco.languages.setMonarchTokensProvider('glsl', {
  tokenizer: {
    root: [
      [/\/\/.*$/, 'comment'],
      [/\/\*/, 'comment', '@comment'],
      [/\b(void|float|int|bool|vec[234]|mat[234]|sampler2D|samplerCube)\b/, 'type'],
      [/\b(uniform|varying|attribute|in|out|inout|const|precision|highp|mediump|lowp)\b/, 'keyword'],
      [/\b(if|else|for|while|do|return|break|continue|discard)\b/, 'keyword'],
      [/\b(gl_Position|gl_FragColor|gl_FragCoord|gl_PointSize|gl_PointCoord)\b/, 'variable'],
      [/\b(sin|cos|tan|asin|acos|atan|pow|exp|log|sqrt|abs|sign|floor|ceil|fract|mod|min|max|clamp|mix|step|smoothstep|length|distance|dot|cross|normalize|reflect|refract|texture2D|textureCube)\b/, 'function'],
      [/[0-9]+\.?[0-9]*([eE][-+]?[0-9]+)?/, 'number'],
      [/[a-zA-Z_]\w*/, 'identifier'],
      [/[{}()\[\]]/, '@brackets'],
      [/[<>]=?|[!=]=|[+\-*/%&|^!~]/, 'operator'],
    ],
    comment: [
      [/[^/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[/*]/, 'comment'],
    ],
  },
});

export default MonacoEditor;
