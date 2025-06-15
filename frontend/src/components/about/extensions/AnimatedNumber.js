// src/components/AnimatedNumber.js
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export default function AnimatedNumber({ from = 0, to, duration = 2, separator = "", className = "", suffix = "" }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(from);
  const spring = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration),
  });

  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      motionValue.set(to);
    }
  }, [inView, motionValue, to]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        const formatted = Intl.NumberFormat("en-US", {
          useGrouping: !!separator,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(latest.toFixed(0));

        ref.current.textContent = separator
          ? formatted.replace(/,/g, separator) + suffix
          : formatted + suffix;
      }
    });

    return () => unsubscribe();
  }, [spring, separator, suffix]);

  return <span className={className} ref={ref} />;
}
