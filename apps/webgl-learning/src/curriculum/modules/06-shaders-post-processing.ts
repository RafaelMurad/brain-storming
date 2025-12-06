/**
 * Module 06: Shaders & Post-Processing
 * Advanced rendering with custom shaders and effects
 */

import type { Module } from '../types';

export const shadersPostProcessingModule: Module = {
  id: 'shaders-post-processing',
  number: 6,
  title: 'Shaders & Post-Processing',
  description: 'Master custom shaders with GLSL and add cinematic post-processing effects',
  icon: '✨',
  color: '#8E44AD',
  lessons: [
    // Lesson 6.1: Introduction to Shaders
    {
      meta: {
        id: 'intro-shaders',
        title: 'Introduction to Shaders',
        description: 'Understand vertex and fragment shaders',
        duration: 35,
        difficulty: 'advanced',
        prerequisites: ['buffer-geometry'],
        objectives: [
          'Understand the graphics pipeline',
          'Write basic vertex shaders',
          'Write basic fragment shaders',
          'Use ShaderMaterial'
        ],
        tags: ['shaders', 'GLSL', 'vertex', 'fragment']
      },
      theory: {
        markdown: `
# Introduction to Shaders

Shaders are programs that run on the GPU for every vertex and pixel.

## The Graphics Pipeline

1. **Vertex Shader** - Runs for each vertex, determines position
2. **Rasterization** - Converts triangles to pixels
3. **Fragment Shader** - Runs for each pixel, determines color

## ShaderMaterial

\`\`\`javascript
const material = new THREE.ShaderMaterial({
  vertexShader: \`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  \`,
  fragmentShader: \`
    void main() {
      gl_FragColor = vec4(1.0, 0.3, 0.0, 1.0); // Orange color
    }
  \`
});
\`\`\`

## Built-in Uniforms & Attributes

Three.js provides these automatically:

**Uniforms (same for all vertices/pixels):**
- \`projectionMatrix\` - Camera projection
- \`modelViewMatrix\` - Combined model + view
- \`cameraPosition\` - Camera world position

**Attributes (per-vertex):**
- \`position\` - Vertex position
- \`normal\` - Vertex normal
- \`uv\` - Texture coordinates

## Custom Uniforms

\`\`\`javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0xFF4D00) }
  },
  vertexShader: \`
    uniform float uTime;
    void main() {
      vec3 pos = position;
      pos.y += sin(pos.x * 5.0 + uTime) * 0.2;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  \`,
  fragmentShader: \`
    uniform vec3 uColor;
    void main() {
      gl_FragColor = vec4(uColor, 1.0);
    }
  \`
});

// Update in animation loop
material.uniforms.uTime.value = clock.getElapsedTime();
\`\`\`

## Varyings - Passing Data

Pass data from vertex to fragment shader:

\`\`\`glsl
// Vertex shader
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = ...;
}

// Fragment shader
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(vUv, 0.0, 1.0); // UV as color
}
\`\`\`
        `,
        concepts: ['vertex shader', 'fragment shader', 'uniforms', 'varyings', 'GLSL'],
        references: [
          { title: 'ShaderMaterial', url: 'https://threejs.org/docs/#api/en/materials/ShaderMaterial' },
          { title: 'Shaders Manual', url: 'https://threejs.org/manual/#en/custom-shaderscustom-shaders' }
        ]
      },
      exercises: [
        {
          id: 'first-shader',
          title: 'Your First Shader',
          description: 'Create a gradient shader that changes color based on position',
          starterCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// TODO: Create vertex shader
// Pass the 'uv' attribute to the fragment shader using a varying
const vertexShader = \`
varying vec2 vUv;

void main() {
  // TODO: Pass uv to fragment shader
  
  
  // TODO: Calculate final position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
\`;

// TODO: Create fragment shader
// Create a gradient using the UV coordinates
const fragmentShader = \`
varying vec2 vUv;

void main() {
  // TODO: Create color based on UV coordinates
  // Use vUv.x for red, vUv.y for green, fixed blue
  vec3 color = vec3(0.0);
  
  
  gl_FragColor = vec4(color, 1.0);
}
\`;

// TODO: Create ShaderMaterial
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
});

// Create a plane to show the gradient
const geometry = new THREE.PlaneGeometry(4, 4, 1, 1);
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
`,
          solutionCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Vertex shader - pass UV to fragment
const vertexShader = \`
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
\`;

// Fragment shader - create gradient from UV
const fragmentShader = \`
varying vec2 vUv;

void main() {
  // Create color based on UV coordinates
  vec3 color = vec3(vUv.x, vUv.y, 0.5);
  
  gl_FragColor = vec4(color, 1.0);
}
\`;

// Create ShaderMaterial
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
});

// Create a plane to show the gradient
const geometry = new THREE.PlaneGeometry(4, 4, 1, 1);
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
`,
          hints: [
            'vUv = uv; in vertex shader to pass UV',
            'vec3 color = vec3(vUv.x, vUv.y, 0.5);',
            'vUv.x goes from 0 (left) to 1 (right)',
            'vUv.y goes from 0 (bottom) to 1 (top)'
          ],
          validation: { type: 'visual', checks: ['gradient visible', 'colors change across plane'] }
        }
      ]
    },

    // Lesson 6.2: Animated Shaders
    {
      meta: {
        id: 'animated-shaders',
        title: 'Animated Shaders',
        description: 'Create dynamic effects with time-based uniforms',
        duration: 35,
        difficulty: 'advanced',
        prerequisites: ['intro-shaders'],
        objectives: [
          'Use time uniform for animation',
          'Create wave effects in vertex shader',
          'Animate colors in fragment shader',
          'Combine multiple effects'
        ],
        tags: ['shaders', 'animation', 'uniforms', 'waves']
      },
      theory: {
        markdown: `
# Animated Shaders

Bring shaders to life with time-based uniforms.

## Time Uniform

\`\`\`javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 }
  },
  vertexShader: \`
    uniform float uTime;
    // ...
  \`,
  fragmentShader: \`
    uniform float uTime;
    // ...
  \`
});

// Animation loop
function animate() {
  material.uniforms.uTime.value = clock.getElapsedTime();
}
\`\`\`

## Wave Effects in Vertex Shader

\`\`\`glsl
uniform float uTime;

void main() {
  vec3 pos = position;
  
  // Simple wave
  pos.z = sin(pos.x * 5.0 + uTime) * 0.2;
  
  // Radial wave
  float dist = length(pos.xy);
  pos.z = sin(dist * 10.0 - uTime * 3.0) * 0.1;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
\`\`\`

## Color Animation in Fragment Shader

\`\`\`glsl
uniform float uTime;
varying vec2 vUv;

void main() {
  // Pulsing color
  float pulse = sin(uTime) * 0.5 + 0.5;
  vec3 color = vec3(1.0, 0.3, 0.0) * pulse;
  
  // Rainbow effect
  vec3 rainbow = vec3(
    sin(uTime + vUv.x * 6.28) * 0.5 + 0.5,
    sin(uTime + vUv.x * 6.28 + 2.09) * 0.5 + 0.5,
    sin(uTime + vUv.x * 6.28 + 4.18) * 0.5 + 0.5
  );
  
  gl_FragColor = vec4(color, 1.0);
}
\`\`\`

## Useful GLSL Functions

\`\`\`glsl
sin(x), cos(x)          // Oscillation (-1 to 1)
fract(x)                // Fractional part (0 to 1)
mod(x, y)               // Modulo
step(edge, x)           // 0 if x < edge, else 1
smoothstep(a, b, x)     // Smooth transition
mix(a, b, t)            // Linear interpolation
length(vec)             // Vector magnitude
normalize(vec)          // Unit vector
dot(a, b)               // Dot product
\`\`\`

## Common Patterns

\`\`\`glsl
// Stripes
float stripes = step(0.5, fract(vUv.x * 10.0));

// Checkerboard
float check = mod(floor(vUv.x * 10.0) + floor(vUv.y * 10.0), 2.0);

// Circles
float circle = 1.0 - step(0.3, length(vUv - 0.5));

// Noise-like pattern
float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
\`\`\`
        `,
        concepts: ['time uniform', 'wave animation', 'GLSL functions', 'procedural patterns'],
        references: [
          { title: 'GLSL Reference', url: 'https://www.khronos.org/opengl/wiki/Built-in_Variable_(GLSL)' },
          { title: 'Book of Shaders', url: 'https://thebookofshaders.com/' }
        ]
      },
      exercises: [
        {
          id: 'wave-plane',
          title: 'Animated Wave Plane',
          description: 'Create an ocean-like wave animation using vertex displacement',
          starterCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 2, 4);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// TODO: Define vertex shader with wave animation
const vertexShader = \`
uniform float uTime;
varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  
  vec3 pos = position;
  
  // TODO: Create wave effect
  // Combine two waves for more interesting pattern:
  // Wave 1: sin(pos.x * frequency + uTime * speed) * amplitude
  // Wave 2: sin(pos.y * frequency + uTime * speed) * amplitude
  float elevation = 0.0;
  
  // Your wave calculations here
  
  
  pos.z = elevation;
  vElevation = elevation;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
\`;

// TODO: Define fragment shader with color based on elevation
const fragmentShader = \`
uniform float uTime;
varying vec2 vUv;
varying float vElevation;

void main() {
  // TODO: Create color that changes based on wave height
  // Low points: deep blue (0.0, 0.2, 0.5)
  // High points: light cyan (0.0, 0.8, 1.0)
  
  vec3 lowColor = vec3(0.0, 0.2, 0.5);
  vec3 highColor = vec3(0.0, 0.8, 1.0);
  
  // TODO: Mix colors based on elevation
  // Normalize elevation to 0-1 range first
  float mixFactor = 0.5;
  
  
  vec3 color = mix(lowColor, highColor, mixFactor);
  
  gl_FragColor = vec4(color, 1.0);
}
\`;

// Create ShaderMaterial with time uniform
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide
});

// High-poly plane for smooth waves
const geometry = new THREE.PlaneGeometry(5, 5, 128, 128);
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -Math.PI * 0.4;
scene.add(plane);

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  // TODO: Update time uniform
  material.uniforms.uTime.value = clock.getElapsedTime();
  
  renderer.render(scene, camera);
}

animate();
`,
          solutionCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 2, 4);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Vertex shader with wave animation
const vertexShader = \`
uniform float uTime;
varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  
  vec3 pos = position;
  
  // Create wave effect with two waves
  float elevation = 0.0;
  elevation += sin(pos.x * 3.0 + uTime * 2.0) * 0.15;
  elevation += sin(pos.y * 2.5 + uTime * 1.5) * 0.1;
  elevation += sin(pos.x * 5.0 + pos.y * 4.0 + uTime * 3.0) * 0.05;
  
  pos.z = elevation;
  vElevation = elevation;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
\`;

// Fragment shader with color based on elevation
const fragmentShader = \`
uniform float uTime;
varying vec2 vUv;
varying float vElevation;

void main() {
  vec3 lowColor = vec3(0.0, 0.2, 0.5);
  vec3 highColor = vec3(0.0, 0.8, 1.0);
  
  // Normalize elevation to 0-1 range (from approximately -0.3 to 0.3)
  float mixFactor = (vElevation + 0.3) / 0.6;
  mixFactor = clamp(mixFactor, 0.0, 1.0);
  
  vec3 color = mix(lowColor, highColor, mixFactor);
  
  gl_FragColor = vec4(color, 1.0);
}
\`;

// Create ShaderMaterial with time uniform
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide
});

// High-poly plane for smooth waves
const geometry = new THREE.PlaneGeometry(5, 5, 128, 128);
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -Math.PI * 0.4;
scene.add(plane);

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  // Update time uniform
  material.uniforms.uTime.value = clock.getElapsedTime();
  
  renderer.render(scene, camera);
}

animate();
`,
          hints: [
            'sin(pos.x * 3.0 + uTime * 2.0) * 0.15 for first wave',
            'Add multiple sin waves for complex patterns',
            'mixFactor = (vElevation + offset) / range to normalize',
            'Use clamp(x, 0.0, 1.0) to keep values in range'
          ],
          validation: { type: 'visual', checks: ['waves animating', 'color changes with height'] }
        }
      ]
    },

    // Lesson 6.3: Post-Processing Effects
    {
      meta: {
        id: 'post-processing',
        title: 'Post-Processing Effects',
        description: 'Add cinematic effects with EffectComposer',
        duration: 40,
        difficulty: 'advanced',
        prerequisites: ['animated-shaders'],
        objectives: [
          'Set up EffectComposer',
          'Use built-in passes (Bloom, Vignette)',
          'Chain multiple effects',
          'Create custom shader passes'
        ],
        tags: ['post-processing', 'bloom', 'vignette', 'EffectComposer']
      },
      theory: {
        markdown: `
# Post-Processing Effects

Post-processing applies effects to the rendered image.

## EffectComposer Setup

\`\`\`javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Create composer
const composer = new EffectComposer(renderer);

// Add render pass (renders the scene)
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Add bloom effect
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,  // strength
  0.4,  // radius
  0.85  // threshold
);
composer.addPass(bloomPass);

// In animation loop, use composer instead of renderer
function animate() {
  composer.render();  // Not renderer.render()
}
\`\`\`

## Common Passes

### Bloom (Glow Effect)
\`\`\`javascript
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const bloom = new UnrealBloomPass(size, strength, radius, threshold);
\`\`\`

### Film Grain
\`\`\`javascript
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';

const film = new FilmPass(0.35, false); // intensity, grayscale
\`\`\`

### Glitch Effect
\`\`\`javascript
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';

const glitch = new GlitchPass();
glitch.goWild = false; // intense mode
\`\`\`

### Custom Shader Pass
\`\`\`javascript
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const vignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: 1.0 },
    darkness: { value: 1.0 }
  },
  vertexShader: \`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  \`,
  fragmentShader: \`
    uniform sampler2D tDiffuse;
    uniform float offset;
    uniform float darkness;
    varying vec2 vUv;
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float dist = distance(vUv, vec2(0.5));
      color.rgb *= smoothstep(0.8, offset * 0.799, dist * (darkness + offset));
      gl_FragColor = color;
    }
  \`
};

const vignettePass = new ShaderPass(vignetteShader);
composer.addPass(vignettePass);
\`\`\`

## Pass Order Matters

Effects are applied in order:
1. RenderPass (always first)
2. Effect passes (bloom, film, etc.)
3. Final pass should have \`renderToScreen = true\` (automatic for last pass)
        `,
        concepts: ['EffectComposer', 'RenderPass', 'UnrealBloomPass', 'ShaderPass'],
        references: [
          { title: 'Post-processing', url: 'https://threejs.org/manual/#en/post-processing' },
          { title: 'EffectComposer', url: 'https://threejs.org/docs/#examples/en/postprocessing/EffectComposer' }
        ]
      },
      exercises: [
        {
          id: 'bloom-scene',
          title: 'Glowing Objects with Bloom',
          description: 'Create a scene with glowing objects using UnrealBloomPass',
          starterCode: `// Note: Post-processing classes available as THREE.EffectComposer, 
// THREE.RenderPass, THREE.UnrealBloomPass, THREE.ShaderPass

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// TODO: Create EffectComposer
const composer = // Your code here

// TODO: Add RenderPass
const renderPass = // Your code here
composer.addPass(renderPass);

// TODO: Add UnrealBloomPass
// Resolution: container size, Strength: 1.5, Radius: 0.5, Threshold: 0.2
const bloomPass = // Your code here
composer.addPass(bloomPass);

// Create glowing objects
const geometry = new THREE.IcosahedronGeometry(0.5, 2);

// Emissive material glows with bloom
const createGlowingMesh = (color, x, y) => {
  const material = new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 2
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, 0);
  return mesh;
};

const meshes = [
  createGlowingMesh(0xFF4D00, -2, 1),
  createGlowingMesh(0x00D4FF, 0, 0),
  createGlowingMesh(0x00FF88, 2, -1),
  createGlowingMesh(0xFFD700, -1, -1.5),
  createGlowingMesh(0xFF00FF, 1, 1.5)
];

meshes.forEach(mesh => scene.add(mesh));

// Add dim ambient light (objects mostly glow from emissive)
scene.add(new THREE.AmbientLight(0xffffff, 0.1));

// Non-glowing center object for contrast
const centerGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
const centerMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x333333,
  metalness: 0.8,
  roughness: 0.2
});
const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
scene.add(centerMesh);

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  
  // Rotate objects
  meshes.forEach((mesh, i) => {
    mesh.rotation.x = time * (0.5 + i * 0.1);
    mesh.rotation.y = time * (0.3 + i * 0.1);
    mesh.position.y += Math.sin(time * 2 + i) * 0.002;
  });
  
  centerMesh.rotation.x = time * 0.5;
  centerMesh.rotation.y = time * 0.3;
  
  // TODO: Use composer.render() instead of renderer.render()
  renderer.render(scene, camera);
}

animate();
`,
          solutionCode: `// Post-processing classes available as THREE.EffectComposer, etc.

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Create EffectComposer
const composer = new THREE.EffectComposer(renderer);

// Add RenderPass
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

// Add UnrealBloomPass
const bloomPass = new THREE.UnrealBloomPass(
  new THREE.Vector2(container.clientWidth, container.clientHeight),
  1.5,  // strength
  0.5,  // radius
  0.2   // threshold
);
composer.addPass(bloomPass);

// Create glowing objects
const geometry = new THREE.IcosahedronGeometry(0.5, 2);

const createGlowingMesh = (color, x, y) => {
  const material = new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 2
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, 0);
  return mesh;
};

const meshes = [
  createGlowingMesh(0xFF4D00, -2, 1),
  createGlowingMesh(0x00D4FF, 0, 0),
  createGlowingMesh(0x00FF88, 2, -1),
  createGlowingMesh(0xFFD700, -1, -1.5),
  createGlowingMesh(0xFF00FF, 1, 1.5)
];

meshes.forEach(mesh => scene.add(mesh));

// Add dim ambient light
scene.add(new THREE.AmbientLight(0xffffff, 0.1));

// Non-glowing center object for contrast
const centerGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
const centerMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x333333,
  metalness: 0.8,
  roughness: 0.2
});
const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
scene.add(centerMesh);

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  
  // Rotate objects
  meshes.forEach((mesh, i) => {
    mesh.rotation.x = time * (0.5 + i * 0.1);
    mesh.rotation.y = time * (0.3 + i * 0.1);
    mesh.position.y += Math.sin(time * 2 + i) * 0.002;
  });
  
  centerMesh.rotation.x = time * 0.5;
  centerMesh.rotation.y = time * 0.3;
  
  // Use composer.render() for post-processing
  composer.render();
}

animate();
`,
          hints: [
            'new THREE.EffectComposer(renderer)',
            'new THREE.RenderPass(scene, camera)',
            'new THREE.UnrealBloomPass(size, strength, radius, threshold)',
            'composer.render() instead of renderer.render(scene, camera)'
          ],
          validation: { type: 'visual', checks: ['bloom glow visible', 'colored objects glowing', 'center object not glowing'] }
        }
      ]
    }
  ]
};
