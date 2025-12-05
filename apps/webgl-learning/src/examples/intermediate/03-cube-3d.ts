/**
 * Example: 3D Cube with Perspective
 * Introduction to 3D graphics with depth testing and perspective projection.
 *
 * Concepts covered:
 * - 3D coordinates and depth
 * - Perspective projection matrix
 * - Depth testing and buffer
 * - Back-face culling
 * - Model-View-Projection matrices
 */

import { WebGLUtils } from '@/utils/webgl-utils';
import { Matrix4 } from '@/utils/matrix';
import type { Example } from '../basic/01-triangle';

export const Cube3DExample: Example = {
  animationId: null as number | null,

  init(canvas: HTMLCanvasElement) {
    const gl = WebGLUtils.initWebGL(canvas);
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec3 a_position;
      attribute vec3 a_color;

      uniform mat4 u_modelViewProjection;

      varying vec3 v_color;

      void main() {
        gl_Position = u_modelViewProjection * vec4(a_position, 1.0);
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

    // Cube vertices (8 corners)
    const vertices = new Float32Array([
      // Front face
     -0.5, -0.5,  0.5,  // 0
      0.5, -0.5,  0.5,  // 1
      0.5,  0.5,  0.5,  // 2
     -0.5,  0.5,  0.5,  // 3
      // Back face
     -0.5, -0.5, -0.5,  // 4
      0.5, -0.5, -0.5,  // 5
      0.5,  0.5, -0.5,  // 6
     -0.5,  0.5, -0.5   // 7
    ]);

    // Colors for each vertex
    const colors = new Float32Array([
      1.0, 0.0, 0.0,  // Red
      0.0, 1.0, 0.0,  // Green
      0.0, 0.0, 1.0,  // Blue
      1.0, 1.0, 0.0,  // Yellow
      1.0, 0.0, 1.0,  // Magenta
      0.0, 1.0, 1.0,  // Cyan
      1.0, 1.0, 1.0,  // White
      0.5, 0.5, 0.5   // Gray
    ]);

    // Indices for 12 triangles (6 faces * 2 triangles per face)
    const indices = new Uint16Array([
      0, 1, 2,  0, 2, 3,  // Front
      5, 4, 7,  5, 7, 6,  // Back
      4, 0, 3,  4, 3, 7,  // Left
      1, 5, 6,  1, 6, 2,  // Right
      3, 2, 6,  3, 6, 7,  // Top
      4, 5, 1,  4, 1, 0   // Bottom
    ]);

    // Create buffers
    const vertexBuffer = WebGLUtils.createBuffer(gl, vertices);
    const colorBuffer = WebGLUtils.createBuffer(gl, colors);
    const indexBuffer = WebGLUtils.createBuffer(gl, indices, gl.ELEMENT_ARRAY_BUFFER);

    if (!vertexBuffer || !colorBuffer || !indexBuffer) return;

    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_position', 3);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_color', 3);

    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Enable back-face culling
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    let angle = 0;

    const render = () => {
      angle += 0.01;

      WebGLUtils.clearCanvas(gl, 0.1, 0.1, 0.15, 1.0);

      // Create model matrix (rotation)
      const modelMatrix = new Matrix4();
      modelMatrix.rotateY(angle);
      modelMatrix.rotateX(angle * 0.7);

      // Create view matrix (camera)
      const viewMatrix = new Matrix4();
      viewMatrix.lookAt(
        0, 0, 3,  // Camera position
        0, 0, 0,  // Look at point
        0, 1, 0   // Up vector
      );

      // Create projection matrix
      const projectionMatrix = new Matrix4();
      const aspect = canvas.width / canvas.height;
      projectionMatrix.perspective(Math.PI / 4, aspect, 0.1, 100);

      // Combine matrices: Projection * View * Model
      const mvpMatrix = projectionMatrix.clone();
      mvpMatrix.multiply(viewMatrix);
      mvpMatrix.multiply(modelMatrix);

      WebGLUtils.setUniform(gl, program, 'u_modelViewProjection', 'matrix4fv', mvpMatrix.elements);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

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
      <h3>3D Rendering with Perspective</h3>
      <p>This example demonstrates core 3D graphics concepts:</p>
      <ul>
        <li><strong>3D Coordinates:</strong> X, Y, and Z positions for vertices</li>
        <li><strong>Depth Testing:</strong> Z-buffer ensures correct visibility of overlapping surfaces</li>
        <li><strong>Perspective Projection:</strong> Objects farther away appear smaller</li>
        <li><strong>Back-face Culling:</strong> Don't render faces pointing away from camera (optimization)</li>
      </ul>
      <p><strong>The MVP Matrix:</strong></p>
      <p>3D rendering uses three transformation matrices:</p>
      <ul>
        <li><strong>Model:</strong> Position and orient the object in world space</li>
        <li><strong>View:</strong> Position and orient the camera</li>
        <li><strong>Projection:</strong> Apply perspective and map to clip space</li>
      </ul>
      <p>Combined as: <code>MVP = Projection × View × Model</code></p>
      <p><strong>Optimization:</strong> Depth testing and culling reduce unnecessary pixel rendering!</p>
    `;
  }
};
