# 3D Math Concepts for WebGL

Understanding the mathematics behind 3D graphics is essential for mastering WebGL. This guide explains vectors, matrices, and transformations in a practical, visual way.

## Table of Contents

1. [Vectors](#vectors)
2. [Matrices](#matrices)
3. [Transformations](#transformations)
4. [Coordinate Systems](#coordinate-systems)
5. [Projection](#projection)
6. [Quaternions](#quaternions)

## Vectors

Vectors represent direction and magnitude. In graphics, they're used for positions, directions, normals, and more.

### Vector Basics

\`\`\`
2D Vector: (x, y)
3D Vector: (x, y, z)
4D Vector: (x, y, z, w)
\`\`\`

### Vector Operations

#### Addition

\`\`\`
a + b = (a.x + b.x, a.y + b.y, a.z + b.z)

Example:
(1, 2, 3) + (4, 5, 6) = (5, 7, 9)
\`\`\`

Geometrically: Place vectors tip-to-tail.

#### Subtraction

\`\`\`
a - b = (a.x - b.x, a.y - b.y, a.z - b.z)

Example:
(5, 7, 9) - (1, 2, 3) = (4, 5, 6)
\`\`\`

Geometrically: Vector from b to a.

#### Scalar Multiplication

\`\`\`
s * v = (s * v.x, s * v.y, s * v.z)

Example:
2 * (1, 2, 3) = (2, 4, 6)
\`\`\`

Scales vector length by s.

#### Length (Magnitude)

\`\`\`
|v| = sqrt(v.x² + v.y² + v.z²)

Example:
|(3, 4, 0)| = sqrt(9 + 16 + 0) = 5
\`\`\`

### Normalization

Convert to unit vector (length = 1):

\`\`\`
normalize(v) = v / |v|

Example:
normalize((3, 4, 0)) = (3/5, 4/5, 0) = (0.6, 0.8, 0)
\`\`\`

**Use case**: Direction vectors (lighting, camera orientation).

### Dot Product

Measures how aligned two vectors are:

\`\`\`
a · b = a.x * b.x + a.y * b.y + a.z * b.z

Also:
a · b = |a| * |b| * cos(θ)

where θ is angle between vectors
\`\`\`

**Properties:**
- a · b = 0: Perpendicular (90°)
- a · b > 0: Acute angle (<90°)
- a · b < 0: Obtuse angle (>90°)

**Use cases:**
- Calculate angle between vectors
- Determine if facing same/opposite direction
- Diffuse lighting calculations

### Cross Product

Produces vector perpendicular to both inputs:

\`\`\`
a × b = (
  a.y * b.z - a.z * b.y,
  a.z * b.x - a.x * b.z,
  a.x * b.y - a.y * b.x
)
\`\`\`

**Properties:**
- a × b = -b × a (anti-commutative)
- a × a = 0
- |a × b| = |a| * |b| * sin(θ)

**Use cases:**
- Calculate surface normals
- Find perpendicular vector
- Determine handedness of coordinate system

## Matrices

Matrices represent transformations (rotation, scale, translation) and coordinate system conversions.

### Matrix Basics

\`\`\`
4x4 Matrix:
[m0  m4  m8  m12]
[m1  m5  m9  m13]
[m2  m6  m10 m14]
[m3  m7  m11 m15]
\`\`\`

**Note**: WebGL uses column-major order!

### Identity Matrix

No transformation:

\`\`\`
[1  0  0  0]
[0  1  0  0]
[0  0  1  0]
[0  0  0  1]
\`\`\`

### Matrix Multiplication

Order matters! **A × B ≠ B × A**

\`\`\`
C = A × B

c[i][j] = sum(a[i][k] * b[k][j])
\`\`\`

**Transformation order**: Read right-to-left

\`\`\`
MVP = Projection × View × Model
\`\`\`

Applies: Model → View → Projection

### Matrix-Vector Multiplication

Transform a point:

\`\`\`
v' = M × v

Result: Transformed vector
\`\`\`

## Transformations

### Translation

Move object in space:

\`\`\`
Translation Matrix (tx, ty, tz):

[1  0  0  tx]
[0  1  0  ty]
[0  0  1  tz]
[0  0  0  1 ]
\`\`\`

**Code:**
\`\`\`typescript
matrix.translate(tx, ty, tz);
\`\`\`

### Scaling

Resize object:

\`\`\`
Scale Matrix (sx, sy, sz):

[sx 0  0  0]
[0  sy 0  0]
[0  0  sz 0]
[0  0  0  1]
\`\`\`

**Uniform scale**: sx = sy = sz (maintains proportions)

**Non-uniform scale**: Different values (stretches)

**Code:**
\`\`\`typescript
matrix.scale(sx, sy, sz);
\`\`\`

### Rotation

Rotate around axis:

#### Rotation around Z-axis

\`\`\`
[cos(θ)  -sin(θ)  0  0]
[sin(θ)   cos(θ)  0  0]
[0        0       1  0]
[0        0       0  1]
\`\`\`

#### Rotation around X-axis

\`\`\`
[1  0        0       0]
[0  cos(θ)  -sin(θ)  0]
[0  sin(θ)   cos(θ)  0]
[0  0        0       1]
\`\`\`

#### Rotation around Y-axis

\`\`\`
[cos(θ)   0  sin(θ)  0]
[0        1  0       0]
[-sin(θ)  0  cos(θ)  0]
[0        0  0       1]
\`\`\`

**Code:**
\`\`\`typescript
matrix.rotateX(angleInRadians);
matrix.rotateY(angleInRadians);
matrix.rotateZ(angleInRadians);
\`\`\`

### Transformation Order

Order dramatically affects results!

**Common order:** Scale → Rotate → Translate

\`\`\`typescript
const matrix = new Matrix4();
matrix.translate(x, y, z);  // 3rd: Move to position
matrix.rotateY(angle);      // 2nd: Rotate in place
matrix.scale(s, s, s);      // 1st: Scale

// Applied right-to-left: Scale → Rotate → Translate
\`\`\`

**Why this order?**
1. **Scale first**: Scales around origin
2. **Rotate second**: Rotates around origin
3. **Translate last**: Moves to final position

**Different order example:**
\`\`\`typescript
// Translate then rotate = orbit motion
matrix.rotateY(angle);
matrix.translate(radius, 0, 0);
\`\`\`

## Coordinate Systems

### Right-Hand vs Left-Hand

**Right-Hand Coordinate System** (WebGL/OpenGL):
\`\`\`
     +Y
      |
      |
      +-----> +X
     /
    /
  +Z
\`\`\`

**Right-hand rule**:
- Thumb = +X
- Index = +Y
- Middle = +Z

### Coordinate Space Pipeline

\`\`\`
Local/Object Space
      ↓ (Model Matrix)
World Space
      ↓ (View Matrix)
View/Camera Space
      ↓ (Projection Matrix)
Clip Space
      ↓ (Perspective Division)
NDC (Normalized Device Coordinates)
      ↓ (Viewport Transform)
Screen Space
\`\`\`

#### 1. Local Space

Object's own coordinate system. Origin at object center.

**Example**: Cube vertices from -0.5 to +0.5

#### 2. World Space

Global coordinate system. All objects positioned here.

**Transformation**: Model Matrix

\`\`\`
WorldPos = ModelMatrix × LocalPos
\`\`\`

#### 3. View Space

Camera's perspective. Camera at origin, looking down -Z.

**Transformation**: View Matrix (Camera Matrix)

\`\`\`
ViewPos = ViewMatrix × WorldPos
\`\`\`

#### 4. Clip Space

After perspective projection. Range: -w to +w

**Transformation**: Projection Matrix

\`\`\`
ClipPos = ProjectionMatrix × ViewPos
\`\`\`

#### 5. NDC (Normalized Device Coordinates)

After perspective division. Range: -1 to +1

\`\`\`
NDC = ClipPos / ClipPos.w
\`\`\`

## Projection

Convert 3D scene to 2D screen.

### Perspective Projection

Objects farther away appear smaller (realistic):

\`\`\`typescript
matrix.perspective(
  fov,      // Field of view (radians)
  aspect,   // width / height
  near,     // Near clipping plane
  far       // Far clipping plane
);
\`\`\`

**Frustum**: Truncated pyramid defining visible space.

\`\`\`
        far plane
       /--------\\
      /          \\
     /            \\
    /              \\
   /  near plane   \\
  +----------------+
  |                |
  |    camera      |
  +----------------+
\`\`\`

**Parameters:**
- **FOV**: Wider = more visible (60-90° typical)
- **Aspect**: Match canvas aspect ratio
- **Near**: Objects closer than this clipped (0.1 typical)
- **Far**: Objects farther than this clipped (100 typical)

### Orthographic Projection

Parallel projection, no perspective (useful for 2D/UI):

\`\`\`typescript
matrix.ortho(
  left, right,
  bottom, top,
  near, far
);
\`\`\`

**Use cases:**
- 2D games
- UI elements
- Technical drawings
- Shadow maps

## View Matrix (Look-At)

Position and orient camera:

\`\`\`typescript
matrix.lookAt(
  eyeX, eyeY, eyeZ,       // Camera position
  centerX, centerY, centerZ,  // Look-at point
  upX, upY, upZ           // Up direction
);
\`\`\`

**Example:**
\`\`\`typescript
// Camera at (0, 5, 10), looking at origin, Y-up
matrix.lookAt(
  0, 5, 10,  // Eye position
  0, 0, 0,   // Look at origin
  0, 1, 0    // Y-axis is up
);
\`\`\`

### How it works

1. **Forward vector**: direction from eye to center
2. **Right vector**: cross product of forward and up
3. **Up vector**: cross product of right and forward

Creates orthonormal basis (camera's coordinate system).

## Quaternions

Alternative to Euler angles for rotations. Avoids gimbal lock.

### Why Quaternions?

**Euler angles problems:**
- Gimbal lock (losing degree of freedom)
- Interpolation produces non-linear rotation
- Order-dependent

**Quaternion benefits:**
- No gimbal lock
- Smooth interpolation (slerp)
- More compact than matrices

### Quaternion Basics

\`\`\`
q = (x, y, z, w)

where:
- (x, y, z) = rotation axis
- w = rotation amount
\`\`\`

### Conversion

**Axis-angle to quaternion:**
\`\`\`typescript
const halfAngle = angle / 2;
const s = Math.sin(halfAngle);

const q = {
  x: axis.x * s,
  y: axis.y * s,
  z: axis.z * s,
  w: Math.cos(halfAngle)
};
\`\`\`

**Quaternion to matrix:**
Complex but standard algorithm. Most libraries provide this.

### Quaternion Operations

**Multiplication** (combine rotations):
\`\`\`
q3 = q1 * q2
\`\`\`

**Interpolation** (smooth rotation):
\`\`\`
slerp(q1, q2, t)  // t from 0 to 1
\`\`\`

## Practical Examples

### Orbiting Camera

\`\`\`typescript
const radius = 5;
const angle = time;

const eyeX = Math.cos(angle) * radius;
const eyeZ = Math.sin(angle) * radius;

viewMatrix.lookAt(
  eyeX, 2, eyeZ,  // Orbit around Y-axis
  0, 0, 0,        // Look at origin
  0, 1, 0         // Y-up
);
\`\`\`

### Billboard Effect

Make object always face camera:

\`\`\`typescript
// In vertex shader
vec3 cameraRight = vec3(u_viewMatrix[0][0], u_viewMatrix[1][0], u_viewMatrix[2][0]);
vec3 cameraUp = vec3(u_viewMatrix[0][1], u_viewMatrix[1][1], u_viewMatrix[2][1]);

vec3 position =
  center +
  cameraRight * vertex.x +
  cameraUp * vertex.y;
\`\`\`

### Screen to World Ray

\`\`\`typescript
// Mouse picking
const ndc = {
  x: (mouseX / width) * 2 - 1,
  y: -(mouseY / height) * 2 + 1
};

const clipCoords = [ndc.x, ndc.y, -1, 1];
const inverseVP = inverse(projection * view);
const worldCoords = inverseVP * clipCoords;

const rayDir = normalize(worldCoords.xyz / worldCoords.w - cameraPos);
\`\`\`

## Common Pitfalls

### Gimbal Lock

Using Euler angles with certain rotation orders can lose a degree of freedom.

**Solution**: Use quaternions for complex rotations.

### Matrix Order

\`\`\`typescript
// WRONG - Left-to-right application
wrong = model * view * projection;

// CORRECT - Right-to-left application
correct = projection * view * model;
\`\`\`

### Degrees vs Radians

WebGL uses **radians**, not degrees!

\`\`\`typescript
const radians = degrees * Math.PI / 180;
const degrees = radians * 180 / Math.PI;
\`\`\`

### Precision Issues

Use consistent units and reasonable ranges:

\`\`\`typescript
// BAD: Huge range
near = 0.0001, far = 1000000  // Precision issues

// GOOD: Reasonable range
near = 0.1, far = 100  // Better depth precision
\`\`\`

## Practice Exercises

1. **Vector Math**: Calculate angle between two vectors using dot product
2. **Transformations**: Create a spinning cube that orbits a point
3. **Camera**: Implement FPS-style camera controls
4. **Projection**: Switch between perspective and orthographic
5. **Picking**: Implement mouse-based object selection

## Resources

- **Linear Algebra**: Khan Academy's Linear Algebra course
- **3D Math Primer**: "3D Math Primer for Graphics and Game Development"
- **Interactive**: https://immersivemath.com/ila/index.html
- **Visualizations**: https://www.3blue1brown.com (Essence of Linear Algebra series)

---

**Master these concepts and WebGL will make sense! 🧮**

Next: Apply this knowledge in the [advanced examples](../README.md#advanced)!
