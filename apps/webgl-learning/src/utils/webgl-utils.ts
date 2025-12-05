/**
 * WebGL Utility Functions
 * These utilities handle common WebGL operations like context creation,
 * shader compilation, and program linking.
 */

export class WebGLUtils {
  /**
   * Initialize WebGL context with error handling
   */
  static initWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      console.error('WebGL not supported');
      alert('Your browser does not support WebGL');
      return null;
    }

    return gl as WebGLRenderingContext;
  }

  /**
   * Create and compile a shader
   */
  static createShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) {
      console.error('Failed to create shader');
      return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check compilation status
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      console.error('Shader compilation error:', info);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  /**
   * Create a program from vertex and fragment shaders
   */
  static createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram | null {
    const program = gl.createProgram();
    if (!program) {
      console.error('Failed to create program');
      return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Check linking status
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      console.error('Program linking error:', info);
      gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  /**
   * Create a program from shader source strings
   */
  static createProgramFromSource(
    gl: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string
  ): WebGLProgram | null {
    const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) {
      return null;
    }

    return this.createProgram(gl, vertexShader, fragmentShader);
  }

  /**
   * Create a buffer and bind data to it
   */
  static createBuffer(
    gl: WebGLRenderingContext,
    data: Float32Array | Uint16Array,
    target: number = WebGLRenderingContext.ARRAY_BUFFER,
    usage: number = WebGLRenderingContext.STATIC_DRAW
  ): WebGLBuffer | null {
    const buffer = gl.createBuffer();
    if (!buffer) {
      console.error('Failed to create buffer');
      return null;
    }

    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, usage);

    return buffer;
  }

  /**
   * Resize canvas to match display size
   */
  static resizeCanvas(canvas: HTMLCanvasElement): boolean {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      return true;
    }

    return false;
  }

  /**
   * Clear the canvas with a color
   */
  static clearCanvas(
    gl: WebGLRenderingContext,
    r: number = 0,
    g: number = 0,
    b: number = 0,
    a: number = 1
  ): void {
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  /**
   * Load a texture from an image URL
   */
  static async loadTexture(
    gl: WebGLRenderingContext,
    url: string
  ): Promise<WebGLTexture | null> {
    return new Promise((resolve) => {
      const texture = gl.createTexture();
      if (!texture) {
        console.error('Failed to create texture');
        resolve(null);
        return;
      }

      const image = new Image();
      image.crossOrigin = 'anonymous';

      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image
        );

        // Check if image is power of 2
        if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
          gl.generateMipmap(gl.TEXTURE_2D);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        resolve(texture);
      };

      image.onerror = () => {
        console.error('Failed to load texture:', url);
        resolve(null);
      };

      image.src = url;
    });
  }

  /**
   * Check if a number is a power of 2
   */
  static isPowerOf2(value: number): boolean {
    return (value & (value - 1)) === 0;
  }

  /**
   * Create a procedural texture (checkerboard pattern)
   */
  static createCheckerboardTexture(
    gl: WebGLRenderingContext,
    size: number = 8
  ): WebGLTexture | null {
    const texture = gl.createTexture();
    if (!texture) return null;

    const pixels = new Uint8Array(size * size * 4);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = (i * size + j) * 4;
        const color = (i + j) % 2 === 0 ? 255 : 64;
        pixels[index] = color;
        pixels[index + 1] = color;
        pixels[index + 2] = color;
        pixels[index + 3] = 255;
      }
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      size,
      size,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
  }

  /**
   * Set attribute pointer
   */
  static setAttribute(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    name: string,
    size: number,
    type: number = WebGLRenderingContext.FLOAT,
    normalize: boolean = false,
    stride: number = 0,
    offset: number = 0
  ): void {
    const location = gl.getAttribLocation(program, name);
    if (location === -1) {
      console.warn(`Attribute ${name} not found`);
      return;
    }

    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
  }

  /**
   * Set uniform value
   */
  static setUniform(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    name: string,
    type: string,
    value: any
  ): void {
    const location = gl.getUniformLocation(program, name);
    if (!location) {
      console.warn(`Uniform ${name} not found`);
      return;
    }

    switch (type) {
      case '1f':
        gl.uniform1f(location, value);
        break;
      case '2f':
        gl.uniform2f(location, value[0], value[1]);
        break;
      case '3f':
        gl.uniform3f(location, value[0], value[1], value[2]);
        break;
      case '4f':
        gl.uniform4f(location, value[0], value[1], value[2], value[3]);
        break;
      case '1i':
        gl.uniform1i(location, value);
        break;
      case 'matrix4fv':
        gl.uniformMatrix4fv(location, false, value);
        break;
      case 'matrix3fv':
        gl.uniformMatrix3fv(location, false, value);
        break;
      default:
        console.warn(`Unknown uniform type: ${type}`);
    }
  }
}
