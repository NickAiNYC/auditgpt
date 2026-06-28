"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface QueryResult {
  query: string;
  aiResult: string;
  risk: "High" | "Medium" | "Low";
}

interface AIQueryResultTableProps {
  results: QueryResult[];
}

export function AIQueryResultTable({ results }: AIQueryResultTableProps) {
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const riskStyles = {
    High: "bg-[#D97757]/10 text-[#D97757] border-[#D97757]/20",
    Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Low: "bg-[#2C302E]/5 text-[#2C302E]/60 border-[#2C302E]/10",
  };

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#2C302E]/5 bg-[#FDFBF7]/50">
        <div className="col-span-3 font-mono text-[10px] uppercase tracking-widest text-[#2C302E]/50">
          Prospect Query
        </div>
        <div className="col-span-7 font-mono text-[10px] uppercase tracking-widest text-[#2C302E]/50">
          AI Output Summary
        </div>
        <div className="col-span-2 font-mono text-[10px] uppercase tracking-widest text-[#2C302E]/50 text-right">
          Risk Level
        </div>
      </div>

      {/* Body */}
      <motion.div
        variants={tableVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="flex flex-col"
      >
        {results.map((result, idx) => (
          <motion.div
            key={idx}
            variants={rowVariants}
            className="grid grid-cols-12 gap-4 px-6 py-6 border-b border-[#2C302E]/5 hover:bg-[#FDFBF7] transition-colors duration-300 items-start group"
          >
            <div className="col-span-3">
              <span className="font-serif text-lg text-[#2C302E] group-hover:text-[#D97757] transition-colors">
                &ldquo;{result.query}&rdquo;
              </span>
            </div>

            <div className="col-span-7">
              <p className="text-sm text-[#2C302E]/80 leading-relaxed pr-8">
                {result.aiResult}
              </p>
            </div>

            <div className="col-span-2 flex justify-end">
              <span
                className={clsx(
                  "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-medium border",
                  riskStyles[result.risk]
                )}
              >
                {result.risk} Risk
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
