/**
 * WebGL Learning Project - Main Entry Point
 * This file manages the example gallery and navigation.
 */

import type { Example } from './examples/basic/01-triangle';

// Import all examples
import { TriangleExample } from './examples/basic/01-triangle';
import { ColoredTriangleExample } from './examples/basic/02-colored-triangle';
import { SquareExample } from './examples/basic/03-square';
import { AnimationExample } from './examples/basic/04-animation';
import { TextureExample } from './examples/intermediate/01-texture';
import { TransformationsExample } from './examples/intermediate/02-transformations';
import { Cube3DExample } from './examples/intermediate/03-cube-3d';
import { LightingExample } from './examples/advanced/01-lighting';
import { ParticleSystemExample } from './examples/advanced/02-particle-system';
import { ProceduralTerrainExample } from './examples/advanced/03-procedural-terrain';

interface ExampleDefinition {
  id: string;
  name: string;
  description: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  example: Example;
}

const examples: ExampleDefinition[] = [
  // Basic examples
  {
    id: 'triangle',
    name: '01. Simple Triangle',
    description: 'The "Hello World" of WebGL - draw your first triangle',
    difficulty: 'basic',
    example: TriangleExample
  },
  {
    id: 'colored-triangle',
    name: '02. Colored Triangle',
    description: 'Learn vertex colors and varying interpolation',
    difficulty: 'basic',
    example: ColoredTriangleExample
  },
  {
    id: 'square',
    name: '03. Square with Indices',
    description: 'Build complex shapes using index buffers',
    difficulty: 'basic',
    example: SquareExample
  },
  {
    id: 'animation',
    name: '04. Rotating Triangle',
    description: 'Animation loop and uniform variables',
    difficulty: 'basic',
    example: AnimationExample
  },
  // Intermediate examples
  {
    id: 'texture',
    name: '05. Texture Mapping',
    description: 'Apply images to geometry with UV coordinates',
    difficulty: 'intermediate',
    example: TextureExample
  },
  {
    id: 'transformations',
    name: '06. 2D Transformations',
    description: 'Interactive translation, rotation, and scaling',
    difficulty: 'intermediate',
    example: TransformationsExample
  },
  {
    id: 'cube-3d',
    name: '07. 3D Cube',
    description: 'Introduction to 3D with perspective projection',
    difficulty: 'intermediate',
    example: Cube3DExample
  },
  // Advanced examples
  {
    id: 'lighting',
    name: '08. Phong Lighting',
    description: 'Realistic lighting with ambient, diffuse, and specular',
    difficulty: 'advanced',
    example: LightingExample
  },
  {
    id: 'particles',
    name: '09. Particle System',
    description: 'Dynamic particle effects with 1000+ particles',
    difficulty: 'advanced',
    example: ParticleSystemExample
  },
  {
    id: 'terrain',
    name: '10. Procedural Terrain',
    description: 'Generate landscapes using noise algorithms',
    difficulty: 'advanced',
    example: ProceduralTerrainExample
  }
];

class App {
  private currentExample: Example | null = null;
  private canvas: HTMLCanvasElement;
  private examplesContainer: HTMLElement;
  private canvasContainer: HTMLElement;
  private currentCategory: string = 'all';

  constructor() {
    this.canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
    this.examplesContainer = document.getElementById('examples-container')!;
    this.canvasContainer = document.getElementById('canvas-container')!;

    this.initNavigation();
    this.renderExamples();
  }

  private initNavigation(): void {
    const navTabs = document.querySelectorAll('.nav-tab');

    navTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const category = target.dataset.category!;

        // Handle documentation tab
        if (category === 'docs') {
          window.open('docs/GETTING_STARTED.md', '_blank');
          return;
        }

        navTabs.forEach(t => t.classList.remove('active'));
        target.classList.add('active');

        this.currentCategory = category;
        this.renderExamples();
      });
    });

    const backButton = document.getElementById('back-button')!;
    backButton.addEventListener('click', () => {
      this.closeExample();
    });
  }

  private renderExamples(): void {
    this.examplesContainer.innerHTML = '';

    const filteredExamples = this.currentCategory === 'all'
      ? examples
      : examples.filter(ex => ex.difficulty === this.currentCategory);

    filteredExamples.forEach(exampleDef => {
      const card = document.createElement('div');
      card.className = 'example-card';
      card.innerHTML = `
        <h3>${exampleDef.name}</h3>
        <p>${exampleDef.description}</p>
        <span class="difficulty ${exampleDef.difficulty}">${exampleDef.difficulty}</span>
      `;

      card.addEventListener('click', () => {
        this.loadExample(exampleDef);
      });

      this.examplesContainer.appendChild(card);
    });
  }

  private loadExample(exampleDef: ExampleDefinition): void {
    // Clean up previous example
    this.closeExample();

    // Show canvas container
    this.examplesContainer.style.display = 'none';
    this.canvasContainer.classList.add('active');

    // Set title and description
    document.getElementById('example-title')!.textContent = exampleDef.name;
    document.getElementById('example-description')!.innerHTML =
      exampleDef.example.getDescription();

    // Set up controls if available
    const controlsContainer = document.getElementById('controls-container')!;
    if (exampleDef.example.getControls) {
      const controls = exampleDef.example.getControls();
      if (controls) {
        controlsContainer.innerHTML = '';
        controlsContainer.appendChild(controls);
        controlsContainer.style.display = 'block';
      } else {
        controlsContainer.style.display = 'none';
      }
    } else {
      controlsContainer.style.display = 'none';
    }

    // Initialize the example
    this.currentExample = exampleDef.example;
    this.currentExample.init(this.canvas);
  }

  private closeExample(): void {
    if (this.currentExample?.cleanup) {
      this.currentExample.cleanup();
    }

    this.currentExample = null;
    this.canvasContainer.classList.remove('active');
    this.examplesContainer.style.display = 'grid';

    // Clear canvas
    const gl = this.canvas.getContext('webgl');
    if (gl) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
  }
}

// Initialize the app
new App();

console.log('🎨 WebGL Learning Project initialized!');
console.log('📚 Check out the documentation for tutorials and resources');
