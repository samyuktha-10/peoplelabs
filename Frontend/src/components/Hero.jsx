import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Database, Server, Layers, Cloud, Sparkles, Cpu, Activity, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedLetters from './AnimatedLetters';
import ThreeHero3DVisual from './ThreeHero3DVisual';

export default function Hero({ scrollTo }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 35; // max ~8px shift
    const y = (e.clientY - rect.top - rect.height / 2) / 35;
    setMousePos({ x, y });
  };

  const capabilities = [
    'PeopleSoft FSCM',
    'PeopleSoft HCM',
    'Campus Solutions',
    'Oracle Cloud Migration',
    '24/7 Managed Services',
    'Kibana & nVision Reporting',
    'PeopleSoft Upgrades',
    'Technical & Functional Training'
  ];

  return (
    <section 
      id="hero" 
      onMouseMove={handleMouseMove}
      className="relative pt-32 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-sky-100/70 via-sky-50/40 to-white border-b border-sky-100 overflow-hidden"
    >
      {/* LAYER 1: Subtle Technology Grid Background */}
      <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* LAYER 2 & 3: Moving Drifting Sky-Blue Orbs with Parallax */}
      <motion.div
        style={{ x: mousePos.x, y: mousePos.y }}
        animate={{
          x: [0, 30, -15, 0],
          y: [0, -25, 20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-10 w-80 h-80 bg-sky-300/30 rounded-full blur-3xl pointer-events-none z-0"
      />

      <motion.div
        style={{ x: -mousePos.x, y: -mousePos.y }}
        animate={{
          x: [0, -25, 20, 0],
          y: [0, 25, -15, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 right-10 w-96 h-96 bg-sky-200/25 rounded-full blur-3xl pointer-events-none z-0"
      />

      {/* LAYER 4: Small Moving Data Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, (i % 2 === 0 ? 10 : -10), 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4
            }}
            style={{
              top: `${(i * 10) + 12}%`,
              left: `${(i * 11) + 8}%`
            }}
            className="absolute w-2 h-2 rounded-full bg-sky-400/50 blur-[1px]"
          />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT SIDE CONTENT (Text and buttons do NOT move with mouse parallax) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Small eyebrow badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <ShieldCheck size={16} className="text-sky-500" />
              <span>Oracle &amp; PeopleSoft Consulting</span>
            </motion.div>

            {/* Main headline with sky blue gradient text */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight font-['Inter']">
              <AnimatedLetters
                text="Oracle & PeopleSoft"
                className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 bg-clip-text text-transparent"
                delay={0.1}
              />{' '}
              <br className="hidden sm:inline" />
              <AnimatedLetters
                text="Expertise That Moves Your Business Forward"
                className="text-slate-900"
                delay={0.35}
              />
            </h1>

            {/* Supporting copy */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
            >
              Founded in 2016, PeopleLabs Consulting provides high-quality IT consulting services to organizations across a range of industries. Our expertise spans PeopleSoft FSCM, PeopleSoft HCM, PeopleSoft Campus Solutions, Oracle Cloud, managed services, training, and reporting.
            </motion.p>

            {/* Credibility tag */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              Delivering Oracle expertise since 2016 · Edmonton, Canada
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <motion.button
                whileHover={{ y: -2, boxShadow: '0 12px 25px -3px rgba(14, 165, 233, 0.35)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo && scrollTo('expertise')}
                className="relative overflow-hidden px-7 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-sky-500 via-sky-600 to-sky-500 shadow-md flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <span className="relative z-10">Explore Our Expertise</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-200" />
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo && scrollTo('contact')}
                className="px-7 py-3.5 rounded-xl text-base font-bold text-sky-600 bg-white border-2 border-sky-300 hover:bg-sky-50 hover:border-sky-500 transition-all flex items-center justify-center shadow-sm cursor-pointer"
              >
                Contact Us
              </motion.button>
            </motion.div>

          </div>

          {/* RIGHT SIDE — THREE.JS WEBGL 3D INTERACTIVE ECOSYSTEM VISUAL */}
          <motion.div 
            style={{ x: mousePos.x, y: mousePos.y }}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <ThreeHero3DVisual />
          </motion.div>

        </div>
      </div>

      {/* CONTINUOUS MOVING MARQUEE BAND UNDER HERO */}
      <div className="mt-12 py-3 bg-sky-100/80 text-sky-900 border-y border-sky-200 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
          {[...capabilities, ...capabilities].map((cap, idx) => (
            <div key={idx} className="flex items-center space-x-6 mx-4">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider font-['Inter']">
                {cap}
              </span>
              <span className="text-sky-500 font-black text-sm">✦</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
