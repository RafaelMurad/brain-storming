/**
 * Example 04: Animated Rotating Triangle
 * Introduction to animation using requestAnimationFrame.
 *
 * Concepts covered:
 * - Animation loop
 * - Uniform variables
 * - Time-based transformations
 */

import { WebGLUtils } from '@/utils/webgl-utils';
import type { Example } from './01-triangle';

export const AnimationExample: Example = {
  animationId: null as number | null,

  init(canvas: HTMLCanvasElement) {
    const gl = WebGLUtils.initWebGL(canvas);
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 a_position;
      uniform float u_rotation;

      void main() {
        // Apply rotation transformation
        float c = cos(u_rotation);
        float s = sin(u_rotation);

        vec2 rotated = vec2(
          a_position.x * c - a_position.y * s,
          a_position.x * s + a_position.y * c
        );

        gl_Position = vec4(rotated, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_rotation;

      void main() {
        // Color changes with rotation
        float r = (sin(u_rotation) + 1.0) / 2.0;
        float g = (cos(u_rotation) + 1.0) / 2.0;
        float b = (sin(u_rotation + 3.14159) + 1.0) / 2.0;

        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

    const program = WebGLUtils.createProgramFromSource(
      gl,
      vertexShaderSource,
      fragmentShaderSource
    );

    if (!program) return;

    const vertices = new Float32Array([
      0.0,  0.6,
     -0.5, -0.3,
      0.5, -0.3
    ]);

    const buffer = WebGLUtils.createBuffer(gl, vertices);
    if (!buffer) return;

    gl.useProgram(program);
    WebGLUtils.setAttribute(gl, program, 'a_position', 2);

    let rotation = 0;
    const rotationSpeed = 0.02;

    const render = () => {
      rotation += rotationSpeed;

      WebGLUtils.clearCanvas(gl, 0.0, 0.0, 0.0, 1.0);
      WebGLUtils.setUniform(gl, program, 'u_rotation', '1f', rotation);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

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

  getDescription() {
    return `
      <h3>Animation & Uniforms</h3>
      <p>This example introduces continuous animation using <code>requestAnimationFrame</code>:</p>
      <ul>
        <li><strong>Uniform Variables:</strong> Pass values from JavaScript to shaders (rotation angle)</li>
        <li><strong>Animation Loop:</strong> Continuously update and redraw the scene</li>
        <li><strong>Vertex Transformation:</strong> Apply rotation matrix in vertex shader</li>
        <li><strong>Dynamic Colors:</strong> Fragment shader color changes based on rotation</li>
      </ul>
      <p><strong>Key Difference:</strong> Unlike attributes (per-vertex), uniforms are constant across all
      vertices in a draw call.</p>
      <p><strong>Math Insight:</strong> 2D rotation uses the transformation:
      <br>x' = x·cos(θ) - y·sin(θ)
      <br>y' = x·sin(θ) + y·cos(θ)</p>
    `;
  }
};
