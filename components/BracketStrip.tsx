'use client';
import { Fragment, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const phases = [
  '[PHASE 6: WITHDRAW]',
  '[PHASE 7: INVOKE]',
  '[SEALED]',
];

export default function BracketStrip() {
  const [active, setActive] = useState(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % phases.length);
    }, 3000);
    return () => clearInterval(id);
  }, [shouldReduce]);

  return (
    <section className="w-full flex justify-center py-4">
      <div className="flex items-center gap-2 text-obsidian font-serif text-lg">
        {phases.map((phase, i) => (
          <Fragment key={phase}>
            {i > 0 && <span className="text-obsidian mx-1">→</span>}
            <motion.span
              className={i === active ? 'text-neon' : ''}
              initial={{ opacity: 0 }}
              animate={{ opacity: i === active ? 1 : 0.5 }}
              transition={{ duration: 0.5 }}
            >
              {phase}
            </motion.span>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
