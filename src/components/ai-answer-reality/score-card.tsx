"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import clsx from "clsx";

// Three.js Canvas loaded client-only to avoid SSR crash
const CriticalAlertCanvas = dynamic(
  () => import("@/components/ai-answer-reality/critical-alert-canvas").then((m) => m.CriticalAlertCanvas),
  { ssr: false }
);

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  alertStatus?: "healthy" | "warning" | "critical";
  description: string;
}

export function ScoreCard({
  title,
  score,
  maxScore = 100,
  alertStatus = "healthy",
  description,
}: ScoreCardProps) {
  const show3D = typeof window !== "undefined";

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(44, 48, 46, 0.08)" }}
      className="relative overflow-hidden p-6 rounded-2xl bg-white border border-[#2C302E]/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500"
    >
      {alertStatus === "critical" && (
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D97757]/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="flex justify-between items-start mb-8 relative z-10">
        <h3 className="font-mono text-xs uppercase tracking-widest text-[#2C302E]/60">
          {title}
        </h3>

        {alertStatus === "critical" && show3D ? (
          <CriticalAlertCanvas />
        ) : (
          <div className={clsx("h-2 w-2 rounded-full shadow-sm", alertStatus === "warning" ? "bg-amber-500" : "bg-[#2C302E]/40")} />
        )}
      </div>

      <div className="mb-4 relative z-10 flex items-baseline gap-1">
        <span className="font-serif font-light text-6xl tracking-tight text-[#2C302E]">
          {score}
        </span>
        <span className="font-serif font-light text-2xl text-[#2C302E]/30">
          /{maxScore}
        </span>
      </div>

      <p className="text-sm text-[#2C302E]/70 leading-relaxed relative z-10">
        {description}
      </p>
    </motion.div>
  );
}
