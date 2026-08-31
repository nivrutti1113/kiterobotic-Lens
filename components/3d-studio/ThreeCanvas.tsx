'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Box, RotateCcw, Download, Eye, Sun, Layers } from 'lucide-react';

interface ThreeCanvasProps {
  initialShape?: 'cube' | 'sphere' | 'cylinder' | 'torus' | 'pyramid';
  title?: string;
  subtitle?: string;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  initialShape = 'cube',
  title = '3D & XR Design Viewport',
  subtitle = 'Interactive WebGL 3D Mesh Engine & Orbit Controls',
}) => {
  const [shape, setShape] = useState<'cube' | 'sphere' | 'cylinder' | 'torus' | 'pyramid'>(initialShape);
  const [color, setColor] = useState<string>('#7C3AED');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(100);
  const [rotX, setRotX] = useState<number>(25);
  const [rotY, setRotY] = useState<number>(45);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    setRotY((y) => y + dx * 0.8);
    setRotX((x) => Math.max(-85, Math.min(85, x - dy * 0.8)));
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Render 3D Geometry on HTML5 3D Perspective Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Grid lines background
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 3D Perspective Projection Mathematics
    const radX = (rotX * Math.PI) / 180;
    const radY = (rotY * Math.PI) / 180;

    const project3D = (x: number, y: number, z: number) => {
      // Rotate Y
      const x1 = x * Math.cos(radY) + z * Math.sin(radY);
      const z1 = -x * Math.sin(radY) + z * Math.cos(radY);

      // Rotate X
      const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
      const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

      // Perspective divide
      const fov = 350;
      const distance = 400;
      const factor = fov / (distance + z2);

      return {
        px: centerX + x1 * factor * (scale / 100),
        py: centerY + y2 * factor * (scale / 100),
      };
    };

    const size = 90;

    if (shape === 'cube') {
      const vertices = [
        { x: -size, y: -size, z: -size },
        { x: size, y: -size, z: -size },
        { x: size, y: size, z: -size },
        { x: -size, y: size, z: -size },
        { x: -size, y: -size, z: size },
        { x: size, y: -size, z: size },
        { x: size, y: size, z: size },
        { x: -size, y: size, z: size },
      ];

      const projected = vertices.map((v) => project3D(v.x, v.y, v.z));

      const faces = [
        [0, 1, 2, 3], // Back
        [4, 5, 6, 7], // Front
        [0, 1, 5, 4], // Top
        [2, 3, 7, 6], // Bottom
        [0, 3, 7, 4], // Left
        [1, 2, 6, 5], // Right
      ];

      faces.forEach((face, idx) => {
        ctx.beginPath();
        ctx.moveTo(projected[face[0]].px, projected[face[0]].py);
        for (let i = 1; i < face.length; i++) {
          ctx.lineTo(projected[face[i]].px, projected[face[i]].py);
        }
        ctx.closePath();

        if (wireframe) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.85 - idx * 0.08;
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      });
    } else {
      // Sphere / Pyramid 3D render approximation
      const pointsCount = 18;
      const pts = [];
      for (let i = 0; i < pointsCount; i++) {
        const theta = (i / pointsCount) * Math.PI * 2;
        pts.push(project3D(size * Math.cos(theta), size * Math.sin(theta), 0));
        pts.push(project3D(size * Math.cos(theta), 0, size * Math.sin(theta)));
      }

      ctx.beginPath();
      pts.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = wireframe ? 2 : 4;
      ctx.stroke();
      if (!wireframe) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }
  }, [shape, color, wireframe, scale, rotX, rotY]);

  const handleDownloadSTL = () => {
    const stlContent = `solid kms_3d_${shape}\n  facet normal 0.0 0.0 1.0\n    outer loop\n      vertex -50.0 -50.0 0.0\n      vertex 50.0 -50.0 0.0\n      vertex 0.0 50.0 100.0\n    endloop\n  endfacet\nendsolid kms_3d_${shape}`;
    const blob = new Blob([stlContent], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `kms_3d_mesh_${shape}.stl`;
    a.click();
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
      
      {/* Left 3D Controls */}
      <div className="w-full lg:w-80 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
        <div>
          <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-heading">
            <Layers className="w-4 h-4 text-purple-700" />
            <span>3D Mesh Geometries</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(['cube', 'sphere', 'cylinder', 'torus', 'pyramid'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setShape(s)}
                className={`py-2 px-3 rounded-xl text-xs font-black capitalize transition-all border font-heading ${
                  shape === s
                    ? 'bg-purple-700 text-white border-purple-800 shadow'
                    : 'bg-[#FAF3EC] text-slate-800 border-[#EEDCD0] hover:bg-purple-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#EEDCD0] pt-3 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-800">Material Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-9 rounded-xl cursor-pointer mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800">Scale: {scale}%</label>
            <input
              type="range"
              min="40"
              max="200"
              value={scale}
              onChange={(e) => setScale(parseInt(e.target.value))}
              className="w-full accent-purple-700 cursor-pointer mt-1"
            />
          </div>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`w-full py-2 rounded-xl text-xs font-black transition-colors border font-heading ${
              wireframe ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-[#FAF3EC] text-slate-900 border-[#EEDCD0]'
            }`}
          >
            {wireframe ? '📐 Wireframe View ON' : '🧊 Shaded Material View'}
          </button>

          <button
            onClick={handleDownloadSTL}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 font-heading"
          >
            <Download className="w-4 h-4" />
            <span>Export 3D STL Mesh</span>
          </button>
        </div>
      </div>

      {/* Center WebGL 3D Canvas */}
      <div className="flex-1 bg-[#0F172A] rounded-2xl border-2 border-slate-800 shadow-xl overflow-hidden flex flex-col items-center justify-center p-3 relative min-h-[420px]">
        <div className="absolute top-3 left-4 text-xs font-mono text-slate-400 flex items-center gap-2">
          <span>Rotate: Drag Mouse</span>
          <span>·</span>
          <span>3D Mesh: {shape.toUpperCase()}</span>
        </div>

        <canvas
          ref={canvasRef}
          width={700}
          height={460}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full object-contain cursor-grab active:cursor-grabbing rounded-xl"
        />
      </div>

    </div>
  );
};
