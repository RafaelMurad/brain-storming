/**
 * Module 04: Cameras & Controls
 * Understanding cameras, viewports, and user interaction
 */

import type { Module } from '../types';

export const camerasControlsModule: Module = {
  id: 'cameras-controls',
  number: 4,
  title: 'Cameras & Controls',
  description: 'Master camera types, OrbitControls, and user interaction with Raycaster',
  icon: '🎥',
  color: '#9B59B6',
  lessons: [
    // Lesson 4.1: Camera Types
    {
      meta: {
        id: 'camera-types',
        title: 'Camera Types',
        description: 'Understand Perspective vs Orthographic cameras',
        duration: 20,
        difficulty: 'intermediate',
        prerequisites: ['responsive-canvas'],
        objectives: [
          'Compare Perspective and Orthographic cameras',
          'Configure camera properties',
          'Position and orient cameras',
          'Use lookAt for camera targeting'
        ],
        tags: ['camera', 'perspective', 'orthographic', 'lookAt']
      },
      theory: {
        markdown: `
# Camera Types in Three.js

Cameras define what part of the scene is visible and how it's projected to 2D.

## PerspectiveCamera

Mimics human vision - objects farther away appear smaller.

\`\`\`javascript
const camera = new THREE.PerspectiveCamera(
  75,           // FOV (field of view) in degrees
  width/height, // Aspect ratio
  0.1,          // Near clipping plane
  1000          // Far clipping plane
);
\`\`\`

**FOV Tips:**
- 45-75° for normal views
- Higher FOV = more visible but more distortion
- Lower FOV = telephoto/zoom effect

## OrthographicCamera

No perspective - parallel lines stay parallel. Good for 2D games, technical drawings.

\`\`\`javascript
const aspectRatio = width / height;
const frustumSize = 5;

const camera = new THREE.OrthographicCamera(
  frustumSize * aspectRatio / -2,  // left
  frustumSize * aspectRatio / 2,   // right
  frustumSize / 2,                  // top
  frustumSize / -2,                 // bottom
  0.1,                              // near
  100                               // far
);
\`\`\`

## Camera Positioning

\`\`\`javascript
camera.position.set(5, 5, 5);     // Set position
camera.lookAt(0, 0, 0);           // Point at target
camera.lookAt(mesh.position);     // Point at an object
\`\`\`

## Updating on Resize

Remember to update the camera when window resizes:

\`\`\`javascript
// Perspective
camera.aspect = width / height;
camera.updateProjectionMatrix();

// Orthographic
camera.left = frustumSize * aspect / -2;
camera.right = frustumSize * aspect / 2;
camera.updateProjectionMatrix();
\`\`\`
        `,
        concepts: ['PerspectiveCamera', 'OrthographicCamera', 'FOV', 'frustum', 'lookAt'],
        references: [
          { title: 'Cameras', url: 'https://threejs.org/manual/#en/cameras' },
          { title: 'PerspectiveCamera', url: 'https://threejs.org/docs/#api/en/cameras/PerspectiveCamera' }
        ]
      },
      exercises: [
        {
          id: 'camera-comparison',
          title: 'Camera Comparison',
          description: 'Create a scene viewable from both perspective and orthographic cameras',
          starterCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const width = container.clientWidth;
const height = container.clientHeight;
const aspectRatio = width / height;

// TODO: Create a PerspectiveCamera (FOV 50)
const perspCamera = // Your code here

perspCamera.position.set(5, 5, 5);
perspCamera.lookAt(0, 0, 0);

// TODO: Create an OrthographicCamera (frustumSize 8)
const frustumSize = 8;
const orthoCamera = // Your code here

orthoCamera.position.set(5, 5, 5);
orthoCamera.lookAt(0, 0, 0);

// Start with perspective camera
let activeCamera = perspCamera;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Add lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Create grid of objects
const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const material = new THREE.MeshStandardMaterial({ color: 0xFF4D00 });

for (let x = -2; x <= 2; x++) {
  for (let z = -2; z <= 2; z++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x * 1.5, 0, z * 1.5);
    scene.add(cube);
  }
}

// Add grid helper
const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
scene.add(gridHelper);

// Toggle camera on click
container.addEventListener('click', () => {
  activeCamera = activeCamera === perspCamera ? orthoCamera : perspCamera;
  console.log('Switched to:', activeCamera === perspCamera ? 'Perspective' : 'Orthographic');
});

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  
  // Orbit the camera around the scene
  const radius = 8;
  activeCamera.position.x = Math.sin(time * 0.3) * radius;
  activeCamera.position.z = Math.cos(time * 0.3) * radius;
  activeCamera.position.y = 5;
  activeCamera.lookAt(0, 0, 0);
  
  renderer.render(scene, activeCamera);
}

animate();
`,
          solutionCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const width = container.clientWidth;
const height = container.clientHeight;
const aspectRatio = width / height;

// Create a PerspectiveCamera (FOV 50)
const perspCamera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 100);
perspCamera.position.set(5, 5, 5);
perspCamera.lookAt(0, 0, 0);

// Create an OrthographicCamera (frustumSize 8)
const frustumSize = 8;
const orthoCamera = new THREE.OrthographicCamera(
  frustumSize * aspectRatio / -2,
  frustumSize * aspectRatio / 2,
  frustumSize / 2,
  frustumSize / -2,
  0.1,
  100
);
orthoCamera.position.set(5, 5, 5);
orthoCamera.lookAt(0, 0, 0);

// Start with perspective camera
let activeCamera = perspCamera;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Add lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Create grid of objects
const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const material = new THREE.MeshStandardMaterial({ color: 0xFF4D00 });

for (let x = -2; x <= 2; x++) {
  for (let z = -2; z <= 2; z++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x * 1.5, 0, z * 1.5);
    scene.add(cube);
  }
}

// Add grid helper
const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
scene.add(gridHelper);

// Toggle camera on click
container.addEventListener('click', () => {
  activeCamera = activeCamera === perspCamera ? orthoCamera : perspCamera;
  console.log('Switched to:', activeCamera === perspCamera ? 'Perspective' : 'Orthographic');
});

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  
  // Orbit the camera around the scene
  const radius = 8;
  activeCamera.position.x = Math.sin(time * 0.3) * radius;
  activeCamera.position.z = Math.cos(time * 0.3) * radius;
  activeCamera.position.y = 5;
  activeCamera.lookAt(0, 0, 0);
  
  renderer.render(scene, activeCamera);
}

animate();
`,
          hints: [
            'PerspectiveCamera(fov, aspect, near, far)',
            'OrthographicCamera(left, right, top, bottom, near, far)',
            'Use frustumSize * aspectRatio for left/right',
            'Click to toggle between cameras'
          ],
          validation: { type: 'visual', checks: ['grid of cubes', 'camera orbiting', 'click toggles'] }
        }
      ]
    },

    // Lesson 4.2: OrbitControls
    {
      meta: {
        id: 'orbit-controls',
        title: 'OrbitControls',
        description: 'Add interactive camera controls for user navigation',
        duration: 20,
        difficulty: 'intermediate',
        prerequisites: ['camera-types'],
        objectives: [
          'Import and set up OrbitControls',
          'Configure control limits',
          'Enable damping for smooth movement',
          'Customize control behavior'
        ],
        tags: ['controls', 'OrbitControls', 'interaction', 'navigation']
      },
      theory: {
        markdown: `
# OrbitControls

OrbitControls lets users rotate, pan, and zoom the camera with mouse/touch.

## Setup

\`\`\`javascript
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);
\`\`\`

## Enable Damping

Smooth camera movement with inertia:

\`\`\`javascript
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Must call update in animation loop
function animate() {
  controls.update();  // Required for damping
  renderer.render(scene, camera);
}
\`\`\`

## Control Limits

\`\`\`javascript
// Distance limits
controls.minDistance = 2;
controls.maxDistance = 20;

// Vertical angle limits (prevent going underground)
controls.minPolarAngle = 0;                // Looking straight down
controls.maxPolarAngle = Math.PI / 2;      // Horizon

// Horizontal angle limits
controls.minAzimuthAngle = -Math.PI / 4;   // -45°
controls.maxAzimuthAngle = Math.PI / 4;    // 45°
\`\`\`

## Enable/Disable Features

\`\`\`javascript
controls.enableRotate = true;
controls.enableZoom = true;
controls.enablePan = true;

controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.0;
controls.panSpeed = 1.0;
\`\`\`

## Auto-Rotate

\`\`\`javascript
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;  // 30 seconds per orbit at 60fps
\`\`\`

## Keyboard Controls

\`\`\`javascript
controls.listenToKeyEvents(window);
controls.keys = {
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  BOTTOM: 'ArrowDown'
};
\`\`\`
        `,
        concepts: ['OrbitControls', 'damping', 'control limits', 'autoRotate'],
        references: [
          { title: 'OrbitControls', url: 'https://threejs.org/docs/#examples/en/controls/OrbitControls' }
        ]
      },
      exercises: [
        {
          id: 'interactive-scene',
          title: 'Interactive Scene with OrbitControls',
          description: 'Set up OrbitControls with damping and proper limits',
          starterCode: `// Note: OrbitControls is available as THREE.OrbitControls in this sandbox

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(3, 3, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// TODO: Create OrbitControls
const controls = // Your code here

// TODO: Enable damping with factor 0.05


// TODO: Set min/max distance (2 to 15)


// TODO: Limit vertical angle (0 to Math.PI * 0.45 - don't go below ground)


// TODO: Enable auto-rotate at speed 1


// Add lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Create a pedestal with object
const pedestalGeometry = new THREE.CylinderGeometry(1, 1.2, 0.3, 32);
const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.5 });
const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
pedestal.position.y = -0.5;
scene.add(pedestal);

// Main object - a torus knot
const knotGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16);
const knotMaterial = new THREE.MeshStandardMaterial({ color: 0xFF4D00, metalness: 0.7, roughness: 0.2 });
const knot = new THREE.Mesh(knotGeometry, knotMaterial);
knot.position.y = 0.5;
scene.add(knot);

// Grid for reference
const grid = new THREE.GridHelper(10, 10, 0x333333, 0x222222);
grid.position.y = -0.65;
scene.add(grid);

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  // TODO: Update controls (required for damping)
  
  
  // Slowly rotate the object
  knot.rotation.y = clock.getElapsedTime() * 0.5;
  
  renderer.render(scene, camera);
}

animate();
`,
          solutionCode: `// Note: OrbitControls is available as THREE.OrbitControls in this sandbox

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(3, 3, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Create OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Enable damping with factor 0.05
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Set min/max distance (2 to 15)
controls.minDistance = 2;
controls.maxDistance = 15;

// Limit vertical angle (0 to Math.PI * 0.45)
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI * 0.45;

// Enable auto-rotate at speed 1
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

// Add lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Create a pedestal with object
const pedestalGeometry = new THREE.CylinderGeometry(1, 1.2, 0.3, 32);
const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.5 });
const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
pedestal.position.y = -0.5;
scene.add(pedestal);

// Main object - a torus knot
const knotGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16);
const knotMaterial = new THREE.MeshStandardMaterial({ color: 0xFF4D00, metalness: 0.7, roughness: 0.2 });
const knot = new THREE.Mesh(knotGeometry, knotMaterial);
knot.position.y = 0.5;
scene.add(knot);

// Grid for reference
const grid = new THREE.GridHelper(10, 10, 0x333333, 0x222222);
grid.position.y = -0.65;
scene.add(grid);

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  // Update controls (required for damping)
  controls.update();
  
  // Slowly rotate the object
  knot.rotation.y = clock.getElapsedTime() * 0.5;
  
  renderer.render(scene, camera);
}

animate();
`,
          hints: [
            'new THREE.OrbitControls(camera, renderer.domElement)',
            'controls.enableDamping = true; controls.dampingFactor = 0.05',
            'controls.minDistance = 2; controls.maxDistance = 15',
            'Must call controls.update() in animation loop'
          ],
          validation: { type: 'visual', checks: ['orbit controls working', 'damping smooth', 'limits respected'] }
        }
      ]
    },

    // Lesson 4.3: Raycaster
    {
      meta: {
        id: 'raycaster',
        title: 'Raycaster & Object Picking',
        description: 'Detect mouse interactions with 3D objects',
        duration: 30,
        difficulty: 'intermediate',
        prerequisites: ['orbit-controls'],
        objectives: [
          'Understand raycasting concepts',
          'Convert mouse coordinates to 3D',
          'Detect object intersections',
          'Implement click and hover interactions'
        ],
        tags: ['raycaster', 'picking', 'interaction', 'mouse']
      },
      theory: {
        markdown: `
# Raycaster - Object Picking

The Raycaster casts an invisible ray and detects what objects it intersects.

## Basic Setup

\`\`\`javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
\`\`\`

## Mouse Position to Normalized Device Coordinates

Mouse must be converted to range -1 to 1:

\`\`\`javascript
function onMouseMove(event) {
  // Normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
\`\`\`

## Casting the Ray

\`\`\`javascript
// Set ray from camera through mouse position
raycaster.setFromCamera(mouse, camera);

// Get array of objects the ray intersects
const intersects = raycaster.intersectObjects(scene.children);

if (intersects.length > 0) {
  const firstHit = intersects[0];
  console.log('Hit object:', firstHit.object);
  console.log('At distance:', firstHit.distance);
  console.log('At point:', firstHit.point);
}
\`\`\`

## Hover Effects

\`\`\`javascript
let hoveredObject = null;

function animate() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);
  
  // Reset previous
  if (hoveredObject) {
    hoveredObject.material.color.set(0xffffff);
    hoveredObject = null;
  }
  
  // Highlight current
  if (intersects.length > 0) {
    hoveredObject = intersects[0].object;
    hoveredObject.material.color.set(0xff0000);
  }
}
\`\`\`

## Click Events

\`\`\`javascript
function onClick(event) {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);
  
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    // Do something with clicked object
  }
}

window.addEventListener('click', onClick);
\`\`\`
        `,
        concepts: ['Raycaster', 'intersectObjects', 'normalized coordinates', 'picking'],
        references: [
          { title: 'Raycaster', url: 'https://threejs.org/docs/#api/en/core/Raycaster' },
          { title: 'Picking', url: 'https://threejs.org/manual/#en/picking' }
        ]
      },
      exercises: [
        {
          id: 'interactive-objects',
          title: 'Interactive Object Picking',
          description: 'Create clickable spheres that change color when clicked',
          starterCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// TODO: Create Raycaster and mouse Vector2
const raycaster = // Your code here
const mouse = // Your code here

// Create spheres
const spheres = [];
const colors = [0xFF4D00, 0x00D4FF, 0x00FF88, 0xFFD700, 0xFF00FF];

for (let i = 0; i < 5; i++) {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshStandardMaterial({ 
    color: colors[i],
    metalness: 0.3,
    roughness: 0.4
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = (i - 2) * 1.5;
  sphere.userData.originalColor = colors[i];
  sphere.userData.isSelected = false;
  scene.add(sphere);
  spheres.push(sphere);
}

let hoveredSphere = null;

// TODO: Handle mouse move to update mouse coordinates
function onMouseMove(event) {
  // Get container bounds
  const rect = container.getBoundingClientRect();
  
  // TODO: Calculate normalized device coordinates (-1 to 1)
  // Remember Y is inverted in screen coordinates
  mouse.x = // Your code here
  mouse.y = // Your code here
}

// TODO: Handle click to toggle sphere selection
function onClick(event) {
  // TODO: Set raycaster from camera through mouse position
  
  // TODO: Check intersections with spheres array
  const intersects = // Your code here
  
  if (intersects.length > 0) {
    const sphere = intersects[0].object;
    
    // Toggle selection
    sphere.userData.isSelected = !sphere.userData.isSelected;
    
    if (sphere.userData.isSelected) {
      sphere.material.color.set(0xffffff);
      sphere.scale.set(1.2, 1.2, 1.2);
    } else {
      sphere.material.color.set(sphere.userData.originalColor);
      sphere.scale.set(1, 1, 1);
    }
  }
}

container.addEventListener('mousemove', onMouseMove);
container.addEventListener('click', onClick);

// Animation with hover effect
function animate() {
  requestAnimationFrame(animate);
  
  // Cast ray
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(spheres);
  
  // Reset cursor
  container.style.cursor = 'default';
  
  // Reset previous hover (if not selected)
  if (hoveredSphere && !hoveredSphere.userData.isSelected) {
    hoveredSphere.material.emissive.set(0x000000);
  }
  
  // Apply new hover
  if (intersects.length > 0) {
    hoveredSphere = intersects[0].object;
    if (!hoveredSphere.userData.isSelected) {
      hoveredSphere.material.emissive.set(0x333333);
    }
    container.style.cursor = 'pointer';
  } else {
    hoveredSphere = null;
  }
  
  renderer.render(scene, camera);
}

animate();
`,
          solutionCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create Raycaster and mouse Vector2
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Create spheres
const spheres = [];
const colors = [0xFF4D00, 0x00D4FF, 0x00FF88, 0xFFD700, 0xFF00FF];

for (let i = 0; i < 5; i++) {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshStandardMaterial({ 
    color: colors[i],
    metalness: 0.3,
    roughness: 0.4
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = (i - 2) * 1.5;
  sphere.userData.originalColor = colors[i];
  sphere.userData.isSelected = false;
  scene.add(sphere);
  spheres.push(sphere);
}

let hoveredSphere = null;

// Handle mouse move to update mouse coordinates
function onMouseMove(event) {
  const rect = container.getBoundingClientRect();
  
  // Calculate normalized device coordinates (-1 to 1)
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

// Handle click to toggle sphere selection
function onClick(event) {
  // Set raycaster from camera through mouse position
  raycaster.setFromCamera(mouse, camera);
  
  // Check intersections with spheres array
  const intersects = raycaster.intersectObjects(spheres);
  
  if (intersects.length > 0) {
    const sphere = intersects[0].object;
    
    // Toggle selection
    sphere.userData.isSelected = !sphere.userData.isSelected;
    
    if (sphere.userData.isSelected) {
      sphere.material.color.set(0xffffff);
      sphere.scale.set(1.2, 1.2, 1.2);
    } else {
      sphere.material.color.set(sphere.userData.originalColor);
      sphere.scale.set(1, 1, 1);
    }
  }
}

container.addEventListener('mousemove', onMouseMove);
container.addEventListener('click', onClick);

// Animation with hover effect
function animate() {
  requestAnimationFrame(animate);
  
  // Cast ray
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(spheres);
  
  // Reset cursor
  container.style.cursor = 'default';
  
  // Reset previous hover (if not selected)
  if (hoveredSphere && !hoveredSphere.userData.isSelected) {
    hoveredSphere.material.emissive.set(0x000000);
  }
  
  // Apply new hover
  if (intersects.length > 0) {
    hoveredSphere = intersects[0].object;
    if (!hoveredSphere.userData.isSelected) {
      hoveredSphere.material.emissive.set(0x333333);
    }
    container.style.cursor = 'pointer';
  } else {
    hoveredSphere = null;
  }
  
  renderer.render(scene, camera);
}

animate();
`,
          hints: [
            'new THREE.Raycaster() and new THREE.Vector2()',
            'mouse.x = ((clientX - left) / width) * 2 - 1',
            'mouse.y = -((clientY - top) / height) * 2 + 1 (inverted)',
            'raycaster.setFromCamera(mouse, camera)'
          ],
          validation: { type: 'visual', checks: ['hover effect', 'click selects', 'cursor changes'] }
        }
      ]
    }
  ]
};
