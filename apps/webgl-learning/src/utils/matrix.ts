/**
 * Matrix and Vector Math Utilities
 * Simplified 3D math operations for WebGL transformations
 */

export class Matrix4 {
  elements: Float32Array;

  constructor() {
    this.elements = new Float32Array(16);
    this.identity();
  }

  /**
   * Set to identity matrix
   */
  identity(): Matrix4 {
    const e = this.elements;
    e[0] = 1; e[4] = 0; e[8] = 0;  e[12] = 0;
    e[1] = 0; e[5] = 1; e[9] = 0;  e[13] = 0;
    e[2] = 0; e[6] = 0; e[10] = 1; e[14] = 0;
    e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
    return this;
  }

  /**
   * Create orthographic projection matrix
   */
  ortho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4 {
    const e = this.elements;
    const rw = 1 / (right - left);
    const rh = 1 / (top - bottom);
    const rd = 1 / (far - near);

    e[0] = 2 * rw;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = 2 * rh;
    e[6] = 0;
    e[7] = 0;

    e[8] = 0;
    e[9] = 0;
    e[10] = -2 * rd;
    e[11] = 0;

    e[12] = -(right + left) * rw;
    e[13] = -(top + bottom) * rh;
    e[14] = -(far + near) * rd;
    e[15] = 1;

    return this;
  }

  /**
   * Create perspective projection matrix
   */
  perspective(
    fovy: number,
    aspect: number,
    near: number,
    far: number
  ): Matrix4 {
    const e = this.elements;
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);

    e[0] = f / aspect;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = f;
    e[6] = 0;
    e[7] = 0;

    e[8] = 0;
    e[9] = 0;
    e[10] = (far + near) * nf;
    e[11] = -1;

    e[12] = 0;
    e[13] = 0;
    e[14] = 2 * far * near * nf;
    e[15] = 0;

