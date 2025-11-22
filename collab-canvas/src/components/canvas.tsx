"use client";

import { useRef, useEffect, useCallback } from "react";
import { useCanvasStore, Shape, Point } from "@/lib/store";
import { throttle } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    shapes,
    currentTool,
    strokeColor,
    strokeWidth,
    isDrawing,
    setDrawing,
    currentShape,
    setCurrentShape,
    addShape,
    updateShape,
    removeShape,
    ws,
    clientId,
    users,
  } = useCanvasStore();

  const startPointRef = useRef<Point | null>(null);

  // Draw all shapes
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing shapes
    [...shapes, currentShape].filter(Boolean).forEach((shape) => {
      if (!shape) return;
      drawShape(ctx, shape);
    });
  }, [shapes, currentShape]);

  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (shape.type) {
      case "path":
        if (shape.points && shape.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(shape.points[0].x, shape.points[0].y);
          for (let i = 1; i < shape.points.length; i++) {
            const p1 = shape.points[i - 1];
            const p2 = shape.points[i];
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
          }
          ctx.stroke();
        }
        break;

      case "rect":
        if (shape.x !== undefined && shape.y !== undefined && shape.width !== undefined && shape.height !== undefined) {
          ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
          if (shape.fill) {
            ctx.fillStyle = shape.fill;
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
          }
        }
        break;

      case "circle":
        if (shape.x !== undefined && shape.y !== undefined && shape.radius !== undefined) {
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
          ctx.stroke();
          if (shape.fill) {
            ctx.fillStyle = shape.fill;
            ctx.fill();
          }
        }
        break;

      case "line":
        if (shape.points && shape.points.length === 2) {
          ctx.beginPath();
          ctx.moveTo(shape.points[0].x, shape.points[0].y);
          ctx.lineTo(shape.points[1].x, shape.points[1].y);
          ctx.stroke();
        }
        break;

      case "arrow":
        if (shape.points && shape.points.length === 2) {
          const [start, end] = shape.points;
          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          const headLength = 20;

          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();

          // Arrow head
          ctx.beginPath();
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(
            end.x - headLength * Math.cos(angle - Math.PI / 6),
            end.y - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(
            end.x - headLength * Math.cos(angle + Math.PI / 6),
            end.y - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
        break;

      case "text":
        if (shape.text && shape.x !== undefined && shape.y !== undefined) {
          ctx.font = `${shape.strokeWidth * 6}px sans-serif`;
          ctx.fillStyle = shape.color;
          ctx.fillText(shape.text, shape.x, shape.y);
        }
        break;
    }
  };

  // Resize canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  // Redraw when shapes change
  useEffect(() => {
    draw();
  }, [draw]);

  // Send cursor position
  const sendCursorPosition = throttle((position: Point) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "cursor-move", position }));
    }
  }, 50);

  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.MouseEvent) => {
    if (currentTool === "select") return;

    const point = getCanvasPoint(e);
    startPointRef.current = point;
    setDrawing(true);

    const shapeId = uuidv4();

    if (currentTool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        const newShape: Shape = {
          id: shapeId,
          type: "text",
          text,
          x: point.x,
          y: point.y,
          color: strokeColor,
          strokeWidth,
          userId: clientId || "",
          createdAt: Date.now(),
        };
        addShape(newShape);

        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: "draw-start",
            shapeId,
            shapeType: "text",
            text,
            x: point.x,
            y: point.y,
            color: strokeColor,
            strokeWidth,
          }));
        }
      }
      setDrawing(false);
      return;
    }

    let shapeType: Shape["type"] = "path";
    if (currentTool === "rect") shapeType = "rect";
    else if (currentTool === "circle") shapeType = "circle";
    else if (currentTool === "line") shapeType = "line";
    else if (currentTool === "arrow") shapeType = "arrow";

    const newShape: Shape = {
      id: shapeId,
      type: shapeType,
      points: shapeType === "path" ? [point] : [point, point],
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
      radius: 0,
      color: strokeColor,
      strokeWidth,
      userId: clientId || "",
      createdAt: Date.now(),
    };

    setCurrentShape(newShape);
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    const point = getCanvasPoint(e);
    sendCursorPosition(point);

    if (!isDrawing || !currentShape || !startPointRef.current) return;

    const start = startPointRef.current;

    if (currentTool === "pen" || currentTool === "eraser") {
      setCurrentShape({
        ...currentShape,
        points: [...(currentShape.points || []), point],
      });
    } else if (currentTool === "rect") {
      setCurrentShape({
        ...currentShape,
        x: Math.min(start.x, point.x),
        y: Math.min(start.y, point.y),
        width: Math.abs(point.x - start.x),
        height: Math.abs(point.y - start.y),
      });
    } else if (currentTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(point.x - start.x, 2) + Math.pow(point.y - start.y, 2)
      );
      setCurrentShape({
        ...currentShape,
        radius,
      });
    } else if (currentTool === "line" || currentTool === "arrow") {
      setCurrentShape({
        ...currentShape,
        points: [start, point],
      });
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing || !currentShape) {
      setDrawing(false);
      return;
    }

    // Handle eraser
    if (currentTool === "eraser" && currentShape.points) {
      // Check for intersections with existing shapes and remove them
      const eraserPath = currentShape.points;
      shapes.forEach((shape) => {
        if (shape.points) {
          const intersects = shape.points.some((p) =>
            eraserPath.some(
              (ep) => Math.abs(p.x - ep.x) < 20 && Math.abs(p.y - ep.y) < 20
            )
          );
          if (intersects) {
            removeShape(shape.id);
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "shape-delete", shapeId: shape.id }));
            }
          }
        }
      });
    } else {
      addShape(currentShape);

      // Send to server
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: "draw-start",
          shapeId: currentShape.id,
          shapeType: currentShape.type,
          points: currentShape.points,
          x: currentShape.x,
          y: currentShape.y,
          width: currentShape.width,
          height: currentShape.height,
          radius: currentShape.radius,
          color: currentShape.color,
          strokeWidth: currentShape.strokeWidth,
        }));
      }
    }

    setCurrentShape(null);
    setDrawing(false);
    startPointRef.current = null;
  };

  // Draw other users' cursors
  const renderCursors = () => {
    return users
      .filter((u) => u.id !== clientId && u.cursor)
      .map((user) => (
        <div
          key={user.id}
          className="user-cursor"
          style={{
            left: user.cursor!.x,
            top: user.cursor!.y,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={user.color}>
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L5.97 2.35c-.34-.34-.47.86-.47.86z" />
          </svg>
          <div
            className="user-label text-white"
            style={{ backgroundColor: user.color }}
          >
            {user.username}
          </div>
        </div>
      ));
  };

  return (
    <div ref={containerRef} className="canvas-container w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
      />
      {renderCursors()}
    </div>
  );
}
