/**
 * Sandbox - Secure iframe-based code execution for Three.js exercises
 * 
 * Executes user code in an isolated iframe with Three.js pre-loaded.
 * Communicates via postMessage for security.
 */

export interface SandboxResult {
  success: boolean;
  error?: string;
  logs: string[];
  executionTime: number;
}

export interface SandboxOptions {
  container: HTMLElement;
  onLog?: (message: string) => void;
  onError?: (error: string) => void;
  onSceneReady?: (info: { objectCount: number }) => void;
}

export class Sandbox {
  private iframe: HTMLIFrameElement;
  private container: HTMLElement;
  private messageHandler: (event: MessageEvent) => void;
  private pendingExecutions: Map<string, {
    resolve: (result: SandboxResult) => void;
    reject: (error: Error) => void;
    logs: string[];
    startTime: number;
  }> = new Map();
  
  private options: SandboxOptions;

  constructor(options: SandboxOptions) {
    this.container = options.container;
    this.options = options;

    // Create iframe
    this.iframe = document.createElement('iframe');
    this.iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: #0a0a0a;
    `;
    this.iframe.sandbox.add('allow-scripts');
    
    // Set up message handler
    this.messageHandler = this.handleMessage.bind(this);
    window.addEventListener('message', this.messageHandler);

    // Initialize iframe with sandbox HTML
    this.initializeIframe();
  }

  private initializeIframe(): void {
    const sandboxHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #0a0a0a; }
    canvas { display: block; width: 100%; height: 100%; }
    #error-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 16px;
      background: rgba(255, 0, 0, 0.9);
      color: white;
      font-family: 'Space Mono', monospace;
      font-size: 12px;
      display: none;
      z-index: 1000;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r170/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.170.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body>
  <div id="error-overlay"></div>
  <script>
    // Sandbox execution environment
    const logs = [];
    let scene, camera, renderer, controls;
    let animationId = null;
    let currentExecutionId = null;
    
    // Override console for capturing logs
    const originalConsole = { ...console };
    console.log = (...args) => {
      const message = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      logs.push(message);
      parent.postMessage({ type: 'log', executionId: currentExecutionId, message }, '*');
      originalConsole.log(...args);
    };
    console.error = (...args) => {
      const message = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      logs.push('[ERROR] ' + message);
      parent.postMessage({ type: 'error', executionId: currentExecutionId, message }, '*');
      originalConsole.error(...args);
    };
    console.warn = (...args) => {
      const message = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      logs.push('[WARN] ' + message);
      parent.postMessage({ type: 'log', executionId: currentExecutionId, message: '[WARN] ' + message }, '*');
      originalConsole.warn(...args);
    };

    // Initialize Three.js scene
    function initScene() {
      // Clean up previous scene
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      
      // Create new scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a0a);
      
      // Create camera
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;
      
      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      document.body.appendChild(renderer.domElement);
      
      // Add orbit controls
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      
      // Handle resize
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
      
      return { scene, camera, renderer, controls };
    }

    // Execute user code
    function executeCode(code, executionId) {
      currentExecutionId = executionId;
      logs.length = 0;
      
      const errorOverlay = document.getElementById('error-overlay');
      errorOverlay.style.display = 'none';
      
      try {
        // Initialize scene
        const ctx = initScene();
        
        // Wrap code in async IIFE to support await
        const wrappedCode = \`
          (async function() {
            const { scene, camera, renderer, controls } = arguments[0];
            const THREE = window.THREE;
            
            // User code starts here
            \${code}
            // User code ends here
            
            // If user didn't set up animation loop, render once
            if (!window._userAnimationLoop) {
              renderer.render(scene, camera);
            }
          })(arguments[0]);
        \`;
        
        // Execute
        const fn = new Function('ctx', wrappedCode);
        fn(ctx);
        
        // Report success
        parent.postMessage({
          type: 'execution-complete',
          executionId,
          success: true,
          logs: [...logs],
          sceneInfo: {
            objectCount: scene.children.length,
          },
        }, '*');
        
      } catch (error) {
        errorOverlay.textContent = error.message;
        errorOverlay.style.display = 'block';
        
        parent.postMessage({
          type: 'execution-complete',
          executionId,
          success: false,
          error: error.message,
          logs: [...logs],
        }, '*');
      }
    }

    // Helper: Create animation loop
    window.animate = function(callback) {
      window._userAnimationLoop = true;
      function loop() {
        animationId = requestAnimationFrame(loop);
        if (controls) controls.update();
        callback();
        renderer.render(scene, camera);
      }
      loop();
    };

    // Listen for messages from parent
    window.addEventListener('message', (event) => {
      if (event.data.type === 'execute') {
        executeCode(event.data.code, event.data.executionId);
      } else if (event.data.type === 'reset') {
        initScene();
        parent.postMessage({ type: 'reset-complete' }, '*');
      }
    });

    // Signal ready
    parent.postMessage({ type: 'sandbox-ready' }, '*');
  </script>
</body>
</html>
    `;

    this.iframe.srcdoc = sandboxHTML;
    this.container.appendChild(this.iframe);
  }

  private handleMessage(event: MessageEvent): void {
    const data = event.data;
    
    if (data.type === 'sandbox-ready') {
      // Sandbox is ready
      return;
    }
    
    if (data.type === 'log' && this.options.onLog) {
      this.options.onLog(data.message);
    }
    
    if (data.type === 'error' && this.options.onError) {
      this.options.onError(data.message);
    }
    
    if (data.type === 'execution-complete') {
      const execution = this.pendingExecutions.get(data.executionId);
      if (execution) {
        const executionTime = Date.now() - execution.startTime;
        execution.resolve({
          success: data.success,
          error: data.error,
          logs: data.logs || [],
          executionTime,
        });
        this.pendingExecutions.delete(data.executionId);
        
        if (data.success && this.options.onSceneReady) {
          this.options.onSceneReady(data.sceneInfo);
        }
      }
    }
  }

  /**
   * Execute code in the sandbox
   */
  execute(code: string): Promise<SandboxResult> {
    return new Promise((resolve, reject) => {
      const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      this.pendingExecutions.set(executionId, {
        resolve,
        reject,
        logs: [],
        startTime: Date.now(),
      });
      
      // Send code to iframe
      this.iframe.contentWindow?.postMessage({
        type: 'execute',
        code,
        executionId,
      }, '*');
      
      // Timeout after 30 seconds
      setTimeout(() => {
        const execution = this.pendingExecutions.get(executionId);
        if (execution) {
          execution.reject(new Error('Execution timeout'));
          this.pendingExecutions.delete(executionId);
        }
      }, 30000);
    });
  }

  /**
   * Reset the sandbox scene
   */
  reset(): Promise<void> {
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        if (event.data.type === 'reset-complete') {
          window.removeEventListener('message', handler);
          resolve();
        }
      };
      window.addEventListener('message', handler);
      
      this.iframe.contentWindow?.postMessage({ type: 'reset' }, '*');
    });
  }

  /**
   * Dispose of the sandbox
   */
  dispose(): void {
    window.removeEventListener('message', this.messageHandler);
    this.iframe.remove();
    this.pendingExecutions.clear();
  }
}

export default Sandbox;
