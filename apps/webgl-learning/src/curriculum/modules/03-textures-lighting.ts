/**
 * Module 03: Textures & Lighting
 * Loading textures and illuminating scenes
 */

import type { Module } from '../types';

export const texturesLightingModule: Module = {
  id: 'textures-lighting',
  number: 3,
  title: 'Textures & Lighting',
  description: 'Apply images to surfaces and illuminate your scenes with various light types',
  icon: '💡',
  color: '#FFD700',
  lessons: [
    // Lesson 3.1: Loading Textures
    {
      meta: {
        id: 'loading-textures',
        title: 'Loading Textures',
        description: 'Learn to load and apply textures using TextureLoader',
        duration: 25,
        difficulty: 'intermediate',
        prerequisites: ['material-types'],
        objectives: [
          'Use TextureLoader to load images',
          'Apply textures to materials',
          'Handle texture loading callbacks',
          'Understand UV mapping basics'
        ],
        tags: ['texture', 'TextureLoader', 'UV', 'mapping']
      },
      theory: {
        markdown: `
# Loading and Applying Textures

Textures add visual detail by wrapping images around geometry.

## The TextureLoader

\`\`\`javascript
const textureLoader = new THREE.TextureLoader();

// Simple loading
const texture = textureLoader.load('/textures/wood.jpg');

// With callbacks
const texture = textureLoader.load(
  '/textures/wood.jpg',
  (texture) => console.log('Loaded!'),
  (progress) => console.log('Loading...'),
  (error) => console.error('Error:', error)
);
\`\`\`

## Applying Textures to Materials

\`\`\`javascript
const material = new THREE.MeshStandardMaterial({
  map: texture,                    // Color/diffuse texture
  normalMap: normalTexture,        // Surface detail
  roughnessMap: roughnessTexture,  // Roughness variation
  aoMap: aoTexture                 // Ambient occlusion
});
\`\`\`

## UV Mapping

Textures are mapped using UV coordinates (0 to 1):
- (0, 0) = bottom-left of image
- (1, 1) = top-right of image

## Texture Repetition

\`\`\`javascript
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(4, 4);  // Tile 4x4 times
\`\`\`

## Using Data URLs for Simple Textures

For exercises, we can create textures from canvas:

\`\`\`javascript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
// Draw pattern...
const texture = new THREE.CanvasTexture(canvas);
\`\`\`
        `,
        concepts: ['TextureLoader', 'CanvasTexture', 'UV mapping', 'texture maps'],
        references: [
          { title: 'Textures', url: 'https://threejs.org/manual/#en/textures' },
          { title: 'TextureLoader', url: 'https://threejs.org/docs/#api/en/loaders/TextureLoader' }
        ]
      },
      exercises: [
        {
          id: 'canvas-texture',
          title: 'Create a Checkered Cube',
          description: 'Generate a checkerboard texture using canvas and apply it to a cube',
          starterCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// TODO: Create a canvas for the texture
const canvas = document.createElement('canvas');
canvas.width = 64;
canvas.height = 64;
const ctx = canvas.getContext('2d');

// TODO: Draw a checkerboard pattern
// Fill the canvas with 8x8 squares alternating between #FF4D00 and #0a0a0a
const squareSize = 8; // 64/8 = 8 squares
for (let y = 0; y < 8; y++) {
  for (let x = 0; x < 8; x++) {
    // TODO: Set fill color based on position (alternate colors)
    // ctx.fillStyle = ...
    
    // TODO: Draw the square
    // ctx.fillRect(...)
  }
}

// TODO: Create CanvasTexture from canvas
const texture = // Your code here

// Set texture filtering for pixelated look
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;

// TODO: Create MeshStandardMaterial with the texture as map
const material = // Your code here

// Create cube
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y = clock.getElapsedTime() * 0.5;
  cube.rotation.x = clock.getElapsedTime() * 0.3;
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

// Add light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// Create a canvas for the texture
const canvas = document.createElement('canvas');
canvas.width = 64;
canvas.height = 64;
const ctx = canvas.getContext('2d');

// Draw a checkerboard pattern
const squareSize = 8;
for (let y = 0; y < 8; y++) {
  for (let x = 0; x < 8; x++) {
    // Set fill color based on position
    ctx.fillStyle = (x + y) % 2 === 0 ? '#FF4D00' : '#0a0a0a';
    
    // Draw the square
    ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
  }
}

// Create CanvasTexture from canvas
const texture = new THREE.CanvasTexture(canvas);

// Set texture filtering for pixelated look
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;

// Create MeshStandardMaterial with the texture as map
const material = new THREE.MeshStandardMaterial({ map: texture });

// Create cube
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y = clock.getElapsedTime() * 0.5;
  cube.rotation.x = clock.getElapsedTime() * 0.3;
  renderer.render(scene, camera);
}

animate();
`,
          hints: [
            '(x + y) % 2 === 0 alternates the pattern',
            'ctx.fillRect(x * size, y * size, size, size)',
            'new THREE.CanvasTexture(canvas)',
            'MeshStandardMaterial({ map: texture })'
          ],
          validation: { type: 'visual', checks: ['checkerboard visible', 'cube rotating'] }
        }
      ]
    },

    // Lesson 3.2: Light Types
    {
      meta: {
        id: 'light-types',
        title: 'Types of Lights',
        description: 'Explore different light sources in Three.js',
        duration: 30,
        difficulty: 'intermediate',
        prerequisites: ['loading-textures'],
        objectives: [
          'Use AmbientLight for base illumination',
          'Add DirectionalLight for sun-like lighting',
          'Create PointLight for localized sources',
          'Implement SpotLight with cone focus'
        ],
        tags: ['lighting', 'ambient', 'directional', 'point', 'spot']
      },
      theory: {
        markdown: `
# Types of Lights in Three.js

Different lights create different moods and effects.

## AmbientLight

Illuminates all objects equally from all directions. Good for base illumination.

\`\`\`javascript
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
\`\`\`

## DirectionalLight

Parallel rays from a direction, like sunlight. Affects all objects equally.

\`\`\`javascript
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(5, 10, 7);
scene.add(directional);
\`\`\`

## PointLight

Radiates from a single point in all directions, like a light bulb.

\`\`\`javascript
const point = new THREE.PointLight(0xff0000, 1, 10);
// (color, intensity, distance)
point.position.set(0, 2, 0);
scene.add(point);
\`\`\`

## SpotLight

Cone of light from a point, like a flashlight.

\`\`\`javascript
const spot = new THREE.SpotLight(0xffffff, 1);
spot.position.set(0, 5, 0);
spot.angle = Math.PI / 6;        // Cone angle
spot.penumbra = 0.5;             // Edge softness (0-1)
spot.decay = 2;                  // Physical accuracy
scene.add(spot);
\`\`\`

## HemisphereLight

Sky + ground colors, simulating outdoor ambient light.

\`\`\`javascript
const hemisphere = new THREE.HemisphereLight(
  0x0088ff,  // Sky color
  0x444400,  // Ground color
  1          // Intensity
);
scene.add(hemisphere);
\`\`\`

## Light Helpers

Visualize light positions during development:

\`\`\`javascript
const helper = new THREE.DirectionalLightHelper(directional);
scene.add(helper);
\`\`\`
        `,
        concepts: ['AmbientLight', 'DirectionalLight', 'PointLight', 'SpotLight', 'HemisphereLight'],
        references: [
          { title: 'Lights', url: 'https://threejs.org/manual/#en/lights' },
          { title: 'DirectionalLight', url: 'https://threejs.org/docs/#api/en/lights/DirectionalLight' }
        ]
      },
      exercises: [
        {
          id: 'light-showcase',
          title: 'Light Showcase Scene',
          description: 'Create a scene demonstrating different light types with their helpers',
          starterCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Create a floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
scene.add(floor);

// Create spheres to show lighting
const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

for (let i = 0; i < 5; i++) {
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(-4 + i * 2, 0, 0);
  scene.add(sphere);
}

// TODO: Add AmbientLight (soft white, intensity 0.2)
const ambientLight = // Your code here
scene.add(ambientLight);

// TODO: Add DirectionalLight (white, intensity 0.5) positioned at (5, 5, 0)
const directionalLight = // Your code here
// Set position
scene.add(directionalLight);

// Add helper for directional light
const dirHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(dirHelper);

// TODO: Add PointLight (orange #FF4D00, intensity 1, distance 5) at (-3, 2, 2)
const pointLight = // Your code here
// Set position
scene.add(pointLight);

// Add helper for point light
const pointHelper = new THREE.PointLightHelper(pointLight, 0.3);
scene.add(pointHelper);

// TODO: Add SpotLight (blue #00D4FF, intensity 2) at (3, 4, 2)
// Set angle to PI/6 and penumbra to 0.5
const spotLight = // Your code here
// Set position and properties
// spotLight.target.position.set(3, 0, 0); // Aim at the right sphere
scene.add(spotLight);
scene.add(spotLight.target);

// Add helper for spot light
const spotHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotHelper);

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  
  // Animate point light position
  pointLight.position.x = -3 + Math.sin(time) * 2;
  pointLight.position.z = 2 + Math.cos(time) * 2;
  pointHelper.update();
  
  // Update spot helper
  spotHelper.update();
  
  renderer.render(scene, camera);
}

animate();
`,
          solutionCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Create a floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
scene.add(floor);

// Create spheres to show lighting
const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

for (let i = 0; i < 5; i++) {
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(-4 + i * 2, 0, 0);
  scene.add(sphere);
}

// Add AmbientLight (soft white, intensity 0.2)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Add DirectionalLight (white, intensity 0.5) positioned at (5, 5, 0)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 0);
scene.add(directionalLight);

// Add helper for directional light
const dirHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(dirHelper);

// Add PointLight (orange #FF4D00, intensity 1, distance 5) at (-3, 2, 2)
const pointLight = new THREE.PointLight(0xFF4D00, 1, 5);
pointLight.position.set(-3, 2, 2);
scene.add(pointLight);

// Add helper for point light
const pointHelper = new THREE.PointLightHelper(pointLight, 0.3);
scene.add(pointHelper);

// Add SpotLight (blue #00D4FF, intensity 2) at (3, 4, 2)
const spotLight = new THREE.SpotLight(0x00D4FF, 2);
spotLight.position.set(3, 4, 2);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.5;
spotLight.target.position.set(3, 0, 0);
scene.add(spotLight);
scene.add(spotLight.target);

// Add helper for spot light
const spotHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotHelper);

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  
  // Animate point light position
  pointLight.position.x = -3 + Math.sin(time) * 2;
  pointLight.position.z = 2 + Math.cos(time) * 2;
  pointHelper.update();
  
  // Update spot helper
  spotHelper.update();
  
  renderer.render(scene, camera);
}

animate();
`,
          hints: [
            'AmbientLight(color, intensity)',
            'DirectionalLight needs position.set(x, y, z)',
            'PointLight(color, intensity, distance)',
            'SpotLight has angle and penumbra properties'
          ],
          validation: { type: 'visual', checks: ['multiple lights visible', 'helpers showing', 'animated'] }
        }
      ]
    },

    // Lesson 3.3: Shadows
    {
      meta: {
        id: 'shadows',
        title: 'Working with Shadows',
        description: 'Enable and configure realistic shadows',
        duration: 30,
        difficulty: 'intermediate',
        prerequisites: ['light-types'],
        objectives: [
          'Enable shadow mapping on renderer',
          'Configure lights to cast shadows',
          'Set objects to cast and receive shadows',
          'Adjust shadow quality and softness'
        ],
        tags: ['shadows', 'shadowMap', 'castShadow', 'receiveShadow']
      },
      theory: {
        markdown: `
# Shadows in Three.js

Shadows add depth and realism but require explicit configuration.

## Enabling Shadows

Three steps are required:

### 1. Enable on Renderer
\`\`\`javascript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft edges
\`\`\`

### 2. Enable on Lights
\`\`\`javascript
directionalLight.castShadow = true;
\`\`\`

### 3. Enable on Objects
\`\`\`javascript
cube.castShadow = true;      // Object creates shadows
floor.receiveShadow = true;   // Surface shows shadows
\`\`\`

## Shadow Quality

Configure the shadow map camera for better quality:

\`\`\`javascript
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

// For directional light, set the frustum size
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
\`\`\`

## Shadow Types

\`\`\`javascript
THREE.BasicShadowMap      // Fast but jagged
THREE.PCFShadowMap        // Default, smoother
THREE.PCFSoftShadowMap    // Softest edges
THREE.VSMShadowMap        // Blurred shadows
\`\`\`

## Performance Tips

- Only enable shadows on lights that need them
- Use smaller shadow map sizes when possible
- Limit the shadow camera frustum
        `,
        concepts: ['shadowMap', 'castShadow', 'receiveShadow', 'PCFSoftShadowMap'],
        references: [
          { title: 'Shadows', url: 'https://threejs.org/manual/#en/shadows' },
          { title: 'DirectionalLightShadow', url: 'https://threejs.org/docs/#api/en/lights/shadows/DirectionalLightShadow' }
        ]
      },
      exercises: [
        {
          id: 'shadow-scene',
          title: 'Create a Shadow Scene',
          description: 'Set up a scene with proper shadow configuration',
          starterCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(3, 3, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// TODO: Enable shadow maps on renderer
// Use PCFSoftShadowMap for soft edges


// Create floor
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
// TODO: Enable floor to receive shadows

scene.add(floor);

// Create floating cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xFF4D00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 0.5;
// TODO: Enable cube to cast shadows

scene.add(cube);

// Create sphere
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x00D4FF });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-1.5, 0, 1);
// TODO: Enable sphere to cast shadows

scene.add(sphere);

// Ambient light for base illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// TODO: Create DirectionalLight for shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);

// TODO: Enable shadow casting on light


// TODO: Configure shadow quality (mapSize 1024x1024)


// TODO: Configure shadow camera bounds (left/right/top/bottom: -5/5/5/-5)


scene.add(directionalLight);

// Add shadow camera helper for debugging
const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(shadowHelper);

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  
  cube.rotation.y = time;
  cube.position.y = 0.5 + Math.sin(time * 2) * 0.3;
  
  sphere.position.y = Math.sin(time * 1.5) * 0.5;
  
  renderer.render(scene, camera);
}

