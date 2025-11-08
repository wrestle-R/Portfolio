import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const quotes = [
    { text: "Not all who wander are lost, but you definitely are.", author: "404 Wisdom" },
    { text: "The page you're looking for is in another castle.", author: "Internet Mario" },
    { text: "Error 404: Witty comment not found.", author: "Anonymous" },
    { text: "This is not the page you're looking for.", author: "Obi-Wan Kenobi" },
    { text: "Houston, we have a 404 problem.", author: "Apollo 13" },
    { text: "I looked everywhere for this page. Even behind the couch.", author: "Helpful Developer" },
    { text: "The page exists... just not in this dimension.", author: "Multiverse Theory" },
    { text: "404: Like my motivation, this page cannot be found.", author: "Relatable Content" },
    { text: "Plot twist: The real 404 was the friends we made along the way.", author: "Philosophical Error" },
    { text: "This page is on vacation. Probably somewhere nice.", author: "Envious Developer" }
  ];

  // Pick a random quote on component mount (refreshes on page reload)
  const [randomQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'oklch(var(--background))' }}
    >
      <div className="text-center max-w-lg">
        {/* 404 Number with animation */}
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1
          }}
          className="text-[8rem] md:text-[10rem] font-bold mb-2 leading-none"
          style={{ color: 'oklch(var(--primary))' }}
        >
          404
        </motion.h1>
        
        {/* Page Not Found */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-semibold mb-6"
          style={{ color: 'oklch(var(--foreground))' }}
        >
          Page Not Found
        </motion.h2>
        
        {/* Quote - Simple without card (show author) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p 
            className="text-base md:text-lg italic mb-1"
            style={{ color: 'oklch(var(--muted-foreground))' }}
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
        
        {/* Navigation Button - Single Home button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/" 
            className="px-5 py-2.5 rounded-full font-medium inline-block text-sm tracking-wide"
            style={{
              backgroundColor: 'oklch(var(--primary))',
              color: 'oklch(var(--primary-foreground))'
            }}
          >
            Go Home
          </Link>
        </motion.div>
        
      </div>
    </div>
  );
};

export default NotFound;
