/**
 * Example: 2D Transformations
 * Learn about translation, rotation, and scaling using matrices.
 *
 * Concepts covered:
 * - Transformation matrices
 * - Combining transformations
 * - Matrix multiplication order
 * - Interactive controls
 */

import { WebGLUtils } from '@/utils/webgl-utils';
import type { Example } from '../basic/01-triangle';

export const TransformationsExample: Example = {
  animationId: null as number | null,
  controls: {
    rotation: 0,
    scale: 1,
    translateX: 0,
    translateY: 0
  },

  init(canvas: HTMLCanvasElement) {
    const gl = WebGLUtils.initWebGL(canvas);
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec3 a_color;

      uniform vec2 u_translation;
      uniform float u_rotation;
      uniform float u_scale;

      varying vec3 v_color;

      void main() {
        // Apply transformations: Scale -> Rotate -> Translate
        vec2 position = a_position * u_scale;

        float c = cos(u_rotation);
        float s = sin(u_rotation);
        position = vec2(
          position.x * c - position.y * s,
          position.x * s + position.y * c
        );

        position = position + u_translation;

        gl_Position = vec4(position, 0.0, 1.0);
        v_color = a_color;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      varying vec3 v_color;

      void main() {
        gl_FragColor = vec4(v_color, 1.0);
      }
    `;

    const program = WebGLUtils.createProgramFromSource(
      gl,
      vertexShaderSource,
      fragmentShaderSource
    );

    if (!program) return;

    // Create a simple arrow shape
    const positions = new Float32Array([
      // Arrow head
      0.0,  0.3,
     -0.2,  0.1,
      0.2,  0.1,
      // Arrow body
     -0.1,  0.1,
      0.1,  0.1,
     -0.1, -0.3,
      0.1, -0.3
    ]);

    const colors = new Float32Array([
      1.0, 0.0, 0.0,
      1.0, 0.5, 0.0,
      1.0, 0.5, 0.0,
      0.0, 0.5, 1.0,
      0.0, 0.5, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0
    ]);

    const indices = new Uint16Array([
      0, 1, 2,  // Arrow head
      3, 4, 5,  // Arrow body top
      4, 6, 5   // Arrow body bottom
    ]);

    const positionBuffer = WebGLUtils.createBuffer(gl, positions);
    const colorBuffer = WebGLUtils.createBuffer(gl, colors);
    const indexBuffer = WebGLUtils.createBuffer(gl, indices, gl.ELEMENT_ARRAY_BUFFER);

    if (!positionBuffer || !colorBuffer || !indexBuffer) return;

    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_position', 2);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_color', 3);

    const render = () => {
      WebGLUtils.clearCanvas(gl, 0.1, 0.1, 0.1, 1.0);

      WebGLUtils.setUniform(gl, program, 'u_translation', '2f',
        [this.controls.translateX, this.controls.translateY]);
      WebGLUtils.setUniform(gl, program, 'u_rotation', '1f', this.controls.rotation);
      WebGLUtils.setUniform(gl, program, 'u_scale', '1f', this.controls.scale);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.drawElements(gl.TRIANGLES, 9, gl.UNSIGNED_SHORT, 0);

      this.animationId = requestAnimationFrame(render);
    };

    render();
  },

  cleanup() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  getControls() {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="control-group">
        <label>Rotation: <span id="rotation-value">0°</span></label>
        <input type="range" id="rotation" min="0" max="6.28" step="0.01" value="0">
      </div>
      <div class="control-group">
        <label>Scale: <span id="scale-value">1.0</span></label>
        <input type="range" id="scale" min="0.1" max="3" step="0.1" value="1">
      </div>
      <div class="control-group">
        <label>Translate X: <span id="translateX-value">0.0</span></label>
        <input type="range" id="translateX" min="-0.8" max="0.8" step="0.05" value="0">
      </div>
      <div class="control-group">
        <label>Translate Y: <span id="translateY-value">0.0</span></label>
        <input type="range" id="translateY" min="-0.8" max="0.8" step="0.05" value="0">
      </div>
    `;

    // Set up event listeners
    const rotationSlider = container.querySelector('#rotation') as HTMLInputElement;
    const scaleSlider = container.querySelector('#scale') as HTMLInputElement;
    const translateXSlider = container.querySelector('#translateX') as HTMLInputElement;
    const translateYSlider = container.querySelector('#translateY') as HTMLInputElement;

    rotationSlider.addEventListener('input', (e) => {
      this.controls.rotation = parseFloat((e.target as HTMLInputElement).value);
      container.querySelector('#rotation-value')!.textContent =
        (this.controls.rotation * 180 / Math.PI).toFixed(0) + '°';
    });

    scaleSlider.addEventListener('input', (e) => {
      this.controls.scale = parseFloat((e.target as HTMLInputElement).value);
      container.querySelector('#scale-value')!.textContent = this.controls.scale.toFixed(1);
    });

    translateXSlider.addEventListener('input', (e) => {
      this.controls.translateX = parseFloat((e.target as HTMLInputElement).value);
      container.querySelector('#translateX-value')!.textContent = this.controls.translateX.toFixed(2);
    });

    translateYSlider.addEventListener('input', (e) => {
      this.controls.translateY = parseFloat((e.target as HTMLInputElement).value);
      container.querySelector('#translateY-value')!.textContent = this.controls.translateY.toFixed(2);
    });

    return container;
  },

  getDescription() {
    return `
      <h3>2D Transformations</h3>
      <p>Transform geometry using translation, rotation, and scaling:</p>
      <ul>
        <li><strong>Translation:</strong> Move object in X and Y directions</li>
        <li><strong>Rotation:</strong> Rotate around the origin (center)</li>
        <li><strong>Scale:</strong> Make object larger or smaller</li>
      </ul>
      <p><strong>Transformation Order Matters!</strong></p>
      <p>This example applies transformations in the order: Scale → Rotate → Translate</p>
      <p>Different orders produce different results. For example, rotating then translating
      creates orbital motion, while translating then rotating moves the object along an arc.</p>
      <p><strong>Try:</strong> Use the sliders above to transform the arrow and observe how
      transformations combine!</p>
    `;
  }
};
