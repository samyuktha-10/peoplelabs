import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ scrollTo }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Careers', path: '/careers' },
    { label: 'About Us', path: '/about' },
  ];

  const handleNavClick = (item) => {
    setMobileMenuOpen(false);

    if (item.path === '/careers') {
      navigate('/careers');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.path === '/services') {
      navigate('/services');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.path === '/about') {
      navigate('/about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.path === '/') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
    } else if (item.path) {
      navigate(item.path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (scrollTo) {
        scrollTo('contact');
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <motion.header
      initial={false}
      animate={{
        height: isScrolled ? 80 : 92,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.97)' : 'rgba(255, 255, 255, 1)',
        boxShadow: isScrolled ? '0 10px 25px -3px rgba(14, 165, 233, 0.12)' : '0 0px 0px 0px rgba(0,0,0,0)',
        borderColor: isScrolled ? 'rgba(226, 232, 240, 0.9)' : 'rgba(226, 232, 240, 1)'
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-[100] border-b backdrop-blur-md flex items-center"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* BRAND LOGO (LEFT) */}
          <motion.div 
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
            animate={{ scale: isScrolled ? 0.96 : 1 }}
            transition={{ duration: 0.25 }}
            className="cursor-pointer flex items-center space-x-3 group shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500 to-sky-400 flex items-center justify-center font-black text-white text-xl font-['Inter'] shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              PL
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-['Inter'] flex items-center gap-1">
                PEOPLE<span className="text-sky-500 font-black">[LABS]</span>
              </span>
              <span className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold -mt-1">
                Consulting Inc.
              </span>
            </div>
          </motion.div>

          {/* DESKTOP NAVIGATION LINKS (CENTER / RIGHT) */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isHovered = hoveredNav === item.label;

              return (
                <div 
                  key={item.label} 
                  className="relative group py-2"
                  onMouseEnter={() => setHoveredNav(item.label)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`text-base font-semibold transition-colors duration-200 flex flex-col items-center relative cursor-pointer ${
                      isActive
                        ? 'text-sky-600 font-semibold'
                        : 'text-slate-700 hover:text-sky-500'
                    }`}
                  >
                    <span>{item.label}</span>

                    {/* Animated Underline */}
                    {isActive ? (
                      <motion.span
                        layoutId="active-underline"
                        className="block h-[2.5px] bg-sky-500 rounded-full w-full mt-1"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    ) : isHovered ? (
                      <motion.span
                        layoutId="hover-underline"
                        className="block h-[2px] bg-sky-400 rounded-full w-full mt-1"
                        transition={{ duration: 0.2 }}
                      />
                    ) : (
                      <span className="block h-[2px] bg-transparent w-0 mt-1" />
                    )}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* ACTIONS: LOGIN ICON + CONTACT US BUTTON */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* LOGIN ICON MICRO-INTERACTION */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="p-2 rounded-full hover:bg-sky-50 text-slate-700 hover:text-sky-600 cursor-pointer flex items-center space-x-2 font-medium text-base transition-colors group"
              title="Client & Employee Login"
              aria-label="Login"
            >
              <User size={20} className="text-slate-700 group-hover:text-sky-600 transition-colors" />
              <span>Login</span>
            </motion.div>

            {/* CONTACT US BUTTON WITH SHINE EFFECT */}
            <motion.button
              whileHover={{ y: -2, boxShadow: '0 10px 20px -5px rgba(14, 165, 233, 0.3)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={handleContactClick}
              className={`relative overflow-hidden rounded-xl text-base font-semibold text-white bg-gradient-to-r from-sky-500 to-sky-600 shadow-sm active:scale-95 group cursor-pointer ${
                isScrolled ? 'px-5 py-2 text-sm' : 'px-6 py-2.5'
              }`}
            >
              {/* Shine effect overlay */}
              <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              <span className="relative z-10">Contact Us</span>
            </motion.button>

          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label="Toggle Navigation Menu"
              className="p-2.5 rounded-lg bg-slate-100 text-slate-800 hover:text-sky-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

        </div>
      </div>

      {/* MOBILE NAVBAR DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[80px] left-0 right-0 bg-white/98 border-b border-slate-200 px-6 pt-4 pb-6 space-y-3 shadow-xl z-50 backdrop-blur-lg"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="block w-full text-left py-2.5 text-base font-semibold text-slate-900 hover:text-sky-600 border-b border-slate-100 transition-colors"
              >
                {item.label}
              </button>
            ))}

            <div className="flex items-center space-x-2 py-2.5 text-base font-semibold text-slate-700 border-b border-slate-100 cursor-pointer hover:text-sky-600">
              <User size={20} className="text-sky-500" />
              <span>Login</span>
            </div>

            <div className="pt-2">
              <button
                onClick={handleContactClick}
                className="w-full py-3 rounded-xl text-base font-semibold text-white bg-sky-500 hover:bg-sky-600 text-center shadow-sm"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
