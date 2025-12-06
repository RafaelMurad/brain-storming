# 🎨 Three.js Academy

A comprehensive, interactive learning platform for mastering 3D graphics with Three.js. Features a complete curriculum with guided lessons, hands-on exercises, and progress tracking.

## 🌟 Features

### Learning Platform (Three.js Academy)
- **6 Learning Modules** - From fundamentals to advanced shaders
- **30+ Interactive Lessons** - Theory, code examples, and exercises
- **Monaco Code Editor** - Professional IDE experience with Three.js intellisense
- **Live 3D Preview** - See your code run in real-time
- **GitHub OAuth Login** - Sign in with GitHub to sync progress
- **Progress Tracking** - Syncs across devices
- **Achievement System** - Unlock badges as you learn

### WebGL Studio (Experimental Sandbox)
- **10+ WebGL Examples** - From basic triangles to advanced lighting
- **Progressive Learning Path** - Basic → Intermediate → Advanced
- **Hands-on Experimentation** - Modify code and see results instantly

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Modern browser with WebGL support (Chrome, Firefox, Edge, Safari)

### Installation

```bash
# Navigate to the project directory
cd apps/webgl-learning

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### With Backend (for progress sync)

```bash
# Terminal 1: Start the API
cd apis/threejs-academy
npm run setup  # First time only
npm run dev

# Terminal 2: Start the frontend
cd apps/webgl-learning
npm run dev
```

## 📚 Curriculum

### Module 1: 🎯 Fundamentals
- Your First Scene (Scene, Camera, Renderer)
- Creating 3D Objects (Meshes, Geometries, Materials)
- The Animation Loop
- Handling Window Resize

### Module 2: 📦 Geometries & Materials
- Built-in Geometries (Box, Sphere, Plane, etc.)
- Material Types (Basic, Standard, Physical)
- Combining Objects with Groups
- Debug with lil-gui

### Module 3: 🖼️ Textures & Lighting
- Loading Textures
- UV Mapping
- Light Types (Ambient, Directional, Point, Spot)
- Shadows

### Module 4: 🎥 Cameras & Controls
- Camera Types
- OrbitControls
- Custom Camera Animations
- Raycasting & Interaction

### Module 5: 🎬 Animation & Physics
- GSAP Integration
- Keyframe Animations
- Basic Physics Concepts
- Interactive Animations

### Module 6: ✨ Shaders & Post-Processing
- Introduction to GLSL
- Custom Shaders
- Post-Processing Effects
- Advanced Techniques

## 🛠️ Project Structure

```
webgl-learning/
├── src/
│   ├── api/             # API client for backend
│   ├── curriculum/      # Lesson content and modules
│   ├── editor/          # Monaco editor integration
│   ├── examples/        # WebGL Studio examples
│   │   ├── basic/       # Beginner examples
│   │   ├── intermediate/
│   │   └── advanced/
│   ├── sandbox/         # 3D preview sandbox
│   ├── utils/           # Helper functions
│   ├── app.ts           # Learning app logic
│   ├── learning.ts      # Academy entry point
│   └── main.ts          # WebGL Studio entry point
├── public/              # Static assets
├── index.html           # WebGL Studio
├── learning.html        # Three.js Academy
└── package.json
```

## 🎮 Navigation

The platform has two main sections:

1. **Three.js Academy** (`/learning.html`) - Structured learning with lessons and exercises
2. **WebGL Studio** (`/index.html`) - Experimental sandbox for raw WebGL

Use the navigation bar at the top to switch between them.

## 🔐 Authentication

The platform uses GitHub OAuth for authentication:

1. Click "Sign in with GitHub" button
2. Authorize the application
3. Your progress will sync automatically

Progress is stored locally even without login, but GitHub login enables:
- Cross-device sync
- Achievement tracking
- Cloud backup of your notes and code

## �� What You'll Learn

### Three.js Concepts
- Scene graph and object hierarchy
- Cameras and projections
- Materials and textures
- Lighting and shadows
- Animation and physics
- Custom shaders (GLSL)

### WebGL Fundamentals
- Rendering pipeline
- Vertex and fragment shaders
- Buffers and attributes
- Matrices and transformations

## 💡 Tips for Learning

1. **Follow the curriculum** - Lessons build on each other
2. **Complete exercises** - Practice solidifies concepts
3. **Experiment freely** - Break things and learn why
4. **Read the theory** - Understanding "why" matters
5. **Use the preview** - See changes in real-time

## 🐛 Troubleshooting

### Canvas is blank
- Check browser console for WebGL errors
- Ensure WebGL is enabled in your browser
- Try refreshing the page

### Code doesn't run
- Check for syntax errors in console
- Ensure Three.js is imported correctly
- Verify object names match

### Progress not syncing
- Sign in with GitHub
- Check if API server is running (port 3001)
- Clear localStorage and re-login

## 🌐 Browser Compatibility

- Chrome 80+ ✅
- Firefox 75+ ✅
- Safari 14+ ✅
- Edge 80+ ✅

## 🛠️ Tech Stack

- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Three.js** - 3D graphics library
- **Monaco Editor** - Code editor
- **GSAP** - Animations

## 📄 License

MIT License - Free for educational purposes

---

**Happy Learning! 🎨✨**

Start your 3D graphics journey at [learning.html](learning.html)!
