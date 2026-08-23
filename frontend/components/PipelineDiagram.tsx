import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const stages = [
  'CSV rows',
  'Poseidon commitment',
  'Withdraw',
  'InvokeExternal',
  'OpenNoteDeposit (sealed)',
];

export default function PipelineDiagram() {
  const shouldReduce = useReducedMotion();
  return (
    <section className="w-full max-w-3xl mx-auto py-8">
      <div className="flex flex-col gap-4">
        {stages.map((stage, idx) => (
          <motion.div
            key={stage}
            className={`flex items-center gap-2 p-3 border-2 border-obsidian rounded-md bg-cream ${idx === stages.length - 1 ? 'text-neon' : 'text-obsidian'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={shouldReduce ? {} : { opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
          >
            <span className="font-serif font-bold">{stage}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
