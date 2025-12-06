/**
 * Module 01: Fundamentals
 * Core Three.js concepts - Scene, Renderer, First Cube, Animation Loop
 */

import type { Module } from '../types';

export const fundamentalsModule: Module = {
  id: 'fundamentals',
  number: 1,
  title: 'Fundamentals',
  description: 'Master the core building blocks of Three.js - Scene, Camera, Renderer, and your first 3D objects',
  icon: '🎯',
  color: '#FF4D00',
  lessons: [
    // Lesson 1.1: Your First Scene
    {
      meta: {
        id: 'first-scene',
        title: 'Your First Scene',
        description: 'Learn the essential trio: Scene, Camera, and Renderer',
        duration: 15,
        difficulty: 'beginner',
        prerequisites: [],
        objectives: [
          'Understand the Three.js rendering pipeline',
          'Create a Scene container',
          'Set up a PerspectiveCamera',
          'Configure a WebGLRenderer'
        ],
        tags: ['scene', 'camera', 'renderer', 'basics']
      },
      theory: {
        markdown: `
# Your First Three.js Scene

Three.js follows a simple pattern for rendering 3D graphics. Every Three.js application needs three essential components:

## The Scene

The **Scene** is a container that holds all your 3D objects, lights, and cameras. Think of it as a stage where your 3D world exists.

\`\`\`javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);
\`\`\`

## The Camera

The **Camera** defines what part of the scene is visible. The most common type is the PerspectiveCamera, which mimics how human eyes see the world.

\`\`\`javascript
const camera = new THREE.PerspectiveCamera(
  75,                           // Field of view (degrees)
  window.innerWidth / height,   // Aspect ratio
  0.1,                          // Near clipping plane
  1000                          // Far clipping plane
);
camera.position.z = 5;
\`\`\`

## The Renderer

The **Renderer** takes the scene and camera and draws the result to a canvas element.

\`\`\`javascript
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
\`\`\`

## Putting It Together

To display anything, call \`renderer.render(scene, camera)\`.
        `,
        concepts: ['Scene', 'PerspectiveCamera', 'WebGLRenderer', 'Canvas'],
        references: [
          { title: 'Three.js Scene', url: 'https://threejs.org/docs/#api/en/scenes/Scene' },
          { title: 'PerspectiveCamera', url: 'https://threejs.org/docs/#api/en/cameras/PerspectiveCamera' },
          { title: 'WebGLRenderer', url: 'https://threejs.org/docs/#api/en/renderers/WebGLRenderer' }
        ]
      },
      exercises: [
        {
          id: 'first-scene-setup',
          title: 'Set Up Your First Scene',
          description: 'Create a scene with a dark background, add a camera positioned at z=5, and create a renderer',
          starterCode: `// Create the scene
const scene = // TODO: Create a new Scene

// Set the background color to dark (#0a0a0a)
// TODO: Set scene.background

// Create a perspective camera
// FOV: 75, Near: 0.1, Far: 1000
const camera = // TODO: Create PerspectiveCamera

// Position the camera
// TODO: Set camera.position.z = 5

// Create the renderer with antialiasing
const renderer = // TODO: Create WebGLRenderer

// Set renderer size to fill the container
// TODO: Set size using container.clientWidth/Height

// Add canvas to container
container.appendChild(renderer.domElement);

// Render the scene
renderer.render(scene, camera);
`,
          solutionCode: `// Create the scene
const scene = new THREE.Scene();

// Set the background color to dark (#0a0a0a)
scene.background = new THREE.Color(0x0a0a0a);

// Create a perspective camera
// FOV: 75, Near: 0.1, Far: 1000
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);

// Position the camera
camera.position.z = 5;

// Create the renderer with antialiasing
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Set renderer size to fill the container
renderer.setSize(container.clientWidth, container.clientHeight);

// Add canvas to container
container.appendChild(renderer.domElement);

// Render the scene
renderer.render(scene, camera);
`,
          hints: [
            'Use new THREE.Scene() to create a scene',
            'THREE.Color accepts hex values like 0x0a0a0a',
            'PerspectiveCamera takes 4 arguments: fov, aspect, near, far',
            'renderer.setSize(width, height) sets the canvas dimensions'
          ],
          validation: {
            type: 'visual',
            checks: ['scene exists', 'camera positioned', 'renderer attached']
          }
        }
      ]
    },

    // Lesson 1.2: Your First Cube
    {
      meta: {
        id: 'first-cube',
        title: 'Your First 3D Cube',
        description: 'Create and display a 3D cube with geometry and material',
        duration: 20,
        difficulty: 'beginner',
        prerequisites: ['first-scene'],
        objectives: [
          'Understand the Mesh concept (Geometry + Material)',
          'Create a BoxGeometry',
          'Apply a MeshBasicMaterial',
          'Add objects to the scene'
        ],
        tags: ['mesh', 'geometry', 'material', 'cube']
      },
      theory: {
        markdown: `
# Creating 3D Objects: The Mesh

In Three.js, visible 3D objects are called **Meshes**. A Mesh is the combination of:

1. **Geometry** - The shape (vertices and faces)
2. **Material** - The appearance (color, texture, shininess)

## BoxGeometry

The simplest 3D shape - a cube or box.

\`\`\`javascript
const geometry = new THREE.BoxGeometry(1, 1, 1); // width, height, depth
\`\`\`

## MeshBasicMaterial

A simple material that doesn't react to light.

\`\`\`javascript
const material = new THREE.MeshBasicMaterial({ 
  color: 0xFF4D00,    // Orange color
  wireframe: false    // Set true to see the geometry structure
});
\`\`\`

## Creating the Mesh

Combine geometry and material into a mesh, then add to scene:

\`\`\`javascript
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
\`\`\`

## Positioning Objects

Every object has position, rotation, and scale properties:

\`\`\`javascript
cube.position.set(0, 0, 0);     // x, y, z
cube.rotation.set(0, 0, 0);     // radians
cube.scale.set(1, 1, 1);        // multiplier
\`\`\`
        `,
        concepts: ['Mesh', 'BoxGeometry', 'MeshBasicMaterial', 'Scene.add'],
        references: [
          { title: 'Mesh', url: 'https://threejs.org/docs/#api/en/objects/Mesh' },
          { title: 'BoxGeometry', url: 'https://threejs.org/docs/#api/en/geometries/BoxGeometry' },
          { title: 'MeshBasicMaterial', url: 'https://threejs.org/docs/#api/en/materials/MeshBasicMaterial' }
        ]
      },
      exercises: [
        {
          id: 'create-cube',
          title: 'Create a Colorful Cube',
          description: 'Create a cube with BoxGeometry and MeshBasicMaterial, then add it to the scene',
          starterCode: `// Scene and camera are already set up
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// TODO: Create a BoxGeometry (1x1x1)
const geometry = // Your code here

// TODO: Create a MeshBasicMaterial with color #FF4D00
const material = // Your code here

// TODO: Create a Mesh combining geometry and material
const cube = // Your code here

// TODO: Add the cube to the scene
// Your code here

// Rotate cube slightly to see 3D effect
cube.rotation.x = 0.5;
cube.rotation.y = 0.5;

// Render
renderer.render(scene, camera);
`,
          solutionCode: `// Scene and camera are already set up
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Create a BoxGeometry (1x1x1)
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Create a MeshBasicMaterial with color #FF4D00
const material = new THREE.MeshBasicMaterial({ color: 0xFF4D00 });

// Create a Mesh combining geometry and material
const cube = new THREE.Mesh(geometry, material);

// Add the cube to the scene
scene.add(cube);

// Rotate cube slightly to see 3D effect
cube.rotation.x = 0.5;
cube.rotation.y = 0.5;

// Render
renderer.render(scene, camera);
`,
          hints: [
            'BoxGeometry takes width, height, depth as arguments',
            'MeshBasicMaterial takes an object with color property',
            'new THREE.Mesh(geometry, material) creates the mesh',
            'scene.add(mesh) adds it to the scene'
          ],
          validation: {
            type: 'visual',
            checks: ['cube visible', 'correct color', 'rotated']
          }
        }
      ]
    },

    // Lesson 1.3: Animation Loop
    {
      meta: {
        id: 'animation-loop',
        title: 'The Animation Loop',
        description: 'Bring your scene to life with requestAnimationFrame',
        duration: 20,
        difficulty: 'beginner',
        prerequisites: ['first-cube'],
        objectives: [
          'Understand requestAnimationFrame',
          'Create a continuous animation loop',
          'Animate object properties over time',
          'Use THREE.Clock for time-based animation'
        ],
        tags: ['animation', 'requestAnimationFrame', 'clock', 'loop']
      },
      theory: {
        markdown: `
# Animating Your Scene

Static scenes are boring! Let's make things move with the **animation loop**.

## requestAnimationFrame

The browser's \`requestAnimationFrame\` function calls your code before each screen repaint (typically 60fps).

\`\`\`javascript
function animate() {
  requestAnimationFrame(animate);  // Schedule next frame
  
  // Update objects here
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  // Render the scene
  renderer.render(scene, camera);
}

animate(); // Start the loop
\`\`\`

## Time-Based Animation with Clock

Using a fixed increment like \`+= 0.01\` makes animation frame-rate dependent. Use THREE.Clock for consistent speed:

\`\`\`javascript
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const deltaTime = clock.getDelta();     // Time since last frame
  const elapsedTime = clock.getElapsedTime(); // Total time
  
  // Rotate 1 radian per second regardless of frame rate
  cube.rotation.y += deltaTime;
  
  // Or use sine for smooth oscillation
  cube.position.y = Math.sin(elapsedTime);
  
  renderer.render(scene, camera);
}
\`\`\`

## Animation Tips

- Always use time-based animation for consistency
- Keep calculations simple for better performance
- Use \`Math.sin()\` and \`Math.cos()\` for smooth cyclical motion
        `,
        concepts: ['requestAnimationFrame', 'THREE.Clock', 'deltaTime', 'elapsedTime'],
        references: [
          { title: 'Clock', url: 'https://threejs.org/docs/#api/en/core/Clock' },
          { title: 'Animation System', url: 'https://threejs.org/manual/#en/animation' }
        ]
      },
      exercises: [
        {
          id: 'spinning-cube',
          title: 'Create a Spinning Cube',
          description: 'Make the cube rotate continuously using requestAnimationFrame and THREE.Clock',
          starterCode: `// Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Create cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xFF4D00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// TODO: Create a Clock
const clock = // Your code here

// TODO: Create the animation function
function animate() {
  // TODO: Request next animation frame
  
  // TODO: Get elapsed time from clock
  const elapsedTime = // Your code here
  
  // TODO: Rotate the cube based on elapsed time
  // Rotate Y at 1 radian per second
  // Rotate X at 0.5 radians per second
  
  // Render the scene
  renderer.render(scene, camera);
}

// TODO: Start the animation loop
`,
          solutionCode: `// Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Create cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xFF4D00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create a Clock
const clock = new THREE.Clock();

// Create the animation function
function animate() {
  // Request next animation frame
  requestAnimationFrame(animate);
  
  // Get elapsed time from clock
  const elapsedTime = clock.getElapsedTime();
  
  // Rotate the cube based on elapsed time
  cube.rotation.y = elapsedTime;      // 1 radian per second
  cube.rotation.x = elapsedTime * 0.5; // 0.5 radians per second
  
  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
`,
          hints: [
            'new THREE.Clock() creates a clock that starts automatically',
            'clock.getElapsedTime() returns seconds since clock started',
            'Set rotation directly: cube.rotation.y = elapsedTime',
            'Call animate() at the end to start the loop'
          ],
          validation: {
            type: 'visual',
            checks: ['cube rotating', 'smooth animation']
          }
        }
      ]
    },

    // Lesson 1.4: Handling Resize
    {
      meta: {
        id: 'responsive-canvas',
        title: 'Responsive Canvas',
        description: 'Handle window resize and pixel ratio for crisp rendering',
        duration: 15,
        difficulty: 'beginner',
        prerequisites: ['animation-loop'],
        objectives: [
          'Handle window resize events',
          'Update camera aspect ratio',
          'Handle device pixel ratio',
          'Create reusable resize handler'
        ],
        tags: ['resize', 'responsive', 'pixel-ratio', 'aspect-ratio']
      },
      theory: {
        markdown: `
# Responsive Three.js Applications

Your 3D scene should adapt when the browser window resizes.

## The Resize Handler

When the window resizes, you need to update:
1. Camera aspect ratio
2. Renderer size

\`\`\`javascript
window.addEventListener('resize', () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
});
\`\`\`

## Pixel Ratio for Sharp Rendering

Modern displays have high pixel ratios (Retina = 2x, some phones = 3x). Set the pixel ratio for sharp rendering:

\`\`\`javascript
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
\`\`\`

We cap at 2 because higher values hurt performance without visible improvement.

## Complete Resize Pattern

\`\`\`javascript
function handleResize() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', handleResize);
\`\`\`
        `,
        concepts: ['resize event', 'aspect ratio', 'updateProjectionMatrix', 'devicePixelRatio'],
        references: [
          { title: 'Responsive Design', url: 'https://threejs.org/manual/#en/responsive' }
        ]
      },
      exercises: [
        {
          id: 'responsive-scene',
          title: 'Make Your Scene Responsive',
          description: 'Add resize handling to keep the scene looking correct at any window size',
          starterCode: `// Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// TODO: Set initial pixel ratio (capped at 2)


// Create cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xFF4D00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// TODO: Create resize handler function
function handleResize() {
  // Get new dimensions
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  // TODO: Update camera aspect ratio
  
  // TODO: Update camera projection matrix
  
  // TODO: Update renderer size
  
  // TODO: Update pixel ratio
}

// TODO: Add resize event listener


// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const elapsedTime = clock.getElapsedTime();
  cube.rotation.y = elapsedTime;
  cube.rotation.x = elapsedTime * 0.5;
  
  renderer.render(scene, camera);
}

animate();
`,
          solutionCode: `// Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Set initial pixel ratio (capped at 2)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xFF4D00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create resize handler function
function handleResize() {
  // Get new dimensions
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  // Update camera aspect ratio
  camera.aspect = width / height;
  
  // Update camera projection matrix
  camera.updateProjectionMatrix();
  
  // Update renderer size
  renderer.setSize(width, height);
  
  // Update pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// Add resize event listener
window.addEventListener('resize', handleResize);

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const elapsedTime = clock.getElapsedTime();
  cube.rotation.y = elapsedTime;
  cube.rotation.x = elapsedTime * 0.5;
  
  renderer.render(scene, camera);
}

animate();
`,
          hints: [
            'renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))',
            'camera.aspect = width / height',
            'Always call camera.updateProjectionMatrix() after changing aspect',
            'window.addEventListener("resize", handleResize)'
          ],
          validation: {
            type: 'visual',
            checks: ['resize handler works', 'no stretching']
          }
        }
      ]
    }
  ]
};
