# Getting Started with WebGL

Welcome to your WebGL learning journey! This guide will help you understand WebGL fundamentals and get the most out of this learning project.

## Table of Contents

1. [What is WebGL?](#what-is-webgl)
2. [WebGL Rendering Pipeline](#webgl-rendering-pipeline)
3. [Your First Triangle](#your-first-triangle)
4. [Understanding Shaders](#understanding-shaders)
5. [Coordinate Systems](#coordinate-systems)
6. [Buffers and Attributes](#buffers-and-attributes)
7. [Next Steps](#next-steps)

## What is WebGL?

**WebGL** (Web Graphics Library) is a JavaScript API for rendering interactive 2D and 3D graphics within any compatible web browser without plugins. It's based on OpenGL ES 2.0.

### Key Concepts

- **GPU Programming**: WebGL code runs on your graphics card, enabling high-performance rendering
- **Shader-Based**: You write small programs (shaders) that run on the GPU
- **Low-Level API**: WebGL gives you direct control but requires more code than higher-level libraries

### Why Learn WebGL?

- **Foundation**: Understanding WebGL helps you learn Three.js, Babylon.js, and other libraries
- **Performance**: Direct GPU access for maximum performance
- **Control**: Full control over the rendering pipeline
- **Career**: In-demand skill for game dev, data visualization, and creative coding

## WebGL Rendering Pipeline

Understanding the pipeline is crucial. Here's what happens when you draw something:

\`\`\`
JavaScript Data → Vertex Shader → Rasterization → Fragment Shader → Screen
\`\`\`

### 1. JavaScript Setup

- Create buffers with vertex data
- Compile shaders
- Set up attributes and uniforms

### 2. Vertex Shader

- Processes **each vertex** individually
- Calculates final position (`gl_Position`)
- Passes data to fragment shader via `varying` variables

### 3. Rasterization

- GPU automatically converts vertices to pixels
- Interpolates varying variables

### 4. Fragment Shader

- Processes **each pixel** individually
- Determines final color (`gl_FragColor`)

### 5. Framebuffer

- Final pixels written to screen

## Your First Triangle

Let's break down the simplest WebGL example:

### Step 1: Get WebGL Context

\`\`\`typescript
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl');
\`\`\`

The context (`gl`) is your interface to all WebGL functions.

### Step 2: Create Shaders

**Vertex Shader** (positions vertices):

\`\`\`glsl
attribute vec4 a_position;

void main() {
  gl_Position = a_position;
}
\`\`\`

**Fragment Shader** (colors pixels):

\`\`\`glsl
precision mediump float;

void main() {
  gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0); // Orange
}
\`\`\`

### Step 3: Create Vertex Data

\`\`\`typescript
const vertices = new Float32Array([
   0.0,  0.5,  // Top
  -0.5, -0.5,  // Bottom left
   0.5, -0.5   // Bottom right
]);
\`\`\`

### Step 4: Create Buffer

\`\`\`typescript
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
\`\`\`

### Step 5: Link Buffer to Shader

\`\`\`typescript
const location = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(location);
gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
\`\`\`

### Step 6: Draw

\`\`\`typescript
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);
\`\`\`

## Understanding Shaders

Shaders are written in **GLSL** (OpenGL Shading Language), a C-like language.

### Vertex Shader Variables

- **attribute**: Per-vertex input data (position, color, texture coords)
- **uniform**: Constant data for all vertices (transformation matrices, time)
- **varying**: Output to fragment shader (interpolated)

\`\`\`glsl
attribute vec3 a_position;   // Different for each vertex
uniform mat4 u_matrix;        // Same for all vertices
varying vec3 v_color;         // Output to fragment shader

void main() {
  gl_Position = u_matrix * vec4(a_position, 1.0);
  v_color = a_position;       // Pass to fragment shader
}
\`\`\`

### Fragment Shader Variables

- **varying**: Input from vertex shader (interpolated)
- **uniform**: Constant data (textures, colors, time)

\`\`\`glsl
precision mediump float;

varying vec3 v_color;         // Input from vertex shader
uniform sampler2D u_texture;  // Texture data

void main() {
  gl_FragColor = vec4(v_color, 1.0);
}
\`\`\`

### Built-in Variables

**Vertex Shader:**
- `gl_Position`: Output vertex position (required)

**Fragment Shader:**
- `gl_FragColor`: Output pixel color (required)
- `gl_PointCoord`: Texture coordinate for point sprites
- `gl_FragCoord`: Current pixel coordinates

## Coordinate Systems

### Clip Space

WebGL uses **clip space coordinates** ranging from -1 to 1:

\`\`\`
        (0, 1)
          |
(-1, 0) --+-- (1, 0)
          |
        (0, -1)
\`\`\`

- Center of canvas: (0, 0)
- Top edge: y = 1
- Bottom edge: y = -1
- Left edge: x = -1
- Right edge: x = 1

### Pixel Space to Clip Space

Convert pixel coordinates to clip space:

\`\`\`glsl
vec2 clipSpace = (pixelCoords / canvasSize) * 2.0 - 1.0;
\`\`\`

### 3D Coordinates

For 3D, we use transformation matrices to convert:

\`\`\`
Local Space → World Space → View Space → Clip Space
\`\`\`

## Buffers and Attributes

### What are Buffers?

Buffers store vertex data in GPU memory. Common buffer types:

- **ARRAY_BUFFER**: Vertex data (positions, colors, normals)
- **ELEMENT_ARRAY_BUFFER**: Indices for indexed drawing

### Creating Buffers

\`\`\`typescript
// 1. Create buffer
const buffer = gl.createBuffer();

// 2. Bind buffer (make it current)
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

// 3. Upload data
const data = new Float32Array([...]);
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
\`\`\`

### Attributes

Attributes connect buffer data to shader variables:

\`\`\`typescript
// Get attribute location
const loc = gl.getAttribLocation(program, 'a_position');

// Enable attribute
gl.enableVertexAttribArray(loc);

// Describe data layout
gl.vertexAttribPointer(
  loc,        // attribute location
  2,          // components per vertex (x, y)
  gl.FLOAT,   // data type
  false,      // normalize?
  0,          // stride (0 = tightly packed)
  0           // offset (start at beginning)
);
\`\`\`

### Multiple Attributes

You can have multiple attributes per vertex:

\`\`\`typescript
// Position buffer
const posBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

// Color buffer
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
\`\`\`

## Common Patterns

### Animation Loop

\`\`\`typescript
let time = 0;

function render() {
  time += 0.016; // ~60 FPS

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Update uniforms
  gl.uniform1f(timeLocation, time);

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

  requestAnimationFrame(render);
}

render();
\`\`\`

### Drawing Multiple Objects

\`\`\`typescript
// Object 1
gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLES, 0, 3);

// Object 2
gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLES, 0, 6);
\`\`\`

### Using Uniforms

\`\`\`typescript
// Get location once
const colorLoc = gl.getUniformLocation(program, 'u_color');

// Set value (can change every frame)
gl.uniform4f(colorLoc, 1.0, 0.0, 0.0, 1.0); // Red
\`\`\`

## Debugging Tips

### Check for Errors

\`\`\`typescript
const error = gl.getError();
if (error !== gl.NO_ERROR) {
  console.error('WebGL error:', error);
}
\`\`\`

### Shader Compilation

\`\`\`typescript
if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
  console.error('Shader error:', gl.getShaderInfoLog(shader));
}
\`\`\`

### Common Issues

1. **Black screen**: Check shader compilation, buffer data, attribute setup
2. **Nothing visible**: Check clip space coordinates (-1 to 1 range)
3. **Stretched shapes**: Set canvas width/height to match display size
4. **WebGL not supported**: Check browser compatibility

## Next Steps

Now that you understand the basics:

1. **Complete the basic examples** - Start with example 01-04
2. **Read [SHADER_GUIDE.md](SHADER_GUIDE.md)** - Deep dive into shader programming
3. **Learn 3D math** - Check [MATH_CONCEPTS.md](MATH_CONCEPTS.md)
4. **Experiment!** - Modify examples and create your own

### Recommended Learning Order

1. ✅ Read this guide
2. 🔨 Complete basic examples (01-04)
3. 📖 Read Shader Guide
4. 🔨 Complete intermediate examples (05-07)
5. 📖 Read Math Concepts
6. 🔨 Complete advanced examples (08-10)
7. 🎨 Build your own project!

## Resources

- [WebGL Fundamentals](https://webglfundamentals.org) - Excellent tutorials
- [MDN WebGL Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [Khronos WebGL Specification](https://www.khronos.org/webgl/)

---

**Ready to start?** Open the first example: **01. Simple Triangle**

Need help? Check the [RESOURCES.md](RESOURCES.md) for more learning materials!
