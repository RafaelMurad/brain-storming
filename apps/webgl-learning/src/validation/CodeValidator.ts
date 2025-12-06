/**
 * CodeValidator - Real-time code validation for Three.js exercises
 * 
 * Uses pattern matching and AST-like analysis to validate user code
 * against exercise requirements.
 */

export interface ValidationRule {
  id: string;
  description: string;
  pattern?: RegExp;
  custom?: (code: string) => boolean;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  passed: boolean;
  ruleId: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  line?: number;
  message?: string;
}

export interface ValidationSummary {
  passed: number;
  failed: number;
  warnings: number;
  total: number;
  results: ValidationResult[];
  isComplete: boolean;
}

// Common Three.js validation rules
export const THREE_JS_RULES: Record<string, ValidationRule> = {
  // Scene setup
  sceneCreated: {
    id: 'scene-created',
    description: 'Create a THREE.Scene',
    pattern: /new\s+THREE\.Scene\s*\(/,
    severity: 'error',
  },
  cameraCreated: {
    id: 'camera-created',
    description: 'Create a Camera (Perspective or Orthographic)',
    pattern: /new\s+THREE\.(Perspective|Orthographic)Camera\s*\(/,
    severity: 'error',
  },
  rendererCreated: {
    id: 'renderer-created',
    description: 'Create a WebGLRenderer',
    pattern: /new\s+THREE\.WebGLRenderer\s*\(/,
    severity: 'error',
  },
  rendererSetSize: {
    id: 'renderer-set-size',
    description: 'Set renderer size',
    pattern: /renderer\.setSize\s*\(/,
    severity: 'warning',
  },
  
  // Mesh creation
  geometryCreated: {
    id: 'geometry-created',
    description: 'Create a Geometry',
    pattern: /new\s+THREE\.\w+Geometry\s*\(/,
    severity: 'error',
  },
  materialCreated: {
    id: 'material-created',
    description: 'Create a Material',
    pattern: /new\s+THREE\.\w+Material\s*\(/,
    severity: 'error',
  },
  meshCreated: {
    id: 'mesh-created',
    description: 'Create a Mesh',
    pattern: /new\s+THREE\.Mesh\s*\(/,
    severity: 'error',
  },
  meshAddedToScene: {
    id: 'mesh-added',
    description: 'Add object to scene',
    pattern: /scene\.add\s*\(/,
    severity: 'error',
  },
  
  // Animation
  animationLoop: {
    id: 'animation-loop',
    description: 'Create animation loop',
    pattern: /requestAnimationFrame|animate\s*\(/,
    severity: 'info',
  },
  renderCalled: {
    id: 'render-called',
    description: 'Call renderer.render()',
    pattern: /renderer\.render\s*\(\s*scene\s*,\s*camera\s*\)/,
    severity: 'error',
  },
  
  // Lighting
  lightCreated: {
    id: 'light-created',
    description: 'Create a Light',
    pattern: /new\s+THREE\.(Ambient|Directional|Point|Spot|Hemisphere)Light\s*\(/,
    severity: 'info',
  },
  lightAddedToScene: {
    id: 'light-added',
    description: 'Add light to scene',
    custom: (code) => {
      const hasLight = /new\s+THREE\.\w+Light\s*\(/.test(code);
      const hasAdd = /scene\.add\s*\(/.test(code);
      return !hasLight || hasAdd; // Pass if no light, or if light + add
    },
    severity: 'warning',
  },
  
  // Best practices
  antialiasEnabled: {
    id: 'antialias-enabled',
    description: 'Enable antialiasing for smooth edges',
    pattern: /antialias\s*:\s*true/,
    severity: 'info',
  },
  pixelRatioSet: {
    id: 'pixel-ratio-set',
    description: 'Set pixel ratio for high-DPI displays',
    pattern: /setPixelRatio\s*\(/,
    severity: 'info',
  },
  disposeGeometry: {
    id: 'dispose-geometry',
    description: 'Dispose geometry when removing objects',
    pattern: /\.geometry\.dispose\s*\(\)/,
    severity: 'info',
  },
  disposeMaterial: {
    id: 'dispose-material',
    description: 'Dispose material when removing objects',
    pattern: /\.material\.dispose\s*\(\)/,
    severity: 'info',
  },
};

export class CodeValidator {
  private rules: ValidationRule[] = [];

  constructor(rules?: ValidationRule[]) {
    this.rules = rules || [];
  }

  /**
   * Add rules for validation
   */
  addRules(...rules: ValidationRule[]): void {
    this.rules.push(...rules);
  }

  /**
   * Clear all rules
   */
  clearRules(): void {
    this.rules = [];
  }

  /**
   * Set rules from rule IDs
   */
  setRulesFromIds(ruleIds: string[]): void {
    this.rules = ruleIds
      .map(id => THREE_JS_RULES[id])
      .filter((rule): rule is ValidationRule => !!rule);
  }

  /**
   * Validate code against all configured rules
   */
  validate(code: string): ValidationSummary {
    const results: ValidationResult[] = [];
    let passed = 0;
    let failed = 0;
    let warnings = 0;

    for (const rule of this.rules) {
      let isPassed = false;

      if (rule.custom) {
        isPassed = rule.custom(code);
      } else if (rule.pattern) {
        isPassed = rule.pattern.test(code);
      }

      const result: ValidationResult = {
        passed: isPassed,
        ruleId: rule.id,
        description: rule.description,
        severity: rule.severity,
      };

      if (!isPassed) {
        result.message = `Missing: ${rule.description}`;
        
        // Try to find line number for pattern-based rules
        if (rule.pattern) {
          result.line = this.findSuggestedLine(code, rule.id);
        }
      }

      results.push(result);

      if (isPassed) {
        passed++;
      } else if (rule.severity === 'error') {
        failed++;
      } else if (rule.severity === 'warning') {
        warnings++;
      }
    }

    const errorRules = this.rules.filter(r => r.severity === 'error');
    const passedErrors = results.filter(r => r.passed && errorRules.some(rule => rule.id === r.ruleId));
    const isComplete = passedErrors.length === errorRules.length;

    return {
      passed,
      failed,
      warnings,
      total: this.rules.length,
      results,
      isComplete,
    };
  }

  /**
   * Find a suggested line number based on context
   */
  private findSuggestedLine(code: string, ruleId: string): number | undefined {
    const lines = code.split('\n');
    
    // Look for TODO comments or related code
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      if (line.includes('todo') || line.includes('your code')) {
        return i + 1;
      }
      
      // Rule-specific hints
      if (ruleId === 'scene-created' && line.includes('scene')) {
        return i + 1;
      }
      if (ruleId === 'camera-created' && line.includes('camera')) {
        return i + 1;
      }
      if (ruleId === 'mesh-created' && (line.includes('geometry') || line.includes('material'))) {
        return i + 1;
      }
    }

    return undefined;
  }

  /**
   * Quick check if code has minimum viable Three.js setup
   */
  static hasMinimalSetup(code: string): boolean {
    return (
      /new\s+THREE\.Scene/.test(code) &&
      /new\s+THREE\.\w+Camera/.test(code) &&
      /new\s+THREE\.WebGLRenderer/.test(code)
    );
  }

  /**
   * Extract Three.js objects mentioned in code
   */
  static extractThreeJsObjects(code: string): string[] {
    const matches = code.match(/THREE\.(\w+)/g) || [];
    return [...new Set(matches.map(m => m.replace('THREE.', '')))];
  }

  /**
   * Count scene objects (meshes, lights, helpers)
   */
  static countSceneObjects(code: string): number {
    const addCalls = code.match(/scene\.add\s*\(/g) || [];
    return addCalls.length;
  }
}

// Pre-configured validators for common exercises
export const EXERCISE_VALIDATORS = {
  // First scene setup
  firstScene: () => {
    const validator = new CodeValidator();
    validator.addRules(
      THREE_JS_RULES.sceneCreated,
      THREE_JS_RULES.cameraCreated,
      THREE_JS_RULES.rendererCreated,
      THREE_JS_RULES.rendererSetSize,
    );
    return validator;
  },

  // First cube exercise
  firstCube: () => {
    const validator = new CodeValidator();
    validator.addRules(
      THREE_JS_RULES.geometryCreated,
      THREE_JS_RULES.materialCreated,
      THREE_JS_RULES.meshCreated,
      THREE_JS_RULES.meshAddedToScene,
      THREE_JS_RULES.renderCalled,
    );
    return validator;
  },

  // Animation loop
  animationLoop: () => {
    const validator = new CodeValidator();
    validator.addRules(
      THREE_JS_RULES.animationLoop,
      THREE_JS_RULES.renderCalled,
    );
    return validator;
  },

  // Lighting setup
  lighting: () => {
    const validator = new CodeValidator();
    validator.addRules(
      THREE_JS_RULES.lightCreated,
      THREE_JS_RULES.lightAddedToScene,
    );
    return validator;
  },
};

export default CodeValidator;
