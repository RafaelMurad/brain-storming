/**
 * Module 05: Animation & Physics
 * Advanced animation techniques and physics simulation
 */

import type { Module } from '../types';

export const animationPhysicsModule: Module = {
  id: 'animation-physics',
  number: 5,
  title: 'Animation & Physics',
  description: 'Master advanced animation with GSAP, keyframes, and basic physics simulation',
  icon: '🎬',
  color: '#E74C3C',
  lessons: [
    // Lesson 5.1: GSAP Animations
    {
      meta: {
        id: 'gsap-animations',
        title: 'GSAP Animations',
        description: 'Use GSAP for professional-grade animations',
        duration: 30,
        difficulty: 'intermediate',
        prerequisites: ['animation-loop'],
        objectives: [
          'Integrate GSAP with Three.js',
          'Animate position, rotation, and scale',
          'Use timelines for sequenced animations',
          'Apply easing functions'
        ],
        tags: ['gsap', 'tween', 'timeline', 'easing']
      },
      theory: {
        markdown: `
# GSAP with Three.js

GSAP (GreenSock Animation Platform) provides powerful, professional animations.

## Basic Tween

\`\`\`javascript
import gsap from 'gsap';

// Animate position
gsap.to(cube.position, {
  x: 2,
  duration: 1,
  ease: 'power2.out'
});

// Animate rotation
gsap.to(cube.rotation, {
  y: Math.PI * 2,
  duration: 2,
  ease: 'elastic.out(1, 0.3)'
});

// Animate scale
gsap.to(cube.scale, {
  x: 2,
  y: 2,
  z: 2,
  duration: 0.5
});
\`\`\`

## From and FromTo

\`\`\`javascript
// Start from these values, animate to current
gsap.from(cube.position, {
  y: 10,
  duration: 1
});

// Explicit start and end
gsap.fromTo(cube.position, 
  { x: -5 },  // from
  { x: 5, duration: 2 }  // to
);
\`\`\`

## Timelines

Sequence multiple animations:

\`\`\`javascript
const tl = gsap.timeline({ repeat: -1, yoyo: true });

tl.to(cube.position, { x: 2, duration: 1 })
  .to(cube.rotation, { y: Math.PI, duration: 0.5 })
  .to(cube.scale, { x: 1.5, y: 1.5, duration: 0.3 }, '-=0.3');
  
// '-=0.3' means start 0.3 seconds before previous ends (overlap)
\`\`\`

## Common Easing Functions

- \`linear\` - constant speed
- \`power1.out\` to \`power4.out\` - deceleration
- \`power1.in\` to \`power4.in\` - acceleration
- \`elastic.out\` - bouncy overshoot
- \`bounce.out\` - bouncing ball
- \`back.out\` - slight overshoot

## Animating Material Properties

\`\`\`javascript
gsap.to(material.color, {
  r: 1, g: 0, b: 0,  // RGB 0-1 range
  duration: 1
});

gsap.to(material, {
  opacity: 0,
  duration: 0.5
});
\`\`\`
        `,
        concepts: ['gsap.to', 'gsap.from', 'timeline', 'easing'],
        references: [
          { title: 'GSAP Docs', url: 'https://gsap.com/docs/v3/' },
          { title: 'GSAP Easing', url: 'https://gsap.com/docs/v3/Eases/' }
        ]
      },
      exercises: [
        {
          id: 'gsap-showcase',
          title: 'GSAP Animation Showcase',
          description: 'Create a scene with multiple objects animated using GSAP timelines',
          starterCode: `// Note: GSAP is available as window.gsap in this sandbox

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create objects
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material1 = new THREE.MeshStandardMaterial({ color: 0xFF4D00 });
const material2 = new THREE.MeshStandardMaterial({ color: 0x00D4FF });
const material3 = new THREE.MeshStandardMaterial({ color: 0x00FF88 });

const cube1 = new THREE.Mesh(geometry, material1);
const cube2 = new THREE.Mesh(geometry, material2);
const cube3 = new THREE.Mesh(geometry, material3);

cube1.position.x = -3;
cube2.position.x = 0;
cube3.position.x = 3;

scene.add(cube1, cube2, cube3);

// TODO: Create a GSAP timeline with repeat and yoyo
const tl = gsap.timeline({ 
  // Add repeat: -1 and yoyo: true
});

// TODO: Animate cube1 - bounce up (y to 2, elastic ease)
tl.to(cube1.position, {
  // Your animation config
});

// TODO: Animate cube2 - spin (rotation.y to PI*2, power2 ease)
tl.to(cube2.rotation, {
  // Your animation config
}, '-=0.5'); // Overlap with previous

// TODO: Animate cube3 - scale up and down (scale to 1.5 with back ease)
tl.to(cube3.scale, {
  // Your animation config
}, '-=0.5');

// TODO: Animate all cubes back to start position


// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
`,
          solutionCode: `// Note: GSAP is available as window.gsap in this sandbox

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create objects
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material1 = new THREE.MeshStandardMaterial({ color: 0xFF4D00 });
const material2 = new THREE.MeshStandardMaterial({ color: 0x00D4FF });
const material3 = new THREE.MeshStandardMaterial({ color: 0x00FF88 });

const cube1 = new THREE.Mesh(geometry, material1);
const cube2 = new THREE.Mesh(geometry, material2);
const cube3 = new THREE.Mesh(geometry, material3);

cube1.position.x = -3;
cube2.position.x = 0;
cube3.position.x = 3;

scene.add(cube1, cube2, cube3);

// Create a GSAP timeline with repeat and yoyo
const tl = gsap.timeline({ 
  repeat: -1,
  yoyo: true
});

// Animate cube1 - bounce up
tl.to(cube1.position, {
  y: 2,
  duration: 0.8,
  ease: 'elastic.out(1, 0.5)'
});

// Animate cube2 - spin
tl.to(cube2.rotation, {
  y: Math.PI * 2,
  duration: 1,
  ease: 'power2.inOut'
}, '-=0.5');

// Animate cube3 - scale up
tl.to(cube3.scale, {
  x: 1.5,
  y: 1.5,
  z: 1.5,
  duration: 0.6,
  ease: 'back.out(1.7)'
}, '-=0.5');

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
`,
          hints: [
            'gsap.timeline({ repeat: -1, yoyo: true })',
            'gsap.to(object.position, { y: 2, duration: 0.8, ease: "elastic.out" })',
            'Use "-=0.5" to overlap animations',
            'elastic.out creates a bouncy effect'
          ],
          validation: { type: 'visual', checks: ['cubes animating', 'timeline repeating', 'smooth easing'] }
        }
      ]
    },

    // Lesson 5.2: Keyframe Animation
    {
      meta: {
        id: 'keyframe-animation',
        title: 'Three.js Animation System',
        description: 'Use the built-in animation system with KeyframeTracks',
        duration: 35,
        difficulty: 'advanced',
        prerequisites: ['gsap-animations'],
        objectives: [
          'Create KeyframeTracks for property animation',
          'Build AnimationClips',
          'Use AnimationMixer to play animations',
          'Blend and control animations'
        ],
        tags: ['keyframes', 'AnimationMixer', 'AnimationClip', 'tracks']
      },
      theory: {
        markdown: `
# Three.js Animation System

Three.js has a built-in animation system for complex animations, especially useful for loaded models.

## Core Components

1. **KeyframeTrack** - Animates one property over time
2. **AnimationClip** - Collection of tracks forming an animation
3. **AnimationMixer** - Plays clips on an object
4. **AnimationAction** - Controls playback of a clip

## Creating a KeyframeTrack

\`\`\`javascript
// VectorKeyframeTrack for position/scale
const positionKF = new THREE.VectorKeyframeTrack(
  '.position',           // Property path
  [0, 1, 2],            // Times (seconds)
  [0, 0, 0, 0, 2, 0, 0, 0, 0]  // Values (x,y,z at each time)
);

// QuaternionKeyframeTrack for rotation
const q1 = new THREE.Quaternion().setFromAxisAngle(
  new THREE.Vector3(0, 1, 0), 0
);
const q2 = new THREE.Quaternion().setFromAxisAngle(
  new THREE.Vector3(0, 1, 0), Math.PI
);

const rotationKF = new THREE.QuaternionKeyframeTrack(
  '.quaternion',
  [0, 1],
  [...q1.toArray(), ...q2.toArray()]
);

// ColorKeyframeTrack for material.color
const colorKF = new THREE.ColorKeyframeTrack(
  '.material.color',
  [0, 0.5, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1]  // r,g,b at each time
);
\`\`\`

## Creating an AnimationClip

\`\`\`javascript
const clip = new THREE.AnimationClip('bounce', 2, [
  positionKF,
  rotationKF
]);
\`\`\`

## Playing with AnimationMixer

\`\`\`javascript
const mixer = new THREE.AnimationMixer(mesh);
const action = mixer.clipAction(clip);

action.play();
action.setLoop(THREE.LoopRepeat, Infinity);
action.timeScale = 1.5;  // Speed up

// In animation loop
function animate() {
  const delta = clock.getDelta();
  mixer.update(delta);
}
\`\`\`

## Action Controls

\`\`\`javascript
action.play();
action.pause();
action.stop();
action.reset();

action.clampWhenFinished = true;  // Hold last frame
action.setLoop(THREE.LoopOnce);   // Play once
action.fadeIn(0.5);               // Fade in over 0.5s
action.fadeOut(0.5);              // Fade out
\`\`\`
        `,
        concepts: ['KeyframeTrack', 'AnimationClip', 'AnimationMixer', 'AnimationAction'],
        references: [
          { title: 'Animation System', url: 'https://threejs.org/manual/#en/animation' },
          { title: 'AnimationMixer', url: 'https://threejs.org/docs/#api/en/animation/AnimationMixer' }
        ]
      },
      exercises: [
        {
          id: 'keyframe-cube',
          title: 'Keyframe Animated Cube',
          description: 'Create a bouncing, spinning cube using the Three.js animation system',
          starterCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(3, 3, 3);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xFF4D00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Add floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
scene.add(floor);

// TODO: Create position keyframes for bouncing
// Times: 0, 0.5, 1 seconds
// Y positions: 0, 2, 0
const times = [0, 0.5, 1];
const positionValues = // Your code here [x,y,z, x,y,z, x,y,z]

const positionKF = new THREE.VectorKeyframeTrack(
  '.position',
  times,
  positionValues
);

// TODO: Create rotation quaternions for spinning
const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

const rotationKF = new THREE.QuaternionKeyframeTrack(
  '.quaternion',
  times,
  // TODO: Combine quaternion values
  [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
);

// TODO: Create scale keyframes (squash at bottom, stretch at top)
const scaleValues = // Your code here

const scaleKF = new THREE.VectorKeyframeTrack(
  '.scale',
  times,
  scaleValues
);

// TODO: Create AnimationClip with all tracks
const clip = // Your code here

// TODO: Create AnimationMixer
const mixer = // Your code here

// TODO: Create and play action
const action = // Your code here
// Configure loop, play the action

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  // TODO: Update mixer with delta time
  const delta = clock.getDelta();
  
  
  renderer.render(scene, camera);
}

animate();
`,
          solutionCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(3, 3, 3);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xFF4D00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Add floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
scene.add(floor);

// Create position keyframes for bouncing
const times = [0, 0.5, 1];
const positionValues = [
  0, 0, 0,    // Start at ground
  0, 2, 0,    // Jump up
  0, 0, 0     // Back to ground
];

const positionKF = new THREE.VectorKeyframeTrack(
  '.position',
  times,
  positionValues
);

// Create rotation quaternions for spinning
const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

const rotationKF = new THREE.QuaternionKeyframeTrack(
  '.quaternion',
  times,
  [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
);

// Create scale keyframes (squash at bottom, stretch at top)
const scaleValues = [
  1.2, 0.8, 1.2,   // Squashed at start
  0.8, 1.3, 0.8,   // Stretched at top
  1.2, 0.8, 1.2    // Squashed at end
];

const scaleKF = new THREE.VectorKeyframeTrack(
  '.scale',
  times,
  scaleValues
);

// Create AnimationClip with all tracks
const clip = new THREE.AnimationClip('bounce', 1, [
  positionKF,
  rotationKF,
  scaleKF
]);

// Create AnimationMixer
const mixer = new THREE.AnimationMixer(cube);

// Create and play action
const action = mixer.clipAction(clip);
action.setLoop(THREE.LoopRepeat, Infinity);
action.play();

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  // Update mixer with delta time
  const delta = clock.getDelta();
  mixer.update(delta);
  
  renderer.render(scene, camera);
}

animate();
`,
          hints: [
            'Position values: [0,0,0, 0,2,0, 0,0,0] for bounce',
            'Quaternion.toArray() gives [x,y,z,w]',
            'Scale squash: [1.2, 0.8, 1.2], stretch: [0.8, 1.3, 0.8]',
            'mixer.update(delta) in animation loop'
          ],
          validation: { type: 'visual', checks: ['cube bouncing', 'squash and stretch', 'spinning'] }
        }
      ]
    },

    // Lesson 5.3: Simple Physics
    {
      meta: {
        id: 'simple-physics',
        title: 'Simple Physics Simulation',
        description: 'Implement basic physics without a library',
        duration: 35,
        difficulty: 'advanced',
        prerequisites: ['keyframe-animation'],
        objectives: [
          'Implement gravity and velocity',
          'Handle ground collision',
          'Add bounce damping',
          'Create multiple bouncing objects'
        ],
        tags: ['physics', 'gravity', 'velocity', 'collision']
      },
      theory: {
        markdown: `
# Simple Physics Simulation

Create basic physics without external libraries using Newtonian mechanics.

## Core Concepts

### Velocity
Rate of change of position:
\`\`\`javascript
position.y += velocity.y * deltaTime;
\`\`\`

### Acceleration (Gravity)
Rate of change of velocity:
\`\`\`javascript
velocity.y += gravity * deltaTime;
\`\`\`

## Simple Bouncing Ball

\`\`\`javascript
const ball = {
  position: new THREE.Vector3(0, 5, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  radius: 0.5
};

const gravity = -9.81;
const bounceDamping = 0.8; // Energy loss on bounce

function updatePhysics(deltaTime) {
  // Apply gravity
  ball.velocity.y += gravity * deltaTime;
  
  // Update position
  ball.position.add(ball.velocity.clone().multiplyScalar(deltaTime));
  
  // Ground collision
  const groundY = ball.radius;
  if (ball.position.y < groundY) {
    ball.position.y = groundY;
    ball.velocity.y *= -bounceDamping; // Reverse and dampen
  }
}
\`\`\`

## Multiple Objects

\`\`\`javascript
const objects = [];

for (let i = 0; i < 10; i++) {
  objects.push({
    mesh: createBall(),
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 5,
      Math.random() * 10,
      (Math.random() - 0.5) * 5
    )
  });
}

function updateAll(deltaTime) {
  objects.forEach(obj => {
    obj.velocity.y += gravity * deltaTime;
    obj.mesh.position.add(
      obj.velocity.clone().multiplyScalar(deltaTime)
    );
    // Collision check...
  });
}
\`\`\`

## Friction

\`\`\`javascript
// Air resistance (drag)
velocity.multiplyScalar(0.99);

// Ground friction (when touching)
if (onGround) {
  velocity.x *= 0.95;
  velocity.z *= 0.95;
}
\`\`\`

## Wall Bouncing

\`\`\`javascript
const bounds = 5;

if (Math.abs(position.x) > bounds) {
  position.x = Math.sign(position.x) * bounds;
  velocity.x *= -bounceDamping;
}
\`\`\`
        `,
        concepts: ['velocity', 'gravity', 'collision detection', 'bounce damping'],
        references: [
          { title: 'Basic Physics', url: 'https://gafferongames.com/post/integration_basics/' }
        ]
      },
      exercises: [
        {
          id: 'bouncing-balls',
          title: 'Bouncing Ball Simulation',
          description: 'Create a physics simulation with multiple bouncing balls',
          starterCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 5, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Create floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 12),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Create walls (visual only)
const wallMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x444444, 
  transparent: true, 
  opacity: 0.3 
});

// Physics constants
const gravity = -15;
const bounceDamping = 0.75;
const bounds = 5;

// TODO: Create array to store ball objects
const balls = [];

// Create balls
const ballGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const colors = [0xFF4D00, 0x00D4FF, 0x00FF88, 0xFFD700, 0xFF00FF];

for (let i = 0; i < 5; i++) {
  const material = new THREE.MeshStandardMaterial({ 
    color: colors[i],
    metalness: 0.3,
    roughness: 0.4
  });
  const mesh = new THREE.Mesh(ballGeometry, material);
  
  // Random starting position
  mesh.position.set(
    (Math.random() - 0.5) * 6,
    5 + Math.random() * 5,
    (Math.random() - 0.5) * 6
  );
  
  scene.add(mesh);
  
  // TODO: Create ball object with mesh and velocity
  balls.push({
    mesh: mesh,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 5,
      0,
      (Math.random() - 0.5) * 5
    ),
    radius: 0.4
  });
}

// TODO: Implement physics update function
function updatePhysics(deltaTime) {
  balls.forEach(ball => {
    // TODO: Apply gravity to velocity
    
    
    // TODO: Update position based on velocity
    
    
    // TODO: Check ground collision (y < radius)
    
    
    // TODO: Check wall collisions (x and z bounds)
    
  });
}

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const deltaTime = Math.min(clock.getDelta(), 0.1); // Cap delta time
  
  // TODO: Call physics update
  
  
  renderer.render(scene, camera);
}

