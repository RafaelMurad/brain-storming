/**
 * Three.js Professional Background Scene
 * Creates an elegant, subtle 3D environment with floating particles
 * Inspired by Awwwards-winning immersive websites
 */

import * as THREE from 'three';
import { gsap } from 'gsap';

export class SceneBackground {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particles: THREE.Points | null = null;
  private geometryMeshes: THREE.Mesh[] = [];
  private mouse = { x: 0, y: 0 };
  private targetMouse = { x: 0, y: 0 };
  private clock = new THREE.Clock();
  private animationId: number | null = null;

  constructor(container: HTMLElement) {
    // Scene setup
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 50;

    // Renderer with high quality settings
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x0a0a0a, 1);
    container.appendChild(this.renderer.domElement);

    // Style the canvas
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.zIndex = '-1';
    this.renderer.domElement.style.pointerEvents = 'none';

    this.createParticleField();
    this.createFloatingLines();
    this.setupEventListeners();
    this.animate();
  }

  private createParticleField(): void {
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const opacities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Spread particles in a large volume
      positions[i3] = (Math.random() - 0.5) * 150;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 80 - 20;

      // Varying opacity for depth
      opacities[i] = Math.random() * 0.5 + 0.1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    // Create custom shader material for elegant particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xff4d00) },
        uSize: { value: 2.0 },
      },
      vertexShader: `
        attribute float opacity;
        varying float vOpacity;
        uniform float uTime;
        uniform float uSize;
        
        void main() {
          vOpacity = opacity;
          
          vec3 pos = position;
          // Subtle floating motion
          pos.y += sin(uTime * 0.3 + position.x * 0.05) * 0.5;
          pos.x += cos(uTime * 0.2 + position.y * 0.05) * 0.3;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = uSize * (50.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        uniform vec3 uColor;
        
        void main() {
          // Soft circular particle
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.0, dist) * vOpacity * 0.4;
          
          // Mix between white and accent color
          vec3 color = mix(vec3(1.0), uColor, 0.3);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private createFloatingLines(): void {
    // Create subtle floating geometric elements
    const lineGroup = new THREE.Group();

    // Thin line geometry
    for (let i = 0; i < 8; i++) {
      const points = [];
      const length = Math.random() * 30 + 20;
      points.push(new THREE.Vector3(-length / 2, 0, 0));
      points.push(new THREE.Vector3(length / 2, 0, 0));

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.3,
      });

      const line = new THREE.Line(geometry, material);
      line.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40 - 30
      );
      line.rotation.z = Math.random() * Math.PI;

      line.userData = {
        rotationSpeed: (Math.random() - 0.5) * 0.002,
        floatSpeed: Math.random() * 0.3 + 0.2,
        floatOffset: Math.random() * Math.PI * 2,
        originalY: line.position.y,
      };

      this.geometryMeshes.push(line as unknown as THREE.Mesh);
      lineGroup.add(line);
    }

    // Add subtle rings
    for (let i = 0; i < 4; i++) {
      const geometry = new THREE.TorusGeometry(
        Math.random() * 3 + 2,
        0.02,
        8,
        32
      );
      const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xff4d00 : 0x333333,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
      });

      const ring = new THREE.Mesh(geometry, material);
      ring.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30 - 20
      );
      ring.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      ring.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.005,
          y: (Math.random() - 0.5) * 0.005,
          z: (Math.random() - 0.5) * 0.005,
        },
        floatSpeed: Math.random() * 0.4 + 0.2,
        floatOffset: Math.random() * Math.PI * 2,
        originalY: ring.position.y,
      };

      this.geometryMeshes.push(ring);
      lineGroup.add(ring);
    }

    this.scene.add(lineGroup);
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onMouseMove(event: MouseEvent): void {
    this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    const time = this.clock.getElapsedTime();

    // Smooth mouse following
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.03;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.03;

    // Update particle shader time
    if (this.particles) {
      const material = this.particles.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = time;

      // Very subtle rotation
      this.particles.rotation.y = time * 0.01;
    }

    // Animate floating elements
    this.geometryMeshes.forEach((mesh) => {
      const { rotationSpeed, floatSpeed, floatOffset, originalY } = mesh.userData;

      if (typeof rotationSpeed === 'object') {
        mesh.rotation.x += rotationSpeed.x;
        mesh.rotation.y += rotationSpeed.y;
        mesh.rotation.z += rotationSpeed.z;
      } else {
        mesh.rotation.z += rotationSpeed;
      }

      // Gentle floating
      mesh.position.y = originalY + Math.sin(time * floatSpeed + floatOffset) * 1;
    });

    // Camera subtle parallax based on mouse
    this.camera.position.x = this.mouse.x * 5;
    this.camera.position.y = this.mouse.y * 3;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  };

  public pulseEffect(): void {
    // Subtle pulse on interaction
    if (this.particles) {
      const material = this.particles.material as THREE.ShaderMaterial;
      gsap.to(material.uniforms.uSize, {
        value: 3.5,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });
    }

    // Pulse the rings
    this.geometryMeshes
      .filter((m) => m instanceof THREE.Mesh)
      .forEach((mesh, index) => {
        gsap.to(mesh.scale, {
          x: 1.2,
          y: 1.2,
          z: 1.2,
          duration: 0.4,
          delay: index * 0.05,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
        });
      });
  }

  public destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onResize.bind(this));
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.renderer.dispose();
  }
}
