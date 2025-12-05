# 🎨 WebGL Learning Journey

A comprehensive, hands-on WebGL learning project designed to take you from beginner to advanced through interactive examples and detailed tutorials.

## 🌟 Features

- **10+ Interactive Examples** - From basic triangles to advanced lighting and particle systems
- **Progressive Learning Path** - Organized from basic → intermediate → advanced
- **Hands-on Experimentation** - Modify code and see results instantly
- **Modern Tech Stack** - Built with Vite, TypeScript, and latest WebGL practices
- **Comprehensive Documentation** - Detailed tutorials and explanations
- **Official Resources** - Curated learning materials from trusted sources

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Modern browser with WebGL support (Chrome, Firefox, Edge, Safari)

### Installation

\`\`\`bash
# Navigate to the project directory
cd apps/webgl-learning

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

The app will open automatically at `http://localhost:3000`

### Building for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## 📚 Learning Path

### 🟢 Basic (Start Here!)

1. **Simple Triangle** - The "Hello World" of WebGL
2. **Colored Triangle** - Learn vertex colors and interpolation
3. **Square with Indices** - Efficient rendering with index buffers
4. **Rotating Triangle** - Animation loops and uniforms

### 🟡 Intermediate

5. **Texture Mapping** - Apply images to geometry
6. **2D Transformations** - Interactive translation, rotation, scaling
7. **3D Cube** - Perspective projection and depth testing

### 🔴 Advanced

8. **Phong Lighting** - Realistic lighting model
9. **Particle System** - 1000+ dynamic particles
10. **Procedural Terrain** - Noise-based landscape generation

## 🛠️ Project Structure

\`\`\`
webgl-learning/
├── src/
│   ├── examples/
│   │   ├── basic/           # Beginner examples
│   │   ├── intermediate/    # Intermediate examples
│   │   └── advanced/        # Advanced examples
│   ├── utils/
│   │   ├── webgl-utils.ts   # WebGL helper functions
│   │   └── matrix.ts        # Matrix and vector math
│   └── main.ts              # Application entry point
├── docs/
│   ├── GETTING_STARTED.md   # Beginner's guide
│   ├── SHADER_GUIDE.md      # Understanding shaders
│   ├── MATH_CONCEPTS.md     # 3D math explained
│   └── RESOURCES.md         # Learning resources
├── public/                  # Static assets
├── index.html               # Main HTML file
└── package.json
\`\`\`

## 🎯 What You'll Learn

### Core WebGL Concepts

- WebGL rendering pipeline
- Vertex and fragment shaders (GLSL)
- Buffers and vertex attributes
- Drawing primitives
- Texture mapping
- Transformations and matrices

### 3D Graphics Fundamentals

- Coordinate systems (clip space, world space)
- Model-View-Projection (MVP) matrices
- Perspective projection
- Depth testing and culling
- Lighting models (Phong)
- Normal vectors

### Advanced Techniques

- Particle systems
- Procedural generation
- Blending and transparency
- Animation techniques
- Performance optimization
- Shader programming

## 🎓 Documentation

- **[Getting Started Guide](docs/GETTING_STARTED.md)** - Comprehensive introduction to WebGL
- **[Shader Programming Guide](docs/SHADER_GUIDE.md)** - Master GLSL shaders
- **[3D Math Concepts](docs/MATH_CONCEPTS.md)** - Vectors, matrices, and transformations
- **[Resources & Tutorials](docs/RESOURCES.md)** - Curated learning materials

## 💡 Tips for Learning

1. **Start from the beginning** - Even if you have some experience, the basics are crucial
2. **Experiment with code** - Change values, colors, positions to see what happens
3. **Read the descriptions** - Each example includes detailed explanations
4. **Use browser DevTools** - Inspect shader compilation errors and debug
5. **Take breaks** - 3D graphics can be mentally intensive
6. **Build your own** - After completing examples, create your own projects

## 🔧 Customization

### Adding Your Own Examples

Create a new file in the appropriate difficulty folder:

\`\`\`typescript
// src/examples/basic/my-example.ts
import { WebGLUtils } from '@/utils/webgl-utils';
import type { Example } from './01-triangle';

export const MyExample: Example = {
  init(canvas: HTMLCanvasElement) {
    // Your WebGL code here
  },

  getDescription() {
    return \`<h3>My Example</h3><p>Description here</p>\`;
  }
};
\`\`\`

Then add it to `src/main.ts` in the examples array.

## 🐛 Troubleshooting

### Canvas is blank
- Check browser console for errors
- Ensure WebGL is supported in your browser
- Check shader compilation errors

### Performance issues
- Reduce particle count in particle system
- Lower terrain grid size
- Close other browser tabs

### TypeScript errors
- Run `npm install` to ensure dependencies are installed
- Check TypeScript version compatibility

## 🌐 Browser Compatibility

- Chrome 56+ ✅
- Firefox 51+ ✅
- Safari 11+ ✅
- Edge 79+ ✅

WebGL 1.0 required (WebGL 2.0 features not used for maximum compatibility)

## 📖 Additional Resources

See [RESOURCES.md](docs/RESOURCES.md) for:
- Official WebGL documentation
- Video tutorials
- Books and courses
- Community forums
- Advanced topics

## 🤝 Contributing

This is a learning project! Feel free to:
- Add new examples
- Improve documentation
- Fix bugs
- Enhance existing examples

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

Built with knowledge from:
- WebGL Fundamentals (webglfundamentals.org)
- MDN Web Docs
- Khronos Group specifications
- The amazing WebGL community

---

**Happy Learning! 🎨✨**

Questions? Check the [documentation](docs/) or experiment with the code!