    return this;
  }

  /**
   * Create look-at view matrix
   */
  lookAt(
    eyeX: number, eyeY: number, eyeZ: number,
    centerX: number, centerY: number, centerZ: number,
    upX: number, upY: number, upZ: number
  ): Matrix4 {
    const e = this.elements;

    // Calculate forward vector (eye - center)
    let fx = eyeX - centerX;
    let fy = eyeY - centerY;
    let fz = eyeZ - centerZ;

    // Normalize forward
    const fLen = Math.sqrt(fx * fx + fy * fy + fz * fz);
    fx /= fLen;
    fy /= fLen;
    fz /= fLen;

    // Calculate right vector (up × forward)
    let sx = upY * fz - upZ * fy;
    let sy = upZ * fx - upX * fz;
    let sz = upX * fy - upY * fx;

    // Normalize right
    const sLen = Math.sqrt(sx * sx + sy * sy + sz * sz);
    sx /= sLen;
    sy /= sLen;
    sz /= sLen;

    // Calculate up vector (forward × right)
    const ux = fy * sz - fz * sy;
    const uy = fz * sx - fx * sz;
    const uz = fx * sy - fy * sx;

    // Set matrix
    e[0] = sx; e[4] = ux; e[8] = fx;  e[12] = 0;
    e[1] = sy; e[5] = uy; e[9] = fy;  e[13] = 0;
    e[2] = sz; e[6] = uz; e[10] = fz; e[14] = 0;
    e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;

    // Translate
    return this.translate(-eyeX, -eyeY, -eyeZ);
  }

  /**
   * Translate matrix
   */
  translate(x: number, y: number, z: number): Matrix4 {
    const e = this.elements;
    e[12] += e[0] * x + e[4] * y + e[8] * z;
    e[13] += e[1] * x + e[5] * y + e[9] * z;
    e[14] += e[2] * x + e[6] * y + e[10] * z;
    e[15] += e[3] * x + e[7] * y + e[11] * z;
    return this;
  }

  /**
   * Rotate matrix around X axis
   */
  rotateX(angle: number): Matrix4 {
    const e = this.elements;
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    const e4 = e[4], e5 = e[5], e6 = e[6], e7 = e[7];
    const e8 = e[8], e9 = e[9], e10 = e[10], e11 = e[11];

    e[4] = e4 * c + e8 * s;
    e[5] = e5 * c + e9 * s;
    e[6] = e6 * c + e10 * s;
    e[7] = e7 * c + e11 * s;

    e[8] = e8 * c - e4 * s;
    e[9] = e9 * c - e5 * s;
    e[10] = e10 * c - e6 * s;
    e[11] = e11 * c - e7 * s;

    return this;
  }

  /**
   * Rotate matrix around Y axis
   */
  rotateY(angle: number): Matrix4 {
    const e = this.elements;
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    const e0 = e[0], e1 = e[1], e2 = e[2], e3 = e[3];
    const e8 = e[8], e9 = e[9], e10 = e[10], e11 = e[11];

    e[0] = e0 * c - e8 * s;
    e[1] = e1 * c - e9 * s;
    e[2] = e2 * c - e10 * s;
    e[3] = e3 * c - e11 * s;

    e[8] = e0 * s + e8 * c;
    e[9] = e1 * s + e9 * c;
    e[10] = e2 * s + e10 * c;
    e[11] = e3 * s + e11 * c;

    return this;
  }

  /**
   * Rotate matrix around Z axis
   */
  rotateZ(angle: number): Matrix4 {
    const e = this.elements;
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    const e0 = e[0], e1 = e[1], e2 = e[2], e3 = e[3];
    const e4 = e[4], e5 = e[5], e6 = e[6], e7 = e[7];

    e[0] = e0 * c + e4 * s;
    e[1] = e1 * c + e5 * s;
    e[2] = e2 * c + e6 * s;
    e[3] = e3 * c + e7 * s;

    e[4] = e4 * c - e0 * s;
    e[5] = e5 * c - e1 * s;
    e[6] = e6 * c - e2 * s;
    e[7] = e7 * c - e3 * s;

    return this;
  }

  /**
   * Scale matrix
   */
  scale(x: number, y: number, z: number): Matrix4 {
    const e = this.elements;
    e[0] *= x; e[4] *= y; e[8] *= z;
    e[1] *= x; e[5] *= y; e[9] *= z;
    e[2] *= x; e[6] *= y; e[10] *= z;
    e[3] *= x; e[7] *= y; e[11] *= z;
    return this;
  }

  /**
   * Multiply with another matrix
   */
  multiply(other: Matrix4): Matrix4 {
    const a = this.elements;
    const b = other.elements;
    const result = new Float32Array(16);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[j * 4 + i] =
          a[i] * b[j * 4] +
          a[i + 4] * b[j * 4 + 1] +
          a[i + 8] * b[j * 4 + 2] +
          a[i + 12] * b[j * 4 + 3];
      }
    }

    this.elements = result;
    return this;
  }

  /**
   * Clone matrix
   */
  clone(): Matrix4 {
    const m = new Matrix4();
    m.elements.set(this.elements);
    return m;
  }
}

/**
 * Vector3 utility class
 */
export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Calculate length of vector
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * Normalize vector
   */
  normalize(): Vector3 {
    const len = this.length();
    if (len > 0) {
      this.x /= len;
      this.y /= len;
      this.z /= len;
    }
    return this;
  }

  /**
   * Dot product
   */
  dot(other: Vector3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  /**
   * Cross product
   */
  cross(other: Vector3): Vector3 {
    const x = this.y * other.z - this.z * other.y;
    const y = this.z * other.x - this.x * other.z;
    const z = this.x * other.y - this.y * other.x;
    return new Vector3(x, y, z);
  }
}

/**
 * Utility functions for common transformations
 */
export const MatrixUtils = {
  /**
   * Convert degrees to radians
   */
  degToRad(degrees: number): number {
    return degrees * Math.PI / 180;
  },

  /**
   * Convert radians to degrees
   */
  radToDeg(radians: number): number {
    return radians * 180 / Math.PI;
  }
};
