/**
 * Example: Texture Mapping
 * Learn how to apply images to geometry using texture coordinates.
 *
 * Concepts covered:
 * - Loading and creating textures
 * - Texture coordinates (UV mapping)
 * - Texture samplers in shaders
 * - Texture parameters and filtering
 */

import { WebGLUtils } from '@/utils/webgl-utils';
import type { Example } from '../basic/01-triangle';

export const TextureExample: Example = {
  init(canvas: HTMLCanvasElement) {
    const gl = WebGLUtils.initWebGL(canvas);
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;

      varying vec2 v_texCoord;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;

      uniform sampler2D u_texture;
      varying vec2 v_texCoord;

      void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
      }
    `;

    const program = WebGLUtils.createProgramFromSource(
      gl,
      vertexShaderSource,
      fragmentShaderSource
    );

    if (!program) return;

    // Square vertices
    const positions = new Float32Array([
     -0.7,  0.7,
      0.7,  0.7,
     -0.7, -0.7,
      0.7, -0.7
    ]);

    // Texture coordinates (0,0 is bottom-left, 1,1 is top-right)
    const texCoords = new Float32Array([
      0.0, 1.0,  // Top left
      1.0, 1.0,  // Top right
      0.0, 0.0,  // Bottom left
      1.0, 0.0   // Bottom right
    ]);

    const indices = new Uint16Array([0, 1, 2, 1, 3, 2]);

    // Create buffers
    const positionBuffer = WebGLUtils.createBuffer(gl, positions);
    const texCoordBuffer = WebGLUtils.createBuffer(gl, texCoords);
    const indexBuffer = WebGLUtils.createBuffer(gl, indices, gl.ELEMENT_ARRAY_BUFFER);

    if (!positionBuffer || !texCoordBuffer || !indexBuffer) return;

    // Create a procedural checkerboard texture
    const texture = WebGLUtils.createCheckerboardTexture(gl, 16);
    if (!texture) return;

    // Set up rendering
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_position', 2);

    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_texCoord', 2);

    // Bind texture to texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    WebGLUtils.setUniform(gl, program, 'u_texture', '1i', 0);

    // Draw
    WebGLUtils.clearCanvas(gl, 0.2, 0.2, 0.2, 1.0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  },

  getDescription() {
    return `
      <h3>Texture Mapping Basics</h3>
      <p>Textures allow you to apply images to 3D geometry. This example shows:</p>
      <ul>
        <li><strong>Texture Coordinates (UV):</strong> Map 2D image coordinates to vertices</li>
        <li><strong>Sampler2D:</strong> Shader variable type for accessing textures</li>
        <li><strong>texture2D():</strong> Function to sample color from texture</li>
        <li><strong>Texture Units:</strong> WebGL can use multiple textures simultaneously</li>
      </ul>
      <p><strong>UV Coordinate System:</strong></p>
      <ul>
        <li>(0, 0) = bottom-left corner of image</li>
        <li>(1, 1) = top-right corner of image</li>
        <li>Values outside 0-1 wrap or clamp based on texture parameters</li>
      </ul>
      <p><strong>Try:</strong> Modify texture coordinates to flip, mirror, or tile the texture!</p>
    `;
  }
};
