import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SectorsGrid from './components/SectorsGrid';
import ExpertiseOfferings from './components/ExpertiseOfferings';
import ContactFooter from './components/ContactFooter';
import ScrollToTop from './components/ScrollToTop';
import ServicesPage from './pages/ServicesPage';
import CareersPage from './pages/CareersPage';
import AboutPage from './pages/AboutPage';
import Background3DCanvas from './components/Background3DCanvas';
import { ArrowRight, Sparkles, Database, Cpu, Server, Cloud } from 'lucide-react';

// React Error Boundary Class
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-sky-900 font-['Inter']">PeopleLabs Consulting Platform</h2>
          <p className="text-sm text-slate-600 max-w-md">
            Something unexpected occurred while loading this view.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="px-6 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-600 transition-colors shadow-md cursor-pointer"
          >
            Reload View
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Scroll Progress Bar
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 origin-left z-[110] pointer-events-none"
    />
  );
}

// Light Sky Blue & White Intro Welcome Screen with 3D Orbital Animations
function IntroSplash({ onComplete }) {
  const [visible, setVisible] = useState(() => {
    try {
      const hasSeen = sessionStorage.getItem('peoplelabsIntroSeen');
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return !hasSeen && !prefersReducedMotion;
    } catch {
      return false;
    }
  });

  const [isDismissing, setIsDismissing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;

    // Fast loading progress animation 0 -> 100
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 30);

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  const dismiss = () => {
    if (isDismissing) return;
    setIsDismissing(true);

    try {
      sessionStorage.setItem('peoplelabsIntroSeen', 'true');
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 700);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro-splash"
        initial={{ opacity: 1 }}
        animate={{ opacity: isDismissing ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        className="fixed inset-0 z-[120] min-h-screen w-full bg-gradient-to-b from-[#FFFFFF] via-[#F0F9FF] to-[#E0F2FE] flex flex-col items-center justify-center text-slate-900 select-none overflow-hidden"
      >
        {/* LAYER 1: Moving Sky-Blue Orbs */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -25, 30, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 left-10 w-96 h-96 bg-[#38BDF8]/25 rounded-full blur-3xl pointer-events-none"
        />

        <motion.div
          animate={{
            x: [0, -35, 25, 0],
            y: [0, 30, -20, 0]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#0EA5E9]/20 rounded-full blur-3xl pointer-events-none"
        />

        {/* LAYER 2: Technology Radial Grid */}
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none animate-pulse" />

        {/* LAYER 3: Connected Technology SVG Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25 z-0">
          <line x1="15%" y1="25%" x2="50%" y2="50%" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6 6" />
          <line x1="85%" y1="25%" x2="50%" y2="50%" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 6" />
          <line x1="20%" y1="75%" x2="50%" y2="50%" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6 6" />
          <line x1="80%" y1="75%" x2="50%" y2="50%" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 6" />

          <motion.circle
            r="4.5"
            fill="#0ea5e9"
            animate={{ cx: ['15%', '50%'], cy: ['25%', '50%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            r="4.5"
            fill="#38bdf8"
            animate={{ cx: ['85%', '50%'], cy: ['25%', '50%'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>

        {/* INTRO CONTENT CONTAINER */}
        <motion.div
          animate={{
            y: isDismissing ? -30 : 0,
            opacity: isDismissing ? 0 : 1,
            scale: isDismissing ? 0.95 : 1
          }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-xl mx-auto text-center px-6 space-y-6"
        >
          
          {/* STEP 1: Holographic 3D Logo with Orbiting Rings */}
          <div className="relative inline-block cursor-pointer my-2">
            
            {/* Outer Spinning Ring 1 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-8 border-2 border-dashed border-sky-400/40 rounded-full pointer-events-none"
            />

            {/* Outer Spinning Ring 2 */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-5 border border-sky-300/50 rounded-full pointer-events-none"
            />

            {/* Glowing Aura Background */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -inset-4 rounded-3xl bg-sky-400/35 blur-xl pointer-events-none"
            />

            {/* PL Logo Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-400 to-sky-300 p-1.5 shadow-2xl shadow-sky-500/35 flex items-center justify-center"
            >
              <div className="w-full h-full rounded-xl bg-white flex items-center justify-center font-black text-sky-600 text-3xl sm:text-4xl font-['Inter'] shadow-inner">
                PL
              </div>
            </motion.div>
          </div>

          {/* STEP 2: Company Title */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-2"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100/90 border border-sky-200 text-sky-800 text-[11px] font-bold uppercase tracking-wider shadow-sm">
              <Sparkles size={13} className="text-sky-500" />
              <span>ORACLE &amp; PEOPLESOFT ENTERPRISE PLATFORM</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-['Inter']">
              PeopleLabs <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 bg-clip-text text-transparent">Consulting</span>
            </h1>
          </motion.div>

          {/* STEP 3: Capability Pill Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-2 pt-1"
          >
            <span className="px-2.5 py-1 rounded-lg bg-white/90 border border-sky-200 text-sky-800 text-xs font-bold shadow-sm flex items-center gap-1">
              <Database size={12} className="text-sky-500" /> FSCM
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/90 border border-sky-200 text-sky-800 text-xs font-bold shadow-sm flex items-center gap-1">
              <Cpu size={12} className="text-sky-500" /> HCM
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/90 border border-sky-200 text-sky-800 text-xs font-bold shadow-sm flex items-center gap-1">
              <Server size={12} className="text-sky-500" /> Campus Solutions
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/90 border border-sky-200 text-sky-800 text-xs font-bold shadow-sm flex items-center gap-1">
              <Cloud size={12} className="text-sky-500" /> Oracle Cloud
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
              🇨🇦 Edmonton, AB
            </span>
          </motion.div>

          {/* STEP 4: Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium"
          >
            Empowering Canadian and Global Enterprise Organizations across Higher Education, Financial Services, Public Sector, Insurance &amp; Manufacturing.
          </motion.p>

          {/* STEP 5: Progress Bar Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-xs mx-auto space-y-1.5"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-sky-800 font-mono">
              <span>PLATFORM STATUS</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-sky-100 overflow-hidden p-0.5 border border-sky-200">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>

          {/* STEP 6: Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.48 }}
            className="pt-2 relative inline-block"
          >
            <div className="absolute -inset-2 rounded-xl bg-sky-400/20 blur-md pointer-events-none" />

            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 12px 25px -5px rgba(14, 165, 233, 0.4)' }}
              whileTap={{ scale: 0.96 }}
              onClick={dismiss}
              className="relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 font-['Inter']"
            >
              <span>EXPLORE ENTERPRISE PLATFORM</span>
              <ArrowRight size={16} />
            </motion.button>

            <span className="block text-[10px] text-slate-400 mt-2.5 font-medium">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[9px] font-mono font-bold">Enter ↵</kbd> or click to continue
            </span>
          </motion.div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// HomePage Component
function HomePage() {
  const [activeSection, setActiveSection] = useState('hero');

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const sections = ['hero', 'sectors', 'expertise', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-slate-800 antialiased font-['Inter']">
      <main>
        <Hero scrollTo={scrollToSection} />
        <SectorsGrid />
        <ExpertiseOfferings />
        <ContactFooter scrollTo={scrollToSection} showUpperForm={true} />
      </main>

      <ScrollToTop />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  // Reset scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Initialize Lenis smooth scroll for desktop
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <ErrorBoundary>
      {/* 3D Canvas Background Overlay across all pages */}
      <Background3DCanvas />

      <ScrollProgressBar />
      <IntroSplash />

      {/* FIXED NAVBAR AT ROOT LEVEL */}
      <Navbar />

      {/* Sleek Page Redirect Transition Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 15, scale: 0.98, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -15, scale: 0.98, filter: 'blur(2px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </ErrorBoundary>
  );
}
