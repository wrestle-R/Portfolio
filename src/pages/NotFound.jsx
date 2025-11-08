import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const quotes = [
    { text: "This page is just like her. Doesn't exist.", author: "Romeiro" },
    { text: "I'm going back to 505 (minus 101).", author: "Romeiro" },
      { text: "Well, this is awkward, page not found.", author: "Someone Probably" },
        { text: "Everyone deserves a vacation even this page.", author: "Unknown" },
        { text: "This page went out to buy milk and never came back.", author: "Dark Mode probably" },
        { text: "404: Like your hopes and dreams, gone.", author: "The Dreamers" }


  ];
  
  const [randomQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: 'oklch(var(--background))' }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.02, 0.03, 0.02],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: 'oklch(var(--primary))' }}
        />
      </div>

      <div className="text-center max-w-lg relative z-10">
        {/* 404 Number with enhanced animation and styling */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1
          }}
          className="relative mb-3"
        >
          <h1
            className="text-[5rem] md:text-[7rem] font-bold leading-none tracking-tight"
            style={{ 
              color: 'oklch(var(--primary))'
            }}
          >
            404
          </h1>
        </motion.div>
        
        {/* Page Not Found with better spacing */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-xl md:text-2xl font-semibold mb-8"
          style={{ color: 'oklch(var(--foreground))' }}
        >
          Page Not Found
        </motion.h2>
        
        {/* Quote with elegant card design */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mb-6 px-4 py-4 rounded-xl"
          style={{ 
            backgroundColor: 'oklch(var(--muted) / 0.2)',
            border: '1px solid oklch(var(--border) / 0.3)'
          }}
        >
          <p 
            className="text-base md:text-lg italic mb-2 leading-relaxed"
            style={{ color: 'oklch(var(--foreground))' }}
          >
            "{randomQuote.text}"
          </p>
          
          <p
            className="text-sm"
            style={{ color: 'oklch(var(--muted-foreground))' }}
          >
            — {randomQuote.author}
          </p>
        </motion.div>
        
        {/* Navigation Button with enhanced styling */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/" 
              className="px-6 py-2.5 rounded-full font-medium inline-block text-sm tracking-wide"
              style={{
                backgroundColor: 'oklch(var(--primary))',
                color: 'oklch(var(--primary-foreground))'
              }}
            >
              Take Me Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;