"use client";

import { Card } from "@heroui/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tones = {
  violet: "from-violet-500/25 text-violet-300",
  cyan: "from-cyan-500/25 text-cyan-300",
  emerald: "from-emerald-500/25 text-emerald-300",
  rose: "from-rose-500/25 text-rose-300",
};

export function MetricCard({ metric, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card className="glass-panel rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-premium">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{metric.value}</p>
          </div>
          <span className={cn("grid size-11 place-items-center rounded-xl bg-gradient-to-br to-transparent", tones[metric.tone])}>
            <metric.icon size={20} />
          </span>
        </div>
        <p className="mt-5 text-xs font-medium text-emerald-500">{metric.trend}</p>
      </Card>
    </motion.div>
  );
}