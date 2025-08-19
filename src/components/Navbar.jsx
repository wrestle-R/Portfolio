import React, { useState, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Simple utility function for classNames
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const NavbarComponent = () => {
  const ref = useRef(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: "About", link: "#about" },
    { name: "Skills", link: "#skills" },
    { name: "Projects", link: "#projects" },
    { name: "Achievements", link: "#achievements" },
    { name: "Contact", link: "#contact" }
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.div
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 max-w-6xl mx-auto mb-16 md:mb-0"
    >
      {/* Desktop Navbar */}
      <motion.div
        animate={{
          backdropFilter: visible ? "blur(16px)" : "none",
          border: visible ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
          width: visible ? "65%" : "80%",
          y: visible ? 16 : 0,
          backgroundColor: visible
            ? "rgba(0, 0, 0, 0.1)"
            : "transparent",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40,
          duration: 0.3,
        }}
        style={{
          minWidth: visible ? "700px" : "600px",
        }}
        className="relative z-[60] mx-auto hidden w-full max-w-6xl flex-row items-center justify-between rounded-full px-8 py-3 md:flex"
      >
        <div className="flex w-full items-center justify-between">
          <motion.h1
            animate={{
              scale: visible ? 0.85 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className="text-lg font-bold text-black dark:text-white tracking-wider"
          >
            {visible ? "RDP" : "RDP"}
          </motion.h1>

          <motion.nav
            animate={{
              opacity: 1,
              scale: visible ? 0.9 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className="absolute left-1/2 flex -translate-x-1/2 items-center space-x-1"
          >
            {navItems.map((item, idx) => (
              <NavItem key={idx} item={item} onNavigate={scrollToSection} />
            ))}
          </motion.nav>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
            }}
            animate={{
              scale: visible ? 0.9 : 1,
            }}
          >
            <Link 
              to="/resume" 
              className="px-4 py-2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black text-sm font-medium inline-block tracking-wide"
            >
              Resume
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile navbar */}
      <motion.div
        animate={{
          backdropFilter: visible ? "blur(16px)" : "none",
          border: visible ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
          y: visible ? 16 : 0,
          backgroundColor: visible
            ? "rgba(0, 0, 0, 0.1)"
            : "transparent",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40,
        }}
        className="md:hidden flex items-center justify-between px-6 py-3 mt-4 mx-6 rounded-full"
      >
        <motion.h1
          animate={{
            scale: visible ? 0.85 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
          className="text-lg font-bold text-black dark:text-white tracking-wider"
        >
          {visible ? "RDP" : "Russel Daniel Paul"}
        </motion.h1>

        <motion.button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-black dark:text-white text-xl p-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 25,
          }}
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </motion.button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="md:hidden absolute top-full left-0 right-0 mt-2 mx-6"
          >
            <div className="bg-black/10 dark:bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-2 shadow-2xl">
              {navItems.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.link}
                  onClick={() => scrollToSection(item.link)}
                  className="block w-full text-left text-black dark:text-white py-2 px-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/10 transition-colors tracking-wide"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ x: 4 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 25,
                  }}
                >
                  {item.name}
                </motion.a>
              ))}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <Link
                  to="/resume"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full mt-3 px-4 py-2 rounded-xl text-center text-white dark:text-black bg-neutral-900 dark:bg-white font-medium tracking-wide"
                >
                  Resume
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Navigation Item with hover effect
const NavItem = ({ item, onNavigate }) => {
  return (
    <motion.a
      href={item.link}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(item.link);
      }}
      className="relative px-3 py-2 text-sm font-medium text-black dark:text-white tracking-wide"
      whileHover="hover"
      initial="initial"
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 25,
      }}
    >
      <span className="relative z-10">{item.name}</span>
      <motion.span 
        className="absolute inset-0 rounded-full bg-white/20 dark:bg-white/10"
        initial={{ scale: 0.8, opacity: 0 }}
        variants={{
          initial: { scale: 0.8, opacity: 0 },
          hover: { scale: 1, opacity: 1 }
        }}
        transition={{ 
          type: "spring",
          stiffness: 500,
          damping: 25,
        }}
      />
    </motion.a>
  );
};

export default NavbarComponent;