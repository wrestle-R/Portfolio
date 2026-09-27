import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion as Motion, useAnimationControls, useInView } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

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
    const visible = navigation ? { opacity: 1 } : { opacity: 1, y: 0 };
    if (!enabled || focused) {
      controls.set(visible);
    } else if (inView || navigation) {
      const initial = initialViewport.current;
      controls.start({
        ...visible,
        transition: {
          duration: navigation ? 0.6 : initial ? 0.9 : 0.55,
          delay: navigation || !initial ? 0 : Math.min(0.12 + index * 0.1, 0.5),
          ease: EASE,
        },
      });
    }
  }, [controls, enabled, focused, inView, index, navigation]);

  return (
    <Motion.div
      ref={ref}
      className={`section-reveal${navigation ? ' relative z-40' : ''}`}
      data-entrance={enabled ? 'animated' : 'instant'}
      initial={enabled ? { opacity: 0, ...(navigation ? {} : { y: 12 }) } : false}
      animate={controls}
      onFocusCapture={() => setFocused(true)}
    >
      {children}
    </Motion.div>
  );
}
