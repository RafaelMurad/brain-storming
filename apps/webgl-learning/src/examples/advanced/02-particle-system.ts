/**
 * Example: Particle System
 * Create dynamic particle effects with thousands of particles.
 *
 * Concepts covered:
 * - Particle systems and simulations
 * - Point sprites
 * - Blending modes
 * - Large-scale vertex data
 * - GPU-based particle updates
 */

import { WebGLUtils } from '@/utils/webgl-utils';
import type { Example } from '../basic/01-triangle';

export const ParticleSystemExample: Example = {
  animationId: null as number | null,

  init(canvas: HTMLCanvasElement) {
    const gl = WebGLUtils.initWebGL(canvas);
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec3 a_position;
      attribute vec3 a_velocity;
      attribute vec4 a_color;
      attribute float a_size;
      attribute float a_life;

      uniform float u_time;

      varying vec4 v_color;
      varying float v_life;

      void main() {
        vec3 pos = a_position + a_velocity * u_time;

        // Apply gravity
        pos.y -= 0.5 * 9.8 * u_time * u_time * 0.01;

        gl_Position = vec4(pos, 1.0);
        gl_PointSize = a_size * (1.0 - u_time / a_life);

        v_color = a_color;
        v_life = 1.0 - u_time / a_life;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;

      varying vec4 v_color;
      varying float v_life;

      void main() {
        // Create circular particles
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);

        if (dist > 0.5) {
          discard;
        }

        float alpha = (1.0 - dist * 2.0) * v_life;
        gl_FragColor = vec4(v_color.rgb, alpha * v_color.a);
      }
    `;

    const program = WebGLUtils.createProgramFromSource(
      gl,
      vertexShaderSource,
      fragmentShaderSource
    );

    if (!program) return;

    // Create particles
    const particleCount = 1000;
    const particles = {
      positions: new Float32Array(particleCount * 3),
      velocities: new Float32Array(particleCount * 3),
      colors: new Float32Array(particleCount * 4),
      sizes: new Float32Array(particleCount),
      lives: new Float32Array(particleCount)
    };

    // Initialize particles at origin with random velocities
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const i4 = i * 4;

      // Start at center
      particles.positions[i3] = 0;
      particles.positions[i3 + 1] = 0;
      particles.positions[i3 + 2] = 0;

      // Random velocity in all directions
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI;
      const speed = 0.5 + Math.random() * 1.5;

      particles.velocities[i3] = Math.cos(angle) * Math.cos(elevation) * speed;
      particles.velocities[i3 + 1] = Math.sin(elevation) * speed;
      particles.velocities[i3 + 2] = Math.sin(angle) * Math.cos(elevation) * speed;

      // Random colors (warm colors)
      const hue = Math.random() * 60 / 360; // 0-60 degrees (red to yellow)
      particles.colors[i4] = 1.0;
      particles.colors[i4 + 1] = hue * 2;
      particles.colors[i4 + 2] = 0.0;
      particles.colors[i4 + 3] = 0.8;

      // Random sizes and life
      particles.sizes[i] = 10 + Math.random() * 20;
      particles.lives[i] = 2 + Math.random() * 3;
    }

    // Create buffers
    const positionBuffer = WebGLUtils.createBuffer(gl, particles.positions);
    const velocityBuffer = WebGLUtils.createBuffer(gl, particles.velocities);
    const colorBuffer = WebGLUtils.createBuffer(gl, particles.colors);
    const sizeBuffer = WebGLUtils.createBuffer(gl, particles.sizes);
    const lifeBuffer = WebGLUtils.createBuffer(gl, particles.lives);

    if (!positionBuffer || !velocityBuffer || !colorBuffer || !sizeBuffer || !lifeBuffer) {
      return;
    }

    gl.useProgram(program);

    // Set up attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_position', 3);

    gl.bindBuffer(gl.ARRAY_BUFFER, velocityBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_velocity', 3);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_color', 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_size', 1);

    gl.bindBuffer(gl.ARRAY_BUFFER, lifeBuffer);
    WebGLUtils.setAttribute(gl, program, 'a_life', 1);

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.disable(gl.DEPTH_TEST);

    const startTime = Date.now();
    const maxLifetime = 5;

    const render = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      const time = currentTime % maxLifetime;

      WebGLUtils.clearCanvas(gl, 0.0, 0.0, 0.0, 1.0);

      WebGLUtils.setUniform(gl, program, 'u_time', '1f', time);

      gl.drawArrays(gl.POINTS, 0, particleCount);

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
      <h3>Particle System</h3>
      <p>A dynamic particle system demonstrating:</p>
      <ul>
        <li><strong>Point Sprites:</strong> Efficient rendering of many small particles</li>
        <li><strong>Additive Blending:</strong> Colors add together for glowing effects</li>
        <li><strong>GPU Simulation:</strong> Vertex shader calculates particle positions</li>
        <li><strong>Life Cycle:</strong> Particles fade out as they age</li>
      </ul>
      <p><strong>Performance:</strong> Rendering 1000 particles in real-time!</p>
      <p><strong>Physics:</strong></p>
      <ul>
        <li>Initial explosion with random velocities</li>
        <li>Gravity pulls particles down</li>
        <li>Size decreases with age</li>
        <li>Alpha fades based on lifetime</li>
      </ul>
      <p><strong>Blend Mode:</strong> <code>gl.blendFunc(SRC_ALPHA, ONE)</code> creates additive blending
      where overlapping particles create brighter colors.</p>
    `;
  }
};
