# WebGL Shader Programming Guide

Master GLSL (OpenGL Shading Language) and create stunning visual effects with shaders.

## Table of Contents

1. [What are Shaders?](#what-are-shaders)
2. [GLSL Basics](#glsl-basics)
3. [Data Types](#data-types)
4. [Variables and Qualifiers](#variables-and-qualifiers)
5. [Built-in Functions](#built-in-functions)
6. [Common Patterns](#common-patterns)
7. [Advanced Techniques](#advanced-techniques)

## What are Shaders?

Shaders are small programs that run on the GPU, processing vertices and pixels in parallel at incredible speeds.

### Two Types of Shaders

**Vertex Shader:**
- Runs once **per vertex**
- Transforms 3D positions to screen space
- Calculates per-vertex lighting
- Passes data to fragment shader

**Fragment Shader:**
- Runs once **per pixel**
- Determines final pixel color
- Applies textures and lighting
- Creates visual effects

### Shader Workflow

\`\`\`
Vertices → Vertex Shader → Rasterization → Fragment Shader → Pixels
\`\`\`

## GLSL Basics

### Syntax

GLSL is similar to C:

\`\`\`glsl
// Single-line comment

/* Multi-line
   comment */

void main() {
  // Code here
}
\`\`\`

### Precision

Always specify precision in fragment shaders:

\`\`\`glsl
precision mediump float;  // Medium precision (balanced)
precision highp float;    // High precision (slower)
precision lowp float;     // Low precision (faster)
\`\`\`

### Main Function

Every shader needs a `main()` function:

\`\`\`glsl
void main() {
  // Vertex shader must set gl_Position
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}
\`\`\`

\`\`\`glsl
void main() {
  // Fragment shader must set gl_FragColor
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red
}
\`\`\`

## Data Types

### Scalars

\`\`\`glsl
float myFloat = 1.0;
int myInt = 42;
bool myBool = true;
\`\`\`

**Important**: Always use decimal points for floats: `1.0` not `1`

### Vectors

\`\`\`glsl
vec2 v2 = vec2(1.0, 2.0);              // 2D vector
vec3 v3 = vec3(1.0, 2.0, 3.0);         // 3D vector
vec4 v4 = vec4(1.0, 2.0, 3.0, 4.0);    // 4D vector

// Constructors
vec3 rgb = vec3(1.0);                   // (1.0, 1.0, 1.0)
vec4 rgba = vec4(rgb, 0.5);             // (1.0, 1.0, 1.0, 0.5)
\`\`\`

### Swizzling

Access vector components in any order:

\`\`\`glsl
vec3 color = vec3(1.0, 0.5, 0.0);

float r = color.r;        // 1.0
float g = color.g;        // 0.5
float b = color.b;        // 0.0

// Alternative notation
float x = color.x;        // 1.0 (same as .r)
float y = color.y;        // 0.5 (same as .g)
float z = color.z;        // 0.0 (same as .b)

// Swizzling
vec2 rg = color.rg;       // vec2(1.0, 0.5)
vec3 bgr = color.bgr;     // vec3(0.0, 0.5, 1.0) - reversed!
vec4 rgba = color.rrgg;   // vec4(1.0, 1.0, 0.5, 0.5)
\`\`\`

### Matrices

\`\`\`glsl
mat2 m2 = mat2(1.0, 0.0, 0.0, 1.0);  // 2x2 matrix
mat3 m3 = mat3(1.0);                  // 3x3 identity matrix
mat4 m4 = mat4(1.0);                  // 4x4 identity matrix

// Matrix-vector multiplication
vec4 transformed = m4 * vec4(position, 1.0);
\`\`\`

### Samplers (Textures)

\`\`\`glsl
sampler2D texture;      // 2D texture
samplerCube cubemap;    // Cube map
\`\`\`

## Variables and Qualifiers

### Attributes (Vertex Shader Only)

Per-vertex input data:

\`\`\`glsl
attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texCoord;
attribute vec4 a_color;
\`\`\`

### Uniforms (Both Shaders)

Constant values for all vertices/fragments:

\`\`\`glsl
uniform mat4 u_modelViewProjection;
uniform float u_time;
uniform vec3 u_lightPosition;
uniform sampler2D u_texture;
\`\`\`

### Varyings

Pass data from vertex to fragment shader:

\`\`\`glsl
// Vertex shader
varying vec3 v_normal;
varying vec2 v_texCoord;

void main() {
  v_normal = a_normal;
  v_texCoord = a_texCoord;
  gl_Position = vec4(a_position, 1.0);
}
\`\`\`

\`\`\`glsl
// Fragment shader
varying vec3 v_normal;
varying vec2 v_texCoord;

void main() {
  // Use interpolated values
  vec3 normal = normalize(v_normal);
  gl_FragColor = texture2D(u_texture, v_texCoord);
}
\`\`\`

### Const

Compile-time constants:

\`\`\`glsl
const float PI = 3.14159265359;
const int MAX_LIGHTS = 4;
\`\`\`

## Built-in Functions

### Math Functions

\`\`\`glsl
// Trigonometry
float s = sin(angle);
float c = cos(angle);
float t = tan(angle);

// Power and exponential
float p = pow(base, exponent);
float e = exp(x);
float l = log(x);
float s = sqrt(x);

// Common math
float a = abs(x);
float s = sign(x);      // -1, 0, or 1
float f = floor(x);
float c = ceil(x);
float r = fract(x);     // Fractional part
float m = mod(x, y);    // x % y
\`\`\`

### Vector Functions

\`\`\`glsl
// Length and distance
float len = length(vec);
float dist = distance(vec1, vec2);

// Normalization
vec3 normalized = normalize(vec);

// Dot and cross product
float d = dot(vec1, vec2);
vec3 c = cross(vec1, vec2);

// Reflection and refraction
vec3 r = reflect(incident, normal);
vec3 r = refract(incident, normal, eta);
\`\`\`

### Interpolation and Clamping

\`\`\`glsl
// Clamp value between min and max
float c = clamp(value, 0.0, 1.0);

// Linear interpolation
float l = mix(a, b, t);        // a + (b - a) * t

// Smooth interpolation
float s = smoothstep(edge0, edge1, x);

// Step function
float s = step(edge, x);       // 0 if x < edge, else 1
\`\`\`

### Comparison

\`\`\`glsl
// Component-wise comparison
bvec3 lt = lessThan(vec1, vec2);
bvec3 gt = greaterThan(vec1, vec2);
bvec3 eq = equal(vec1, vec2);

// Any/all
bool any = any(bvec);
bool all = all(bvec);

// Min/Max
float m = min(a, b);
float m = max(a, b);
\`\`\`

### Texture Functions

\`\`\`glsl
// Sample 2D texture
vec4 color = texture2D(sampler, texCoord);

// Sample cube map
vec4 color = textureCube(sampler, direction);
\`\`\`

## Common Patterns

### Basic Vertex Shader

\`\`\`glsl
attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_texCoord;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

varying vec3 v_worldPos;
varying vec3 v_normal;
varying vec2 v_texCoord;

void main() {
  vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);
  v_worldPos = worldPos.xyz;
  v_normal = mat3(u_modelMatrix) * a_normal;
  v_texCoord = a_texCoord;

  gl_Position = u_projectionMatrix * u_viewMatrix * worldPos;
}
\`\`\`

### Basic Fragment Shader

\`\`\`glsl
precision mediump float;

varying vec3 v_worldPos;
varying vec3 v_normal;
varying vec2 v_texCoord;

uniform vec3 u_lightPos;
uniform vec3 u_viewPos;
uniform sampler2D u_texture;

void main() {
  // Normalize
  vec3 normal = normalize(v_normal);
  vec3 lightDir = normalize(u_lightPos - v_worldPos);
  vec3 viewDir = normalize(u_viewPos - v_worldPos);

  // Lighting
  float diffuse = max(dot(normal, lightDir), 0.0);

  // Texture
  vec4 texColor = texture2D(u_texture, v_texCoord);

  // Final color
  gl_FragColor = vec4(texColor.rgb * diffuse, texColor.a);
}
\`\`\`

### Animated Effects

\`\`\`glsl
uniform float u_time;

void main() {
  // Pulsating effect
  float pulse = sin(u_time * 2.0) * 0.5 + 0.5;

  // Wave effect
  float wave = sin(position.x * 10.0 + u_time) * 0.1;

  // Rotation
  float angle = u_time;
  mat2 rotation = mat2(
    cos(angle), -sin(angle),
    sin(angle), cos(angle)
  );
  vec2 rotated = rotation * position.xy;
}
\`\`\`

### Color Manipulation

\`\`\`glsl
// Grayscale
float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));

// Invert
vec3 inverted = 1.0 - color.rgb;

// Sepia
vec3 sepia = vec3(
  dot(color.rgb, vec3(0.393, 0.769, 0.189)),
  dot(color.rgb, vec3(0.349, 0.686, 0.168)),
  dot(color.rgb, vec3(0.272, 0.534, 0.131))
);

// Brightness/Contrast
vec3 adjusted = (color.rgb - 0.5) * contrast + 0.5 + brightness;
\`\`\`

## Advanced Techniques

### Normal Mapping

\`\`\`glsl
// Fragment shader
varying vec3 v_tangent;
varying vec3 v_bitangent;
varying vec3 v_normal;
varying vec2 v_texCoord;

uniform sampler2D u_normalMap;

void main() {
  // Sample normal map
  vec3 tangentNormal = texture2D(u_normalMap, v_texCoord).xyz * 2.0 - 1.0;

  // TBN matrix
  mat3 TBN = mat3(v_tangent, v_bitangent, v_normal);

  // Transform to world space
  vec3 worldNormal = normalize(TBN * tangentNormal);

  // Use worldNormal for lighting...
}
\`\`\`

### Procedural Noise

\`\`\`glsl
float random(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
\`\`\`

### Rim Lighting

\`\`\`glsl
vec3 normal = normalize(v_normal);
vec3 viewDir = normalize(u_viewPos - v_worldPos);

float rim = 1.0 - max(dot(normal, viewDir), 0.0);
rim = pow(rim, rimPower);

vec3 rimColor = vec3(0.0, 0.5, 1.0) * rim;
\`\`\`

### Screen-Space Effects

\`\`\`glsl
// Vignette
vec2 uv = gl_FragCoord.xy / u_resolution;
float vignette = smoothstep(0.8, 0.2, length(uv - 0.5));
color.rgb *= vignette;

// Chromatic aberration
float offset = 0.01;
float r = texture2D(u_texture, uv + vec2(offset, 0.0)).r;
float g = texture2D(u_texture, uv).g;
float b = texture2D(u_texture, uv - vec2(offset, 0.0)).b;
color = vec4(r, g, b, 1.0);
\`\`\`

### Discard for Transparency

\`\`\`glsl
// Fragment shader
varying vec2 v_texCoord;
uniform sampler2D u_texture;

void main() {
  vec4 texColor = texture2D(u_texture, v_texCoord);

  // Discard transparent pixels
  if (texColor.a < 0.1) {
    discard;
  }

  gl_FragColor = texColor;
}
\`\`\`

## Performance Tips

### Do's

✅ **Use built-in functions** - They're optimized for GPU
✅ **Minimize varying variables** - Data transfer between shaders has cost
✅ **Compute in vertex shader when possible** - Runs less often than fragment shader
✅ **Use lower precision** - `mediump` is usually sufficient
✅ **Precalculate on CPU** - Send results as uniforms

### Don'ts

❌ **Avoid branches** - `if` statements can hurt performance
❌ **Don't use loops with variable count** - Use fixed-size loops
❌ **Avoid dependent texture reads** - Reading texture based on another texture
❌ **Don't normalize unnecessarily** - Only normalize when needed

### Optimization Examples

**Bad:**
\`\`\`glsl
for (int i = 0; i < n; i++) {  // Variable count
  // ...
}
\`\`\`

**Good:**
\`\`\`glsl
const int MAX = 10;
for (int i = 0; i < MAX; i++) {  // Fixed count
  if (i >= n) break;
  // ...
}
\`\`\`

## Debugging Shaders

### Visualize Values

\`\`\`glsl
// Visualize normals
gl_FragColor = vec4(v_normal * 0.5 + 0.5, 1.0);

// Visualize UVs
gl_FragColor = vec4(v_texCoord, 0.0, 1.0);

// Visualize single channel
gl_FragColor = vec4(vec3(value), 1.0);
\`\`\`

### Step-by-Step Debugging

1. Start with solid color
2. Add one feature at a time
3. Visualize intermediate values
4. Check for NaN: `any(isnan(value))`

## Next Steps

- Complete examples 05-10 to see these techniques in action
- Experiment with shader modifications
- Read [MATH_CONCEPTS.md](MATH_CONCEPTS.md) for the math behind transformations
- Check [RESOURCES.md](RESOURCES.md) for shader playgrounds and tools

## Shader Resources

- [The Book of Shaders](https://thebookofshaders.com) - Interactive shader tutorial
- [Shadertoy](https://www.shadertoy.com) - Share and explore shaders
- [GLSL Sandbox](http://glslsandbox.com) - Live shader editor

---

**Happy Shader Programming! 🎨**
