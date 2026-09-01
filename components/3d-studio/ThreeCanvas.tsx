'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Box, RotateCcw, Download, Layers, Sun, Eye } from 'lucide-react';

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

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const meshRef = useRef<THREE.Mesh | null>(null);

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

  // Real Three.js WebGL Renderer Engine with Dynamic Lighting & Geometry
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 460;

    // Scene & Camera setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Dynamic Shading Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa78bfa, 0.4);
    dirLight2.position.set(-5, -4, -5);
    scene.add(dirLight2);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(10, 20, 0x475569, 0x1e293b);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Create 3D Primitive Geometry based on user selection
    let geometry: THREE.BufferGeometry;
    switch (shape) {
      case 'cube':
        geometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(1.5, 32, 32);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(1.3, 0.5, 24, 48);
        break;
      case 'pyramid':
        geometry = new THREE.ConeGeometry(1.6, 2.6, 4);
        break;
      default:
        geometry = new THREE.BoxGeometry(2, 2, 2);
    }

    // Material Creation
    const material = wireframe
      ? new THREE.MeshBasicMaterial({ color, wireframe: true })
      : new THREE.MeshStandardMaterial({
          color,
          roughness: 0.35,
          metalness: 0.25,
          side: THREE.DoubleSide,
        });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(scale / 100, scale / 100, scale / 100);
    mesh.rotation.x = (rotX * Math.PI) / 180;
    mesh.rotation.y = (rotY * Math.PI) / 180;

    scene.add(mesh);
    meshRef.current = mesh;

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container || !canvas) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material.dispose();
      renderer.dispose();
    };
  }, [shape, color, wireframe, scale, rotX, rotY]);

  // Valid Triangulated STL Exporter
  const handleDownloadSTL = () => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    mesh.updateMatrixWorld(true);

    const geometry = mesh.geometry.clone().toNonIndexed();
    const positionAttr = geometry.getAttribute('position');
    const normalAttr = geometry.getAttribute('normal');

    let stl = `solid kms_3d_${shape}\n`;

    for (let i = 0; i < positionAttr.count; i += 3) {
      const v1 = new THREE.Vector3().fromBufferAttribute(positionAttr, i);
      const v2 = new THREE.Vector3().fromBufferAttribute(positionAttr, i + 1);
      const v3 = new THREE.Vector3().fromBufferAttribute(positionAttr, i + 2);

      let nx = 0, ny = 0, nz = 1;
      if (normalAttr) {
        nx = normalAttr.getX(i);
        ny = normalAttr.getY(i);
        nz = normalAttr.getZ(i);
      }

      v1.applyMatrix4(mesh.matrixWorld);
      v2.applyMatrix4(mesh.matrixWorld);
      v3.applyMatrix4(mesh.matrixWorld);

      stl += `  facet normal ${nx.toFixed(6)} ${ny.toFixed(6)} ${nz.toFixed(6)}\n`;
      stl += `    outer loop\n`;
      stl += `      vertex ${v1.x.toFixed(6)} ${v1.y.toFixed(6)} ${v1.z.toFixed(6)}\n`;
      stl += `      vertex ${v2.x.toFixed(6)} ${v2.y.toFixed(6)} ${v2.z.toFixed(6)}\n`;
      stl += `      vertex ${v3.x.toFixed(6)} ${v3.y.toFixed(6)} ${v3.z.toFixed(6)}\n`;
      stl += `    endloop\n`;
      stl += `  endfacet\n`;
    }

    stl += `endsolid kms_3d_${shape}\n`;

    const blob = new Blob([stl], { type: 'model/stl' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `kms_3d_${shape}.stl`;
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

      {/* Center WebGL 3D Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 bg-[#0F172A] rounded-2xl border-2 border-slate-800 shadow-xl overflow-hidden flex flex-col items-center justify-center p-3 relative min-h-[420px]"
      >
        <div className="absolute top-3 left-4 text-xs font-mono text-slate-400 flex items-center gap-2 z-10">
          <span>Rotate: Drag Mouse</span>
          <span>·</span>
          <span>Mesh: {shape.toUpperCase()}</span>
          <span>·</span>
          <span className="text-emerald-400">Three.js WebGL Engine</span>
        </div>

        <canvas
          ref={canvasRef}
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
