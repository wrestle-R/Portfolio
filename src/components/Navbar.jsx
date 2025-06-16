import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple utility function for classNames
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const NavbarComponent = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: "About", link: "#about" },
    { name: "Skills", link: "#skills" },
    { name: "Projects", link: "#projects" },
    { name: "Achievements", link: "#achievements" },
    { name: "Contact", link: "#contact" }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      setScrolled(isScrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Initial full-width navbar */}
      {!scrolled && (
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-5 bg-transparent"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Logo/Name */}
              <motion.a 
                href="#" 
                className="text-lg font-bold text-black dark:text-white tracking-tighter"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Russel Daniel Paul
              </motion.a>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item, index) => (
                  <NavItem key={index} item={item} />
                ))}
                <motion.a 
                  href="#resume" 
                  className="ml-6 px-5 py-2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Resume
                </motion.a>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-black dark:text-white p-2"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div 
                  className="md:hidden pt-4 pb-2 mt-2 space-y-3 bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-lg"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {navItems.map((item, index) => (
                    <motion.a
                      key={index}
                      href={item.link}
                      className="block px-4 py-2 rounded-md text-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {item.name}
                    </motion.a>
                  ))}
                  <motion.a
                    href="#resume"
                    className="block mt-4 px-4 py-2 rounded-md text-center text-white dark:text-black bg-neutral-900 dark:bg-white font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    Resume
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      )}

      {/* Centered, rounded navbar that appears on scroll */}
      <AnimatePresence>
        {scrolled && (
          <motion.div 
            className="fixed top-6 left-0 right-0 z-50 flex justify-center"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.nav 
              className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-lg rounded-full py-3 px-8 max-w-3xl mx-auto"
              initial={{ width: "50%" }}
              animate={{ width: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between gap-6">
                {/* Logo (smaller on scroll) */}
                <motion.a 
                  href="#" 
                  className="text-base font-bold pr-10 text-black dark:text-white tracking-tighter whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  RDP
                </motion.a>

                {/* Desktop Menu - Compact version */}
                <div className="hidden md:flex items-center space-x-2">
                  {navItems.map((item, index) => (
                    <CompactNavItem key={index} item={item} />
                  ))}
                </div>

                {/* Mobile Menu Toggle - Compact version */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden text-black dark:text-white"
                >
                  {isMobileMenuOpen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Mobile Menu - Scrolled version */}
              <AnimatePresence>
                {isMobileMenuOpen && scrolled && (
                  <motion.div 
                    className="md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-4 w-52"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {navItems.map((item, index) => (
                      <motion.a
                        key={index}
                        href={item.link}
                        className="block px-3 py-2 rounded-md text-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </motion.a>
                    ))}
                    <motion.a
                      href="#resume"
                      className="block mt-2 px-3 py-2 rounded-md text-center text-white dark:text-black bg-neutral-900 dark:bg-white text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Resume
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Regular Navigation Item with hover effect
const NavItem = ({ item }) => {
  return (
    <motion.a
      href={item.link}
      className="relative px-4 py-2 text-sm font-medium text-black dark:text-white"
      whileHover="hover"
      initial="initial"
    >
      <span className="relative z-10">{item.name}</span>
      <motion.span 
        className="absolute inset-0 rounded-full bg-neutral-100 dark:bg-neutral-800"
        initial={{ scale: 0.8, opacity: 0 }}
        variants={{
          initial: { scale: 0.8, opacity: 0 },
          hover: { scale: 1, opacity: 1 }
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.a>
  );
};

// Compact Navigation Item for scrolled navbar
const CompactNavItem = ({ item }) => {
  return (
    <motion.a
      href={item.link}
      className="relative px-3 py-1.5 text-sm font-medium text-black dark:text-white"
      whileHover="hover"
      initial="initial"
    >
      <span className="relative z-10">{item.name}</span>
      <motion.span 
        className="absolute inset-0 rounded-full bg-neutral-100 dark:bg-neutral-800"
        initial={{ scale: 0.8, opacity: 0 }}
        variants={{
          initial: { scale: 0.8, opacity: 0 },
          hover: { scale: 1, opacity: 1 }
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.a>
  );
};

export default NavbarComponent;