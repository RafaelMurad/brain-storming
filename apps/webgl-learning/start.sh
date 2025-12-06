#!/bin/bash

# Three.js Academy - Development Server Startup Script
# Starts both the backend API and frontend dev server

echo "🎓 Starting Three.js Academy..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/../../apis/threejs-academy"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

# Start backend API
echo -e "${BLUE}Starting backend API on port 3001...${NC}"
cd "$BACKEND_DIR"
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend dev server
echo -e "${GREEN}Starting frontend on port 3000...${NC}"
cd "$SCRIPT_DIR"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=============================================="
echo -e "${GREEN}✅ Three.js Academy is running!${NC}"
echo ""
echo "   📚 Learning Platform: http://localhost:3000/learning.html"
echo "   🔧 Backend API:       http://localhost:3001/api"
echo "   📖 WebGL Examples:    http://localhost:3000/"
echo ""
echo "   Press Ctrl+C to stop both servers"
echo "=============================================="
echo ""

# Wait for both processes
wait
