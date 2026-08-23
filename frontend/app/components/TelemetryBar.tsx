"use client";

import { useEffect, useState } from "react";

const POOL = "0x0f11...7777";

export default function TelemetryBar() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);
  const blink = tick % 2 === 0 ? "opacity-100" : "opacity-40";

  return (
    <div className="w-full bg-black overflow-x-auto" style={{ borderBottom: "3px solid #000" }}>
      <div
        className="flex items-center gap-5 px-6 py-2 text-[11px] font-mono tracking-widest uppercase whitespace-nowrap justify-center"
        style={{ color: "#A78BFA" }}
      >
        <span className="font-bold text-white">STARKNET MAINNET</span>
        <span className="opacity-30">//</span>

        <span>
          POOL:{" "}
          <span className="text-white/70">{POOL}</span>
        </span>
        <span className="opacity-30">//</span>

        <span>
          PROVER:{" "}
          <span className={`transition-opacity duration-700 ${blink}`} style={{ color: "#34D399" }}>
            ● OPERATIONAL
          </span>
        </span>
        <span className="opacity-30">//</span>

        <span>
          BLOCK:{" "}
          <span className="text-white/70">{(856_412 + tick).toLocaleString()}</span>
        </span>
        <span className="opacity-30">//</span>

        <span>
          PROOF LATENCY:{" "}
          <span className="text-white/70">1.4 s</span>
        </span>
      </div>
    </div>
  );
}
