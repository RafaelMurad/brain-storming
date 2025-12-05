/**
 * Example 01: Drawing a Simple Triangle
 * This is the "Hello World" of WebGL - drawing a single triangle.
 *
 * Concepts covered:
 * - WebGL context initialization
 * - Creating and compiling shaders
 * - Setting up vertex buffers
 * - Drawing primitives
 */

import { WebGLUtils } from '@/utils/webgl-utils';

export interface Example {
  init: (canvas: HTMLCanvasElement) => void;
  cleanup?: () => void;
  getDescription: () => string;
  getControls?: () => HTMLElement | null;
  [key: string]: any; // Allow additional properties
}

export const TriangleExample: Example = {
  init(canvas: HTMLCanvasElement) {
    const gl = WebGLUtils.initWebGL(canvas);
    if (!gl) return;

    // Vertex shader: defines the position of each vertex
    const vertexShaderSource = `
      attribute vec4 a_position;

      void main() {
        gl_Position = a_position;
      }
    `;

    // Fragment shader: defines the color of each pixel
    const fragmentShaderSource = `
      precision mediump float;

      void main() {
        gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0); // Orange color
      }
    `;

    // Create shader program
    const program = WebGLUtils.createProgramFromSource(
      gl,
      vertexShaderSource,
      fragmentShaderSource
    );

    if (!program) return;

    // Define triangle vertices (in clip space: -1 to 1)
    const vertices = new Float32Array([
      0.0,  0.5,   // Top vertex
     -0.5, -0.5,   // Bottom left vertex
      0.5, -0.5    // Bottom right vertex
    ]);

    // Create buffer and upload vertex data
    const buffer = WebGLUtils.createBuffer(gl, vertices);
    if (!buffer) return;

    // Clear canvas
    WebGLUtils.clearCanvas(gl, 0.1, 0.1, 0.1, 1.0);

    // Use the shader program
    gl.useProgram(program);

    // Set up attribute pointer
    WebGLUtils.setAttribute(gl, program, 'a_position', 2);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  },

  getDescription() {
    return `
      <h3>Your First Triangle</h3>
      <p>This example demonstrates the fundamental WebGL rendering pipeline:</p>
      <ul>
        <li><strong>Vertex Shader:</strong> Processes each vertex position</li>
        <li><strong>Fragment Shader:</strong> Determines pixel colors</li>
        <li><strong>Vertex Buffer:</strong> Stores triangle coordinates</li>
        <li><strong>Draw Call:</strong> Renders the triangle to the canvas</li>
      </ul>
      <p>The triangle is drawn in <em>clip space</em> coordinates, where x and y range from -1 to 1.</p>
      <p><strong>Try:</strong> Modify the vertex positions in the code to see how the triangle changes!</p>
    `;
  }
};
