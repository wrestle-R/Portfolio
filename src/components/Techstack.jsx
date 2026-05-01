import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { techData } from './tech/TechData';
import { useTheme } from '../context/ThemeContext';

const cardVariants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(8px)' },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: index * 0.08,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const getInitials = (name) =>
  name
    .replace(/[^a-zA-Z+ ]/g, '')
    .split(/\s|\/|&/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const TechIcon = ({ item, theme }) => {
  const [hasError, setHasError] = useState(false);
  const source = theme === 'dark' ? item.iconDark || item.icon : item.iconLight || item.icon;

  if (hasError) {
    return (
      <span
        className="grid h-7 w-7 place-items-center rounded-md border text-[10px] font-black tracking-tight"
        style={{
          borderColor: 'oklch(var(--border))',
          backgroundColor: 'oklch(var(--muted))',
          color: 'oklch(var(--foreground))',
        }}
        aria-hidden="true"
      >
        {getInitials(item.name)}
      </span>
    );
  }

  return (
    <img
      src={source}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
      className="h-7 w-7 object-contain transition-transform duration-300 group-hover:scale-105"
    />
  );
};

const Techstack = () => {
  const { theme } = useTheme();

  return (
    <section className="relative w-full overflow-hidden px-4 pt-8 md:pt-10" id="tech">
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <article
          className="relative w-full min-h-[560px] overflow-hidden rounded-xl border p-5 md:min-h-[620px] md:p-6 transition-colors duration-300 ease-in-out hover:bg-muted/50"
          style={{
            backgroundColor: 'oklch(var(--background))',
            borderColor: 'oklch(var(--border))',
          }}
        >
          <div className="relative flex items-center justify-between border-b  pr-4 pb-3" style={{ borderColor: 'oklch(var(--border))' }}>
            <h2 className="text-2xl font-semibold" style={{ color: 'oklch(var(--foreground))' }}>
              Tech Stack
            </h2>
            <span className="font-mono text-[11px]" style={{ color: 'oklch(var(--muted-foreground))' }}>
              ~/russel/stack.json
            </span>
          </div>

          <div className="relative mt-5 grid grid-cols-1 gap-4 md:mt-6 md:grid-cols-2">
            {techData.map((category, idx) => (
              <motion.article
                key={category.category}
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18 }}
                whileHover={{ y: -2, transition: { duration: 0.18, ease: 'easeOut' } }}
                className="group/card relative overflow-hidden rounded-xl border p-4 transition-[border-color,background-color,box-shadow] duration-250 hover:bg-muted/30"
                style={{
                  backgroundColor: 'oklch(var(--background) / 0.7)',
                  borderColor: 'oklch(var(--border))',
                  boxShadow: '0 0 0 0 oklch(var(--foreground) / 0)',
                }}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                  style={{ background: 'linear-gradient(90deg, transparent, oklch(var(--foreground) / 0.24), transparent)' }}
                />

                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-mono text-sm font-semibold" style={{ color: 'oklch(var(--foreground))' }}>
                      {category.category}
                    </h3>
                  </div>
                  <span
                    className="h-2.5 w-2.5 rounded-full border"
                    style={{
                      borderColor: 'oklch(var(--border))',
                      backgroundColor: 'oklch(var(--foreground) / 0.16)',
                      boxShadow: '0 0 18px oklch(var(--foreground) / 0.08)',
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <motion.div
                      key={item.name}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative flex items-center gap-2 overflow-hidden rounded-lg border px-2.5 py-2 text-xs transition-[background-color,border-color,transform] duration-200 hover:bg-muted/40"
                      style={{
                        borderColor: 'oklch(var(--border))',
                        backgroundColor: 'oklch(var(--background) / 0.78)',
                      }}
                    >
                      <span className="absolute inset-x-2 top-0 h-px bg-foreground/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <span
                        className="relative z-10 grid h-9 w-9 place-items-center rounded-md border transition-transform duration-300 group-hover:-translate-y-0.5"
                        style={{
                          borderColor: 'oklch(var(--border))',
                          backgroundColor: 'oklch(var(--muted) / 0.42)',
                        }}
                      >
                      <TechIcon item={item} theme={theme} />
                      </span>
                      <span className="relative z-10 whitespace-nowrap font-medium">{item.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export default Techstack;
