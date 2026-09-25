import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Database, Cpu, Server, Layers, Cloud, Activity, Sparkles, Box } from 'lucide-react';

/**
 * ThreeHero3DVisual Component
 * High-performance Three.js WebGL 3D Interactive Enterprise Ecosystem Visual.
 * Replaces static 2D diagrams with a real 3D rotating core, orbital rings, and interactive nodes.
 */
export default function ThreeHero3DVisual() {
  const mountRef = useRef(null);
  const [activeNode, setActiveNode] = useState(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 380;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLightSky = new THREE.PointLight(0x0ea5e9, 3.5, 50);
    pointLightSky.position.set(10, 10, 10);
    scene.add(pointLightSky);

    const pointLightCyan = new THREE.PointLight(0x38bdf8, 2.5, 50);
    pointLightCyan.position.set(-10, -10, 10);
    scene.add(pointLightCyan);

    const pointLightGreen = new THREE.PointLight(0x10b981, 2.0, 50);
    pointLightGreen.position.set(0, 12, -10);
    scene.add(pointLightGreen);

    // 3. Central 3D Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 3a. Inner Glowing Polyhedron (Icosahedron)
    const innerGeo = new THREE.IcosahedronGeometry(2.8, 1);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x0ea5e9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
      shininess: 90,
      flatShading: true,
      transparent: true,
      opacity: 0.9
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 3b. Outer Wireframe Geometry
    const outerGeo = new THREE.IcosahedronGeometry(3.6, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // 3c. Orbiting 3D Torus Rings
    const ringGeo1 = new THREE.TorusGeometry(5.2, 0.06, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.6
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(6.4, 0.05, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // 3d. 3D Particle Starfield Sphere
    const particleCount = prefersReducedMotion ? 40 : 120;
    const pGeometry = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 7.5 + Math.random() * 4.5;

      pPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = r * Math.cos(phi);
    }

    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.18,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8
    });

    const particles = new THREE.Points(pGeometry, pMaterial);
    coreGroup.add(particles);

    // 4. Mouse Rotation Interactivity
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      targetRotationY = mouseX * 0.6;
      targetRotationX = -mouseY * 0.6;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 450;
      const newHeight = container.clientHeight || 380;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 5. Animation Render Loop
    let reqId;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Continuous 3D rotations
        innerMesh.rotation.x = elapsedTime * 0.3;
        innerMesh.rotation.y = elapsedTime * 0.4;

        outerMesh.rotation.x = -elapsedTime * 0.2;
        outerMesh.rotation.y = elapsedTime * 0.25;

        ring1.rotation.z = elapsedTime * 0.35;
        ring2.rotation.z = -elapsedTime * 0.25;

        particles.rotation.y = elapsedTime * 0.08;
      }

      // Smooth Mouse Interactivity
      coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      pGeometry.dispose();
      pMaterial.dispose();
    };
  }, []);

  const nodes = [
    { id: 'fscm', name: 'FSCM', icon: Database, pos: 'top-3 left-4 sm:left-6' },
    { id: 'hcm', name: 'HCM', icon: Cpu, pos: 'top-3 right-4 sm:right-6' },
    { id: 'campus', name: 'Campus', icon: Server, pos: 'top-1/2 -translate-y-1/2 left-2 sm:left-3' },
    { id: 'reporting', name: 'Reporting', icon: Layers, pos: 'top-1/2 -translate-y-1/2 right-2 sm:right-3' },
    { id: 'cloud', name: 'Oracle Cloud', icon: Cloud, pos: 'bottom-3 left-4 sm:left-6' },
    { id: 'managed', name: 'Managed Services', icon: Activity, pos: 'bottom-3 right-4 sm:right-6' }
  ];

  return (
    <div className="relative w-full max-w-lg bg-gradient-to-b from-white/95 via-sky-50/40 to-white/95 backdrop-blur-xl border-2 border-sky-100 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-sky-500/15 overflow-hidden font-['Inter']">
      
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-sky-100 relative z-20">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
          <span className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
            <Box size={14} className="text-sky-500" />
            <span>PeopleLabs 3D Enterprise Core</span>
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-extrabold uppercase border border-sky-200">
          3D Interactive
        </span>
      </div>

      {/* 3D CANVAS & SATELLITE NODES CONTAINER */}
      <div className="relative w-full h-[320px] sm:h-[350px] my-2 flex items-center justify-center">
        
        {/* THREE.JS WEBGL 3D CANVAS MOUNT */}
        <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" />

        {/* CENTER FLOATING BADGE OVERLAY */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 0 0 rgba(14, 165, 233, 0.4)',
              '0 0 0 18px rgba(14, 165, 233, 0)',
              '0 0 0 0 rgba(14, 165, 233, 0)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-20 w-24 h-24 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-br from-sky-500 via-sky-400 to-sky-600 p-1 flex items-center justify-center shadow-xl shadow-sky-500/35 pointer-events-none"
        >
          <div className="w-full h-full rounded-xl bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-1 shadow-inner text-center">
            <span className="text-sky-600 font-black text-sm tracking-tight">PEOPLE</span>
            <span className="text-sky-800 font-extrabold text-xs tracking-wider">SOFT</span>
          </div>
        </motion.div>

        {/* ORBITING INTERACTIVE SATELLITE PRACTICE NODES */}
        {nodes.map((node, idx) => {
          const NodeIcon = node.icon;
          const isActive = activeNode === node.id;

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: isActive ? 1.08 : 1,
                y: [0, idx % 2 === 0 ? -6 : 6, 0]
              }}
              transition={{
                y: { duration: 4 + idx * 0.5, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.5, delay: idx * 0.1 }
              }}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
              className={`absolute z-20 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md backdrop-blur-md ${node.pos} ${
                isActive
                  ? 'bg-sky-500 text-white border-sky-400 shadow-sky-500/30 scale-105'
                  : 'bg-white/95 text-sky-900 border-sky-200 hover:border-sky-400 hover:bg-sky-50'
              }`}
            >
              <NodeIcon size={14} className={isActive ? 'text-white' : 'text-sky-500'} />
              <span>{node.name}</span>
            </motion.div>
          );
        })}

      </div>

      {/* Bottom Status Bar */}
      <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-xs text-slate-600 font-medium relative z-20">
        <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
          <Sparkles size={14} className="text-sky-500 animate-pulse" />
          <span>Real-time 3D Data Sync &amp; SLA</span>
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-extrabold uppercase">
          ACTIVE 24/7
        </span>
      </div>

    </div>
  );
}
