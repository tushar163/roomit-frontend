"use client";

import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const stateClass = {
  available: "border-emerald-400/35 bg-emerald-400/12 text-emerald-300 hover:bg-emerald-400/20",
  booked: "cursor-not-allowed border-rose-400/35 bg-rose-400/12 text-rose-300 opacity-70",
  buffer: "cursor-not-allowed border-amber-400/35 bg-amber-400/12 text-amber-300 opacity-80",
};

export function AvailabilityGrid({ slots, onSlotSelect }) {
  const normalizedSlots = slots.map((slot) => {
    const state = slot.buffer ? "buffer" : slot.available ? "available" : "booked";
    return {
      time: slot.time || slot.start,
      end: slot.end,
      state,
      label: slot.label || (state === "available" ? "Available" : state === "buffer" ? "Buffer" : "Booked"),
    };
  });

  const firstAvailable = normalizedSlots.find((slot) => slot.state === "available") ?? null;
  const [selected, setSelected] = useState(firstAvailable?.time ?? null);

  useEffect(() => {
    if (firstAvailable) {
      onSlotSelect?.({ start: firstAvailable.time, end: firstAvailable.end });
    }
  }, []);

  const handleSelect = (slot) => {
    setSelected(slot.time);
    onSlotSelect?.({ start: slot.time, end: slot.end });
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <Legend color="bg-emerald-400" label="Available" />
        <Legend color="bg-rose-400" label="Booked" />
        <Legend color="bg-amber-400" label="Buffer" />
      </div>
      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="grid min-w-[680px] grid-cols-6 gap-2 p-1 sm:gap-3 md:min-w-0 md:p-2">
          {normalizedSlots.map((slot) => (
            <motion.div
              key={slot.time}
              whileHover={slot.state === "available" ? { y: -3 } : undefined}
              whileTap={slot.state === "available" ? { scale: 0.97 } : undefined}
            >
              <Button
                fullWidth
                isDisabled={slot.state !== "available"}
                onPress={() => handleSelect(slot)}
                className={cn(
                  "h-16 flex-col rounded-xl border text-left shadow-none transition sm:h-20 sm:rounded-2xl",
                  stateClass[slot.state],
                  selected === slot.time && "ring-2 ring-violet-400 ring-offset-2 ring-offset-background",
                )}
              >
                <span className="text-xs font-semibold sm:text-sm">{slot.time}</span>
                <span className="text-[11px] opacity-80 sm:text-xs">{slot.end ? `${slot.end} · ${slot.label}` : slot.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("size-2 rounded-full", color)} />
      {label}
    </span>
  );
}
