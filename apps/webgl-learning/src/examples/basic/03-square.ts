/**
 * Example 03: Drawing a Square using Two Triangles
 * Learn how to draw more complex shapes using multiple primitives.
 *
 * Concepts covered:
 * - Drawing multiple triangles
 * - Triangle strips vs individual triangles
 * - Element indices for efficient rendering
 */

import { WebGLUtils } from '@/utils/webgl-utils';
import type { Example } from './01-triangle';

export const SquareExample: Example = {
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

    // Square vertices (4 corners)
    const positions = new Float32Array([
     -0.5,  0.5,  // Top left
      0.5,  0.5,  // Top right
     -0.5, -0.5,  // Bottom left
      0.5, -0.5   // Bottom right
    ]);

    // Colors for each vertex
    const colors = new Float32Array([
      1.0, 0.0, 0.0,  // Red
      0.0, 1.0, 0.0,  // Green
      0.0, 0.0, 1.0,  // Blue
      1.0, 1.0, 0.0   // Yellow
    ]);

    // Indices to form two triangles from 4 vertices
    // Triangle 1: vertices 0, 1, 2
    // Triangle 2: vertices 1, 3, 2
    const indices = new Uint16Array([
      0, 1, 2,  // First triangle
      1, 3, 2   // Second triangle
    ]);

    // Create and bind buffers
    const positionBuffer = WebGLUtils.createBuffer(gl, positions);
    if (!positionBuffer) return;

    const colorBuffer = WebGLUtils.createBuffer(gl, colors);
    if (!colorBuffer) return;

    const indexBuffer = WebGLUtils.createBuffer(
      gl,
      indices,
      gl.ELEMENT_ARRAY_BUFFER
    );
    if (!indexBuffer) return;

    // Set up attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_position', 2);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_color', 3);

    // Draw using indices
    WebGLUtils.clearCanvas(gl, 0.15, 0.15, 0.15, 1.0);
    gl.useProgram(program);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  },

  getDescription() {
    return `
      <h3>Building Complex Shapes</h3>
      <p>A square is made from two triangles sharing vertices. This example demonstrates:</p>
      <ul>
        <li><strong>Index Buffers:</strong> Reuse vertices efficiently (4 vertices instead of 6)</li>
        <li><strong>Element Drawing:</strong> Using <code>drawElements</code> instead of <code>drawArrays</code></li>
        <li><strong>Vertex Sharing:</strong> Vertices 1 and 2 are shared between both triangles</li>
      </ul>
      <p><strong>Performance Tip:</strong> Index buffers reduce memory usage and improve cache efficiency
      for complex models with shared vertices.</p>
      <p><strong>Vertex Order:</strong></p>
      <pre>
0 ---- 1
|    / |
|  /   |
2 ---- 3
      </pre>
    `;
  }
};