animate();
`,
          solutionCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(3, 3, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Enable shadow maps on renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Create floor
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);

// Create floating cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xFF4D00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 0.5;
cube.castShadow = true;
scene.add(cube);

// Create sphere
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x00D4FF });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-1.5, 0, 1);
sphere.castShadow = true;
scene.add(sphere);

// Ambient light for base illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Create DirectionalLight for shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);

// Enable shadow casting on light
directionalLight.castShadow = true;

// Configure shadow quality
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

// Configure shadow camera bounds
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;

scene.add(directionalLight);

// Add shadow camera helper for debugging
const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(shadowHelper);

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  
  cube.rotation.y = time;
  cube.position.y = 0.5 + Math.sin(time * 2) * 0.3;
  
  sphere.position.y = Math.sin(time * 1.5) * 0.5;
  
  renderer.render(scene, camera);
}

animate();
`,
          hints: [
            'renderer.shadowMap.enabled = true',
            'renderer.shadowMap.type = THREE.PCFSoftShadowMap',
            'mesh.castShadow = true / mesh.receiveShadow = true',
            'light.shadow.mapSize.width = 1024'
          ],
          validation: { type: 'visual', checks: ['shadows visible', 'soft edges', 'animated objects'] }
        }
      ]
    }
  ]
};
