/**
 * Example: Procedural Terrain with Noise
 * Generate and render a 3D terrain using Perlin-like noise.
 *
 * Concepts covered:
 * - Procedural generation
 * - Height maps
 * - Terrain mesh generation
 * - Color gradients based on height
 * - Wireframe rendering
 */

import { WebGLUtils } from '@/utils/webgl-utils';
import { Matrix4 } from '@/utils/matrix';
import type { Example } from '../basic/01-triangle';

export const ProceduralTerrainExample: Example = {
  animationId: null as number | null,

  init(canvas: HTMLCanvasElement) {
    const gl = WebGLUtils.initWebGL(canvas);
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec3 a_position;
      attribute vec3 a_color;

      uniform mat4 u_mvp;

      varying vec3 v_color;

      void main() {
        gl_Position = u_mvp * vec4(a_position, 1.0);
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

    // Generate terrain
    const gridSize = 50;
    const { vertices, colors, indices } = generateTerrain(gridSize, gridSize);

    const vertexBuffer = WebGLUtils.createBuffer(gl, new Float32Array(vertices));
    const colorBuffer = WebGLUtils.createBuffer(gl, new Float32Array(colors));
    const indexBuffer = WebGLUtils.createBuffer(
      gl,
      new Uint16Array(indices),
      gl.ELEMENT_ARRAY_BUFFER
    );

    if (!vertexBuffer || !colorBuffer || !indexBuffer) return;

    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_position', 3);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_color', 3);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    let angle = 0;

    const render = () => {
      angle += 0.005;

      WebGLUtils.clearCanvas(gl, 0.5, 0.7, 0.9, 1.0);

      const modelMatrix = new Matrix4();
      modelMatrix.translate(0, -0.5, 0);
      modelMatrix.rotateY(angle);
      modelMatrix.rotateX(-0.5);

      const viewMatrix = new Matrix4();
      viewMatrix.lookAt(0, 2, 5, 0, 0, 0, 0, 1, 0);

      const projectionMatrix = new Matrix4();
      const aspect = canvas.width / canvas.height;
      projectionMatrix.perspective(Math.PI / 4, aspect, 0.1, 100);

      const mvpMatrix = projectionMatrix.clone();
      mvpMatrix.multiply(viewMatrix);
      mvpMatrix.multiply(modelMatrix);

      WebGLUtils.setUniform(gl, program, 'u_mvp', 'matrix4fv', mvpMatrix.elements);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

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
      <h3>Procedural Terrain Generation</h3>
      <p>Algorithmically generated 3D terrain using noise functions:</p>
      <ul>
        <li><strong>Height Map:</strong> 2D noise function determines terrain elevation</li>
        <li><strong>Mesh Generation:</strong> Grid of vertices with heights from noise</li>
        <li><strong>Color Gradient:</strong> Height-based coloring (blue=low, green=mid, white=high)</li>
        <li><strong>Smooth Noise:</strong> Multiple octaves create natural-looking terrain</li>
      </ul>
      <p><strong>Noise Function:</strong> Simplified Perlin-like noise with multiple frequencies:</p>
      <ul>
        <li>Low frequency = large hills</li>
        <li>High frequency = fine details</li>
        <li>Combining octaves creates realistic terrain</li>
      </ul>
      <p><strong>Applications:</strong> Video games, simulations, data visualization</p>
      <p>The terrain continuously rotates to show all angles of the generated landscape.</p>
    `;
  }
};

function noise(x: number, y: number): number {
  // Simplified noise function
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number): number {
  const corners = (noise(x - 1, y - 1) + noise(x + 1, y - 1) +
                  noise(x - 1, y + 1) + noise(x + 1, y + 1)) / 16;
  const sides = (noise(x - 1, y) + noise(x + 1, y) +
                noise(x, y - 1) + noise(x, y + 1)) / 8;
  const center = noise(x, y) / 4;
  return corners + sides + center;
}

function interpolate(a: number, b: number, t: number): number {
  const ft = t * Math.PI;
  const f = (1 - Math.cos(ft)) * 0.5;
  return a * (1 - f) + b * f;
}

function perlinNoise(x: number, y: number): number {
  const intX = Math.floor(x);
  const intY = Math.floor(y);
  const fracX = x - intX;
  const fracY = y - intY;

  const v1 = smoothNoise(intX, intY);
  const v2 = smoothNoise(intX + 1, intY);
  const v3 = smoothNoise(intX, intY + 1);
  const v4 = smoothNoise(intX + 1, intY + 1);

  const i1 = interpolate(v1, v2, fracX);
  const i2 = interpolate(v3, v4, fracX);

  return interpolate(i1, i2, fracY);
}

function generateTerrain(width: number, height: number) {
  const vertices: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const heightScale = 1.5;

  // Generate vertices
  for (let z = 0; z < height; z++) {
    for (let x = 0; x < width; x++) {
      const px = (x - width / 2) * 0.1;
      const pz = (z - height / 2) * 0.1;

      // Multi-octave noise
      let h = 0;
      h += perlinNoise(x * 0.05, z * 0.05) * 1.0;
      h += perlinNoise(x * 0.1, z * 0.1) * 0.5;
      h += perlinNoise(x * 0.2, z * 0.2) * 0.25;

      const py = h * heightScale;

      vertices.push(px, py, pz);

      // Color based on height
      let r, g, b;
      if (h < 0.3) {
        // Water - blue
        r = 0.2;
        g = 0.4;
        b = 0.8;
      } else if (h < 0.5) {
        // Beach - yellow
        r = 0.9;
        g = 0.9;
        b = 0.6;
      } else if (h < 0.7) {
        // Grass - green
        r = 0.2;
        g = 0.7;
        b = 0.3;
      } else {
        // Mountain - gray/white
        r = 0.7 + h * 0.3;
        g = 0.7 + h * 0.3;
        b = 0.7 + h * 0.3;
      }

      colors.push(r, g, b);
    }
  }

  // Generate indices
  for (let z = 0; z < height - 1; z++) {
    for (let x = 0; x < width - 1; x++) {
      const topLeft = z * width + x;
      const topRight = topLeft + 1;
      const bottomLeft = (z + 1) * width + x;
      const bottomRight = bottomLeft + 1;

      indices.push(topLeft, bottomLeft, topRight);
      indices.push(topRight, bottomLeft, bottomRight);
    }
  }

  return { vertices, colors, indices };
}
