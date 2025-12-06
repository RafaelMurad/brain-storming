import * as monaco from 'monaco-editor';

// Three.js Academy custom theme
const THEME_NAME = 'threejs-academy-dark';

// Three.js code snippets for faster development
const THREE_JS_SNIPPETS: monaco.languages.CompletionItem[] = [
  {
    label: 'scene-setup',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: [
      '// Scene Setup',
      'const scene = new THREE.Scene();',
      'scene.background = new THREE.Color(0x${1:0a0a0a});',
      '',
      'const camera = new THREE.PerspectiveCamera(${2:75}, window.innerWidth / window.innerHeight, 0.1, 1000);',
      'camera.position.z = ${3:5};',
      '',
      'const renderer = new THREE.WebGLRenderer({ antialias: true });',
      'renderer.setSize(window.innerWidth, window.innerHeight);',
      'renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));',
      'document.body.appendChild(renderer.domElement);',
      '$0'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Complete Three.js scene setup with Scene, Camera, and Renderer',
    detail: 'Three.js Academy',
  },
  {
    label: 'mesh-create',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: [
      '// Create Mesh',
      'const geometry = new THREE.${1:BoxGeometry}(${2:1, 1, 1});',
      'const material = new THREE.${3:MeshStandardMaterial}({ color: 0x${4:FF4D00} });',
      'const ${5:mesh} = new THREE.Mesh(geometry, material);',
      'scene.add(${5:mesh});',
      '$0'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Create a mesh with geometry and material',
    detail: 'Three.js Academy',
  },
  {
    label: 'animation-loop',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: [
      '// Animation Loop',
      'function animate() {',
      '\trequestAnimationFrame(animate);',
      '\t',
      '\t${1:// Update objects}',
      '\t${2:cube.rotation.x += 0.01;',
      '\tcube.rotation.y += 0.01;}',
      '\t',
      '\trenderer.render(scene, camera);',
      '}',
      'animate();',
      '$0'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Create a requestAnimationFrame loop for rendering',
    detail: 'Three.js Academy',
  },
  {
    label: 'orbit-controls',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: [
      '// Orbit Controls',
      'const controls = new THREE.OrbitControls(camera, renderer.domElement);',
      'controls.enableDamping = true;',
      'controls.dampingFactor = 0.05;',
      'controls.screenSpacePanning = false;',
      'controls.minDistance = ${1:1};',
      'controls.maxDistance = ${2:100};',
      '$0'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Add OrbitControls for camera interaction',
    detail: 'Three.js Academy',
  },
  {
    label: 'light-ambient',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: [
      '// Ambient Light',
      'const ambientLight = new THREE.AmbientLight(0x${1:ffffff}, ${2:0.5});',
      'scene.add(ambientLight);',
      '$0'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Add ambient lighting to the scene',
    detail: 'Three.js Academy',
  },
  {
    label: 'light-directional',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: [
      '// Directional Light',
      'const directionalLight = new THREE.DirectionalLight(0x${1:ffffff}, ${2:1});',
      'directionalLight.position.set(${3:5}, ${4:5}, ${5:5});',
      'directionalLight.castShadow = true;',
      'scene.add(directionalLight);',
      '$0'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Add directional light with shadows',
    detail: 'Three.js Academy',
  },
  {
    label: 'resize-handler',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: [
      '// Handle Window Resize',
      'window.addEventListener("resize", () => {',
      '\tcamera.aspect = window.innerWidth / window.innerHeight;',
      '\tcamera.updateProjectionMatrix();',
      '\trenderer.setSize(window.innerWidth, window.innerHeight);',
      '});',
      '$0'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Handle responsive canvas resizing',
    detail: 'Three.js Academy',
  },
  {
    label: 'texture-load',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: [
      '// Load Texture',
      'const textureLoader = new THREE.TextureLoader();',
      'const texture = textureLoader.load("${1:path/to/texture.jpg}");',
      'texture.colorSpace = THREE.SRGBColorSpace;',
      '$0'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Load a texture using TextureLoader',
    detail: 'Three.js Academy',
  },
  {
    label: 'group-create',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: [
      '// Create Group',
      'const group = new THREE.Group();',
      'group.add(${1:mesh1});',
      'group.add(${2:mesh2});',
      'scene.add(group);',
      '$0'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Create a group to organize multiple objects',
    detail: 'Three.js Academy',
  },
  {
    label: 'raycaster',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: [
      '// Raycaster for mouse picking',
      'const raycaster = new THREE.Raycaster();',
      'const mouse = new THREE.Vector2();',
      '',
      'window.addEventListener("click", (event) => {',
      '\tmouse.x = (event.clientX / window.innerWidth) * 2 - 1;',
      '\tmouse.y = -(event.clientY / window.innerHeight) * 2 + 1;',
      '\t',
      '\traycaster.setFromCamera(mouse, camera);',
      '\tconst intersects = raycaster.intersectObjects(scene.children);',
      '\t',
      '\tif (intersects.length > 0) {',
      '\t\tconsole.log("Clicked:", intersects[0].object);',
      '\t}',
      '});',
      '$0'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: 'Set up raycaster for mouse interaction',
    detail: 'Three.js Academy',
  },
] as monaco.languages.CompletionItem[];

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
  onRun?: (code: string) => void;
  autoRun?: boolean;
  autoRunDelay?: number;
}

// Register Three.js snippets provider
let snippetsRegistered = false;
function registerThreeJsSnippets(): void {
  if (snippetsRegistered) return;
  snippetsRegistered = true;

  monaco.languages.registerCompletionItemProvider('typescript', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range: monaco.IRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = THREE_JS_SNIPPETS.map(snippet => ({
        ...snippet,
        range,
      }));

      return { suggestions };
    },
  });

  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range: monaco.IRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = THREE_JS_SNIPPETS.map(snippet => ({
        ...snippet,
        range,
      }));

      return { suggestions };
    },
  });
}

export class MonacoEditor {
  private editor: monaco.editor.IStandaloneCodeEditor;
  private container: HTMLElement;
  private disposables: monaco.IDisposable[] = [];
  private autoRunTimeout: ReturnType<typeof setTimeout> | null = null;
  private options: MonacoEditorOptions;

  constructor(options: MonacoEditorOptions) {
    this.container = options.container;
    this.options = options;

    // Register snippets
    registerThreeJsSnippets();

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
    const disposable = this.editor.onDidChangeModelContent(() => {
      const code = this.getValue();
      
      // Notify onChange callback
      options.onChange?.(code);
      
      // Auto-run with debounce
      if (options.autoRun && options.onRun) {
        if (this.autoRunTimeout) {
          clearTimeout(this.autoRunTimeout);
        }
        this.autoRunTimeout = setTimeout(() => {
          options.onRun!(code);
          this.autoRunTimeout = null;
        }, options.autoRunDelay || 500);
      }
    });
    this.disposables.push(disposable);

    // Add keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  private setupKeyboardShortcuts(): void {
    // Ctrl/Cmd + S to trigger save (prevent browser save dialog)
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Dispatch custom event for save
      const event = new CustomEvent('editor-save', { detail: this.getValue() });
      document.dispatchEvent(event);
      // Also trigger onRun if available
      this.options.onRun?.(this.getValue());
    });

    // Ctrl/Cmd + Enter to run code
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const event = new CustomEvent('editor-run', { detail: this.getValue() });
      document.dispatchEvent(event);
      // Also trigger onRun if available
      this.options.onRun?.(this.getValue());
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
    if (this.autoRunTimeout) {
      clearTimeout(this.autoRunTimeout);
    }
    this.disposables.forEach((d) => d.dispose());
    this.editor.dispose();
  }

  // Auto-run control
  setAutoRun(enabled: boolean): void {
    this.options.autoRun = enabled;
  }

  isAutoRunEnabled(): boolean {
    return this.options.autoRun || false;
  }

  setAutoRunDelay(delay: number): void {
    this.options.autoRunDelay = delay;
  }

  // Set onRun callback
  setOnRun(callback: (code: string) => void): void {
    this.options.onRun = callback;
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
