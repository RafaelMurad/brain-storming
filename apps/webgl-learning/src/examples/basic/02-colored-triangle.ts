/**
 * Example 02: Colored Triangle with Vertex Colors
 * Learn how to pass colors per vertex and see them interpolate.
 *
 * Concepts covered:
 * - Multiple vertex attributes
 * - Color interpolation (varying variables)
 * - Interleaved vs separate buffers
 */

import { WebGLUtils } from '@/utils/webgl-utils';
import type { Example } from './01-triangle';

export const ColoredTriangleExample: Example = {
  init(canvas: HTMLCanvasElement) {
    const gl = WebGLUtils.initWebGL(canvas);
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec3 a_color;

      varying vec3 v_color;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
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

    // Vertex positions
    const positions = new Float32Array([
      0.0,  0.6,   // Top
     -0.6, -0.6,   // Bottom left
      0.6, -0.6    // Bottom right
    ]);

    // Vertex colors (RGB)
    const colors = new Float32Array([
      1.0, 0.0, 0.0,  // Red
      0.0, 1.0, 0.0,  // Green
      0.0, 0.0, 1.0   // Blue
    ]);

    // Create and bind position buffer
    const positionBuffer = WebGLUtils.createBuffer(gl, positions);
    if (!positionBuffer) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_position', 2);

    // Create and bind color buffer
    const colorBuffer = WebGLUtils.createBuffer(gl, colors);
    if (!colorBuffer) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_color', 3);

    // Clear and draw
    WebGLUtils.clearCanvas(gl, 0.0, 0.0, 0.0, 1.0);
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  },

  getDescription() {
    return `
      <h3>Vertex Colors & Interpolation</h3>
      <p>This example shows how WebGL automatically interpolates colors between vertices:</p>
      <ul>
        <li><strong>Red vertex</strong> at the top</li>
        <li><strong>Green vertex</strong> at bottom left</li>
        <li><strong>Blue vertex</strong> at bottom right</li>
      </ul>
      <p>Notice how the colors blend smoothly across the triangle's surface. This is called
      <em>varying interpolation</em> - the GPU automatically calculates intermediate values for each pixel.</p>
      <p><strong>Key Concept:</strong> The <code>varying</code> variable passes data from vertex shader
      to fragment shader, with automatic interpolation.</p>
    `;
  }
};
