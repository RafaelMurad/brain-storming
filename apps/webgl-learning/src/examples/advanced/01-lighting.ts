/**
 * Example: Phong Lighting Model
 * Learn realistic lighting with ambient, diffuse, and specular components.
 *
 * Concepts covered:
 * - Phong reflection model
 * - Normal vectors
 * - Ambient, diffuse, and specular lighting
 * - Light direction and position
 */

import { WebGLUtils } from '@/utils/webgl-utils';
import { Matrix4 } from '@/utils/matrix';
import type { Example } from '../basic/01-triangle';

export const LightingExample: Example = {
  animationId: null as number | null,

  init(canvas: HTMLCanvasElement) {
    const gl = WebGLUtils.initWebGL(canvas);
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec3 a_position;
      attribute vec3 a_normal;

      uniform mat4 u_modelMatrix;
      uniform mat4 u_viewMatrix;
      uniform mat4 u_projectionMatrix;
      uniform mat4 u_normalMatrix;

      varying vec3 v_normal;
      varying vec3 v_fragPos;

      void main() {
        vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);
        v_fragPos = worldPos.xyz;
        v_normal = mat3(u_normalMatrix) * a_normal;

        gl_Position = u_projectionMatrix * u_viewMatrix * worldPos;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;

      varying vec3 v_normal;
      varying vec3 v_fragPos;

      uniform vec3 u_lightPos;
      uniform vec3 u_viewPos;
      uniform vec3 u_lightColor;
      uniform vec3 u_objectColor;

      void main() {
        // Ambient
        float ambientStrength = 0.2;
        vec3 ambient = ambientStrength * u_lightColor;

        // Diffuse
        vec3 norm = normalize(v_normal);
        vec3 lightDir = normalize(u_lightPos - v_fragPos);
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = diff * u_lightColor;

        // Specular
        float specularStrength = 0.8;
        vec3 viewDir = normalize(u_viewPos - v_fragPos);
        vec3 reflectDir = reflect(-lightDir, norm);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
        vec3 specular = specularStrength * spec * u_lightColor;

        vec3 result = (ambient + diffuse + specular) * u_objectColor;
        gl_FragColor = vec4(result, 1.0);
      }
    `;

    const program = WebGLUtils.createProgramFromSource(
      gl,
      vertexShaderSource,
      fragmentShaderSource
    );

    if (!program) return;

    // Create sphere geometry (simplified)
    const { vertices, normals, indices } = createSphere(1.0, 30, 30);

    const vertexBuffer = WebGLUtils.createBuffer(gl, new Float32Array(vertices));
    const normalBuffer = WebGLUtils.createBuffer(gl, new Float32Array(normals));
    const indexBuffer = WebGLUtils.createBuffer(
      gl,
      new Uint16Array(indices),
      gl.ELEMENT_ARRAY_BUFFER
    );

    if (!vertexBuffer || !normalBuffer || !indexBuffer) return;

    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_position', 3);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_normal', 3);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    let angle = 0;

    const render = () => {
      angle += 0.01;

      WebGLUtils.clearCanvas(gl, 0.05, 0.05, 0.1, 1.0);

      const modelMatrix = new Matrix4();
      modelMatrix.rotateY(angle);
      modelMatrix.rotateX(angle * 0.5);

      const viewMatrix = new Matrix4();
      viewMatrix.lookAt(0, 0, 5, 0, 0, 0, 0, 1, 0);

      const projectionMatrix = new Matrix4();
      const aspect = canvas.width / canvas.height;
      projectionMatrix.perspective(Math.PI / 4, aspect, 0.1, 100);

      // Normal matrix (inverse transpose of model matrix)
      const normalMatrix = modelMatrix.clone();

      // Set uniforms
      WebGLUtils.setUniform(gl, program, 'u_modelMatrix', 'matrix4fv', modelMatrix.elements);
      WebGLUtils.setUniform(gl, program, 'u_viewMatrix', 'matrix4fv', viewMatrix.elements);
      WebGLUtils.setUniform(gl, program, 'u_projectionMatrix', 'matrix4fv', projectionMatrix.elements);
      WebGLUtils.setUniform(gl, program, 'u_normalMatrix', 'matrix4fv', normalMatrix.elements);

      // Light properties
      const lightPos = [Math.cos(angle * 2) * 3, 2, Math.sin(angle * 2) * 3];
      WebGLUtils.setUniform(gl, program, 'u_lightPos', '3f', lightPos);
      WebGLUtils.setUniform(gl, program, 'u_viewPos', '3f', [0, 0, 5]);
      WebGLUtils.setUniform(gl, program, 'u_lightColor', '3f', [1.0, 1.0, 1.0]);
      WebGLUtils.setUniform(gl, program, 'u_objectColor', '3f', [0.2, 0.6, 1.0]);

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
      <h3>Phong Lighting Model</h3>
      <p>Realistic lighting with three components:</p>
      <ul>
        <li><strong>Ambient:</strong> Base lighting that illuminates all surfaces equally</li>
        <li><strong>Diffuse:</strong> Directional light based on surface angle (Lambert's cosine law)</li>
        <li><strong>Specular:</strong> Bright highlights based on view angle (shininess)</li>
      </ul>
      <p><strong>Normal Vectors:</strong> Perpendicular vectors to surfaces that determine how light reflects</p>
      <p><strong>The Phong Formula:</strong></p>
      <code>Final Color = Ambient + Diffuse + Specular</code>
      <ul>
        <li>Diffuse = max(dot(normal, lightDir), 0)</li>
        <li>Specular = pow(max(dot(viewDir, reflectDir), 0), shininess)</li>
      </ul>
      <p>Watch how the light orbits the sphere and creates realistic highlights!</p>
    `;
  }
};

function createSphere(radius: number, segments: number, rings: number) {
  const vertices: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  for (let ring = 0; ring <= rings; ring++) {
    const phi = (ring * Math.PI) / rings;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    for (let segment = 0; segment <= segments; segment++) {
      const theta = (segment * 2 * Math.PI) / segments;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      const x = cosTheta * sinPhi;
      const y = cosPhi;
      const z = sinTheta * sinPhi;

      vertices.push(radius * x, radius * y, radius * z);
      normals.push(x, y, z);
    }
  }

  for (let ring = 0; ring < rings; ring++) {
    for (let segment = 0; segment < segments; segment++) {
      const first = ring * (segments + 1) + segment;
      const second = first + segments + 1;

      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  return { vertices, normals, indices };
}
