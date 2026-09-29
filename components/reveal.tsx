"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";

function subscribe(): () => void {
  return () => undefined;
}

/**
 * Scroll-reveal wrapper (transform + opacity only; static under reduced motion).
 * Mount state comes from useSyncExternalStore so SSR HTML (server snapshot)
 * always matches hydration — matchMedia doesn't exist server-side.
 */
export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }): React.JSX.Element {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const reduce = useReducedMotion();
  if (!mounted || reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
