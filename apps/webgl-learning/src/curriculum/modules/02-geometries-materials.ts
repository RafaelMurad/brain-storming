/**
 * Module 02: Geometries & Materials
 * Understanding shapes and appearances in Three.js
 */

import type { Module } from '../types';

export const geometriesMaterialsModule: Module = {
  id: 'geometries-materials',
  number: 2,
  title: 'Geometries & Materials',
  description: 'Explore built-in geometries and material types to create diverse 3D objects',
  icon: '📐',
  color: '#00D4FF',
  lessons: [
    // Lesson 2.1: Built-in Geometries
    {
      meta: {
        id: 'builtin-geometries',
        title: 'Built-in Geometries',
        description: 'Explore the variety of geometric primitives Three.js offers',
        duration: 25,
        difficulty: 'beginner',
        prerequisites: ['first-cube'],
        objectives: [
          'Use different geometry primitives',
          'Understand geometry parameters',
          'Create complex shapes from primitives',
          'Learn about wireframe visualization'
        ],
        tags: ['geometry', 'primitives', 'sphere', 'cylinder', 'torus']
      },
      theory: {
        markdown: `
# Built-in Geometries

Three.js provides many ready-to-use geometry primitives. Each creates vertices and faces for common shapes.

## Common Geometries

### BoxGeometry
\`\`\`javascript
new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
\`\`\`

### SphereGeometry
\`\`\`javascript
new THREE.SphereGeometry(radius, widthSegments, heightSegments)
// More segments = smoother sphere
\`\`\`

### CylinderGeometry
\`\`\`javascript
new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)
// Set radiusTop to 0 for a cone
\`\`\`

### TorusGeometry (Donut)
\`\`\`javascript
new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments)
\`\`\`

### PlaneGeometry
\`\`\`javascript
new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
\`\`\`

## Segments and Detail

More segments create smoother curves but use more vertices:

\`\`\`javascript
// Low poly sphere (20 segments)
new THREE.SphereGeometry(1, 8, 8);

// Smooth sphere (128 segments)  
new THREE.SphereGeometry(1, 32, 32);
\`\`\`

## Visualizing with Wireframe

See the geometry structure with wireframe:

\`\`\`javascript
const material = new THREE.MeshBasicMaterial({ 
  wireframe: true,
  color: 0xFF4D00 
});
\`\`\`
        `,
        concepts: ['SphereGeometry', 'CylinderGeometry', 'TorusGeometry', 'PlaneGeometry', 'segments'],
        references: [
          { title: 'BufferGeometry', url: 'https://threejs.org/docs/#api/en/core/BufferGeometry' },
          { title: 'Primitives', url: 'https://threejs.org/manual/#en/primitives' }
        ]
      },
      exercises: [
        {
          id: 'geometry-showcase',
          title: 'Geometry Showcase',
          description: 'Create a scene with multiple different geometries arranged in a row',
          starterCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 8;
camera.position.y = 2;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Shared material with wireframe
const material = new THREE.MeshBasicMaterial({ 
  color: 0xFF4D00, 
  wireframe: true 
});

// TODO: Create a box (1x1x1)
const boxGeometry = // Your code here
const box = new THREE.Mesh(boxGeometry, material);
box.position.x = -4;
scene.add(box);

// TODO: Create a sphere (radius 0.7, 16 segments each)
const sphereGeometry = // Your code here
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.x = -2;
scene.add(sphere);

// TODO: Create a cylinder (radiusTop 0.5, radiusBottom 0.5, height 1.5, 16 segments)
const cylinderGeometry = // Your code here
const cylinder = new THREE.Mesh(cylinderGeometry, material);
cylinder.position.x = 0;
scene.add(cylinder);

// TODO: Create a cone (radiusTop 0, radiusBottom 0.7, height 1.5, 16 segments)
const coneGeometry = // Your code here
const cone = new THREE.Mesh(coneGeometry, material);
cone.position.x = 2;
scene.add(cone);

// TODO: Create a torus (radius 0.5, tube 0.2, 16, 32 segments)
const torusGeometry = // Your code here
const torus = new THREE.Mesh(torusGeometry, material);
torus.position.x = 4;
scene.add(torus);

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  
  // Rotate all shapes
  [box, sphere, cylinder, cone, torus].forEach((mesh, i) => {
    mesh.rotation.y = time + i * 0.5;
    mesh.rotation.x = time * 0.5;
  });
  
  renderer.render(scene, camera);
}

animate();
`,
          solutionCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 8;
camera.position.y = 2;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Shared material with wireframe
const material = new THREE.MeshBasicMaterial({ 
  color: 0xFF4D00, 
  wireframe: true 
});

// Create a box (1x1x1)
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const box = new THREE.Mesh(boxGeometry, material);
box.position.x = -4;
scene.add(box);

// Create a sphere (radius 0.7, 16 segments each)
const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.x = -2;
scene.add(sphere);

// Create a cylinder (radiusTop 0.5, radiusBottom 0.5, height 1.5, 16 segments)
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
const cylinder = new THREE.Mesh(cylinderGeometry, material);
cylinder.position.x = 0;
scene.add(cylinder);

// Create a cone (radiusTop 0, radiusBottom 0.7, height 1.5, 16 segments)
const coneGeometry = new THREE.CylinderGeometry(0, 0.7, 1.5, 16);
const cone = new THREE.Mesh(coneGeometry, material);
cone.position.x = 2;
scene.add(cone);

// Create a torus (radius 0.5, tube 0.2, 16, 32 segments)
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
const torus = new THREE.Mesh(torusGeometry, material);
torus.position.x = 4;
scene.add(torus);

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  
  // Rotate all shapes
  [box, sphere, cylinder, cone, torus].forEach((mesh, i) => {
    mesh.rotation.y = time + i * 0.5;
    mesh.rotation.x = time * 0.5;
  });
  
  renderer.render(scene, camera);
}

animate();
`,
          hints: [
            'SphereGeometry(radius, widthSegments, heightSegments)',
            'CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)',
            'A cone is a cylinder with radiusTop = 0',
            'TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments)'
          ],
          validation: { type: 'visual', checks: ['5 shapes visible', 'wireframe mode'] }
        }
      ]
    },

    // Lesson 2.2: Material Types
    {
      meta: {
        id: 'material-types',
        title: 'Material Types',
        description: 'Understand different materials and their visual properties',
        duration: 25,
        difficulty: 'beginner',
        prerequisites: ['builtin-geometries'],
        objectives: [
          'Compare MeshBasicMaterial vs MeshStandardMaterial',
          'Use MeshNormalMaterial for debugging',
          'Understand material properties',
          'Apply different materials to the same geometry'
        ],
        tags: ['material', 'standard', 'basic', 'normal', 'phong']
      },
      theory: {
        markdown: `
# Material Types in Three.js

Materials define how surfaces appear. Different materials have different performance and visual characteristics.

## MeshBasicMaterial

Simplest material - not affected by lights, always fully visible.

\`\`\`javascript
new THREE.MeshBasicMaterial({
  color: 0xFF4D00,
  wireframe: false,
  transparent: true,
  opacity: 0.8
});
\`\`\`

## MeshNormalMaterial

Colors based on surface normal direction. Great for debugging geometry.

\`\`\`javascript
new THREE.MeshNormalMaterial({
  flatShading: true  // Shows individual faces
});
\`\`\`

## MeshLambertMaterial

Reacts to light with diffuse (matte) reflection. Good performance.

\`\`\`javascript
new THREE.MeshLambertMaterial({
  color: 0xFF4D00
});
\`\`\`

## MeshPhongMaterial

Adds specular highlights (shiny spots). More realistic than Lambert.

\`\`\`javascript
new THREE.MeshPhongMaterial({
  color: 0xFF4D00,
  shininess: 100,
  specular: 0xFFFFFF
});
\`\`\`

## MeshStandardMaterial

Physically-based rendering (PBR). Most realistic but needs lights.

\`\`\`javascript
new THREE.MeshStandardMaterial({
  color: 0xFF4D00,
  metalness: 0.5,    // 0 = plastic, 1 = metal
  roughness: 0.5     // 0 = mirror, 1 = diffuse
});
\`\`\`

## Quick Comparison

| Material | Lights Required | Realism | Performance |
|----------|-----------------|---------|-------------|
| Basic | No | Low | Best |
| Normal | No | Debug | Good |
| Lambert | Yes | Medium | Good |
| Phong | Yes | Good | Medium |
| Standard | Yes | Best | Heavier |
        `,
        concepts: ['MeshBasicMaterial', 'MeshStandardMaterial', 'MeshPhongMaterial', 'metalness', 'roughness'],
        references: [
          { title: 'Materials', url: 'https://threejs.org/manual/#en/materials' },
          { title: 'MeshStandardMaterial', url: 'https://threejs.org/docs/#api/en/materials/MeshStandardMaterial' }
        ]
      },
      exercises: [
        {
          id: 'material-comparison',
          title: 'Material Comparison',
          description: 'Create spheres with different materials to see how they differ',
          starterCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add lights for materials that need them
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Shared geometry
const geometry = new THREE.SphereGeometry(0.8, 32, 32);

// TODO: Create MeshBasicMaterial sphere
const basicMaterial = // Your code here
const basicSphere = new THREE.Mesh(geometry, basicMaterial);
basicSphere.position.x = -3;
scene.add(basicSphere);

// TODO: Create MeshNormalMaterial sphere
const normalMaterial = // Your code here
const normalSphere = new THREE.Mesh(geometry, normalMaterial);
normalSphere.position.x = -1;
scene.add(normalSphere);

// TODO: Create MeshPhongMaterial sphere (shininess 100)
const phongMaterial = // Your code here
const phongSphere = new THREE.Mesh(geometry, phongMaterial);
phongSphere.position.x = 1;
scene.add(phongSphere);

// TODO: Create MeshStandardMaterial sphere (metalness 0.7, roughness 0.3)
const standardMaterial = // Your code here
const standardSphere = new THREE.Mesh(geometry, standardMaterial);
standardSphere.position.x = 3;
scene.add(standardSphere);

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  
  [basicSphere, normalSphere, phongSphere, standardSphere].forEach(sphere => {
    sphere.rotation.y = time * 0.5;
  });
  
  renderer.render(scene, camera);
}

animate();
`,
          solutionCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add lights for materials that need them
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Shared geometry
const geometry = new THREE.SphereGeometry(0.8, 32, 32);

// Create MeshBasicMaterial sphere
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xFF4D00 });
const basicSphere = new THREE.Mesh(geometry, basicMaterial);
basicSphere.position.x = -3;
scene.add(basicSphere);

// Create MeshNormalMaterial sphere
const normalMaterial = new THREE.MeshNormalMaterial();
const normalSphere = new THREE.Mesh(geometry, normalMaterial);
normalSphere.position.x = -1;
scene.add(normalSphere);

// Create MeshPhongMaterial sphere (shininess 100)
const phongMaterial = new THREE.MeshPhongMaterial({ color: 0xFF4D00, shininess: 100 });
const phongSphere = new THREE.Mesh(geometry, phongMaterial);
phongSphere.position.x = 1;
scene.add(phongSphere);

// Create MeshStandardMaterial sphere (metalness 0.7, roughness 0.3)
const standardMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xFF4D00, 
  metalness: 0.7, 
  roughness: 0.3 
});
const standardSphere = new THREE.Mesh(geometry, standardMaterial);
standardSphere.position.x = 3;
scene.add(standardSphere);

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  
  [basicSphere, normalSphere, phongSphere, standardSphere].forEach(sphere => {
    sphere.rotation.y = time * 0.5;
  });
  
  renderer.render(scene, camera);
}

animate();
`,
          hints: [
            'MeshBasicMaterial({ color: 0xFF4D00 })',
            'MeshNormalMaterial() - no options needed',
            'MeshPhongMaterial({ color, shininess })',
            'MeshStandardMaterial({ color, metalness, roughness })'
          ],
          validation: { type: 'visual', checks: ['4 spheres visible', 'different appearances'] }
        }
      ]
    },

    // Lesson 2.3: Custom Geometry with BufferGeometry
    {
      meta: {
        id: 'buffer-geometry',
        title: 'Custom Geometry',
        description: 'Create your own geometry with BufferGeometry',
        duration: 30,
        difficulty: 'intermediate',
        prerequisites: ['builtin-geometries'],
        objectives: [
          'Understand vertices and faces',
          'Create custom BufferGeometry',
          'Work with Float32Array buffers',
          'Add position attributes'
        ],
        tags: ['BufferGeometry', 'vertices', 'Float32Array', 'custom']
      },
      theory: {
        markdown: `
# Custom Geometry with BufferGeometry

For complex or procedural shapes, you can create geometry from scratch using BufferGeometry.

## How Geometry Works

3D geometry is defined by:
- **Vertices**: Points in 3D space (x, y, z)
- **Faces**: Triangles connecting vertices (every 3 vertices = 1 triangle)

## Creating a Custom Triangle

\`\`\`javascript
const geometry = new THREE.BufferGeometry();

// 3 vertices * 3 coordinates each = 9 values
const vertices = new Float32Array([
  -1, -1, 0,   // vertex 0 (bottom-left)
   1, -1, 0,   // vertex 1 (bottom-right)
   0,  1, 0    // vertex 2 (top)
]);

// Add position attribute
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
\`\`\`

## Random Triangles Example

\`\`\`javascript
const geometry = new THREE.BufferGeometry();
const count = 50; // 50 triangles
const positions = new Float32Array(count * 3 * 3); // triangles * vertices * coordinates

for (let i = 0; i < count * 3 * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 4;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
\`\`\`

## Important Concepts

- Vertices are stored in a **Float32Array** (typed array for performance)
- The \`3\` in BufferAttribute means 3 values per vertex (x, y, z)
- Three.js automatically forms triangles from every 3 vertices
        `,
        concepts: ['BufferGeometry', 'BufferAttribute', 'Float32Array', 'vertices'],
        references: [
          { title: 'BufferGeometry', url: 'https://threejs.org/docs/#api/en/core/BufferGeometry' },
          { title: 'Custom BufferGeometry', url: 'https://threejs.org/manual/#en/custom-buffergeometry' }
        ]
      },
      exercises: [
        {
          id: 'random-triangles',
          title: 'Random Triangles Art',
          description: 'Create abstract art with randomly positioned triangles',
          starterCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// TODO: Create a BufferGeometry
const geometry = // Your code here

// Number of triangles
const triangleCount = 100;

// TODO: Calculate total positions needed
// (triangles * vertices per triangle * coordinates per vertex)
const positionCount = // Your code here

// TODO: Create Float32Array for positions
const positions = // Your code here

// TODO: Fill with random positions between -2 and 2
for (let i = 0; i < positionCount; i++) {
  // Your code here
}

// TODO: Set the position attribute
// geometry.setAttribute('position', ...)


// Create mesh with wireframe material
const material = new THREE.MeshBasicMaterial({ 
  color: 0xFF4D00,
  wireframe: true
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.y = clock.getElapsedTime() * 0.3;
  mesh.rotation.x = clock.getElapsedTime() * 0.2;
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

// Create a BufferGeometry
const geometry = new THREE.BufferGeometry();

// Number of triangles
const triangleCount = 100;

// Calculate total positions needed
const positionCount = triangleCount * 3 * 3;

// Create Float32Array for positions
const positions = new Float32Array(positionCount);

// Fill with random positions between -2 and 2
for (let i = 0; i < positionCount; i++) {
  positions[i] = (Math.random() - 0.5) * 4;
}

// Set the position attribute
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Create mesh with wireframe material
const material = new THREE.MeshBasicMaterial({ 
  color: 0xFF4D00,
  wireframe: true
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.y = clock.getElapsedTime() * 0.3;
  mesh.rotation.x = clock.getElapsedTime() * 0.2;
  renderer.render(scene, camera);
}

animate();
`,
          hints: [
            'new THREE.BufferGeometry()',
            'triangles * 3 vertices * 3 coordinates = positionCount',
            'new Float32Array(positionCount)',
            '(Math.random() - 0.5) * 4 gives range -2 to 2',
            'new THREE.BufferAttribute(positions, 3)'
          ],
          validation: { type: 'visual', checks: ['many triangles visible', 'rotating'] }
        }
      ]
    }
  ]
};
