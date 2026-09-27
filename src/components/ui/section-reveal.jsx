import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion as Motion, useAnimationControls, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

export default function SectionReveal({ children, enabled, index = 0, navigation = false }) {
  const ref = useRef(null);
  const initialViewport = useRef(false);
  const controls = useAnimationControls();
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const [focused, setFocused] = useState(false);

  useLayoutEffect(() => {
    const bounds = ref.current.getBoundingClientRect();
    initialViewport.current = navigation || (bounds.top < window.innerHeight && bounds.bottom > 0);
  }, [navigation]);

  useEffect(() => {
    const visible = navigation ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' };
    if (!enabled || focused) {
      controls.set(navigation ? visible : { ...visible, filter: 'none' });
    } else if (inView || navigation) {
      const initial = initialViewport.current;
      controls.start({
        ...visible,
        transition: {
          duration: navigation ? 0.7 : initial ? 1.15 : 0.8,
          delay: navigation || !initial ? 0 : Math.min(0.16 + index * 0.18, 0.7),
          ease: EASE,
        },
        // Release the filter's containing block after the reveal so fixed
        // descendants (such as certificate dialogs) remain viewport-relative.
        ...(navigation ? {} : { transitionEnd: { filter: 'none' } }),
      });
    }
  }, [controls, enabled, focused, inView, index, navigation]);

  return (
    <Motion.div
      ref={ref}
      className={`section-reveal${navigation ? ' relative z-40' : ''}`}
      data-entrance={enabled ? 'animated' : 'instant'}
      initial={enabled ? { opacity: 0, ...(navigation ? {} : { y: 32, scale: 0.985, filter: 'blur(7px)' }) } : false}
      animate={controls}
      onFocusCapture={() => setFocused(true)}
    >
      {children}
    </Motion.div>
  );
}