animate();
`,
          solutionCode: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 5, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Create floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 12),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Physics constants
const gravity = -15;
const bounceDamping = 0.75;
const bounds = 5;

// Array to store ball objects
const balls = [];

// Create balls
const ballGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const colors = [0xFF4D00, 0x00D4FF, 0x00FF88, 0xFFD700, 0xFF00FF];

for (let i = 0; i < 5; i++) {
  const material = new THREE.MeshStandardMaterial({ 
    color: colors[i],
    metalness: 0.3,
    roughness: 0.4
  });
  const mesh = new THREE.Mesh(ballGeometry, material);
  
  // Random starting position
  mesh.position.set(
    (Math.random() - 0.5) * 6,
    5 + Math.random() * 5,
    (Math.random() - 0.5) * 6
  );
  
  scene.add(mesh);
  
  // Create ball object with mesh and velocity
  balls.push({
    mesh: mesh,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 5,
      0,
      (Math.random() - 0.5) * 5
    ),
    radius: 0.4
  });
}

// Physics update function
function updatePhysics(deltaTime) {
  balls.forEach(ball => {
    // Apply gravity to velocity
    ball.velocity.y += gravity * deltaTime;
    
    // Update position based on velocity
    ball.mesh.position.x += ball.velocity.x * deltaTime;
    ball.mesh.position.y += ball.velocity.y * deltaTime;
    ball.mesh.position.z += ball.velocity.z * deltaTime;
    
    // Check ground collision
    if (ball.mesh.position.y < ball.radius) {
      ball.mesh.position.y = ball.radius;
      ball.velocity.y *= -bounceDamping;
      
      // Apply friction on ground contact
      ball.velocity.x *= 0.98;
      ball.velocity.z *= 0.98;
    }
    
    // Check wall collisions (x bounds)
    if (Math.abs(ball.mesh.position.x) > bounds - ball.radius) {
      ball.mesh.position.x = Math.sign(ball.mesh.position.x) * (bounds - ball.radius);
      ball.velocity.x *= -bounceDamping;
    }
    
    // Check wall collisions (z bounds)
    if (Math.abs(ball.mesh.position.z) > bounds - ball.radius) {
      ball.mesh.position.z = Math.sign(ball.mesh.position.z) * (bounds - ball.radius);
      ball.velocity.z *= -bounceDamping;
    }
  });
}

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const deltaTime = Math.min(clock.getDelta(), 0.1);
  
  updatePhysics(deltaTime);
  
  renderer.render(scene, camera);
}

animate();
`,
          hints: [
            'velocity.y += gravity * deltaTime for gravity',
            'position.y += velocity.y * deltaTime for movement',
            'if (position.y < radius) { position.y = radius; velocity.y *= -bounceDamping; }',
            'Math.sign(x) returns -1, 0, or 1 based on sign'
          ],
          validation: { type: 'visual', checks: ['balls bouncing', 'wall collisions', 'slowing down over time'] }
        }
      ]
    }
  ]
};
