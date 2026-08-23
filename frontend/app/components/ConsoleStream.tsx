'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const logs = [
  'Initializing ZK-VM...',
  'Loading Poseidon hash function...',
  'Hashing payroll rows...',
  'Generating nullifiers...',
  'Wrapping payloads...',
  'Finalizing proof...',
  '✅ ZK-VM execution complete.'
];

export default function ConsoleStream({ onComplete }: { onComplete: () => void }) {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setVisibleLogs((prev) => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-2xl mx-auto bg-obsidian text-cream font-mono p-4 rounded-md shadow-[12px_12px_0px_0px_#0F1115]">
      <AnimatePresence>
        {visibleLogs.map((log, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-1"
          >
            {log}
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  );
}
