"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Card, Input } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Command, Menu, Moon, Search, Sparkles, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { navItems } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function AppShell({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sidebar = (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-white/10 bg-white/70 px-4 py-5 backdrop-blur-2xl dark:bg-black/35">
      <Link href="/" className="flex items-center gap-3 px-2">
        <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg shadow-violet-500/20">
          <Sparkles size={20} />
        </span>
        <span>
          <span className="block text-base font-semibold">Roomit</span>
          <span className="block text-xs text-zinc-500 dark:text-zinc-400">Workspace orchestration</span>
        </span>
      </Link>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition dark:text-zinc-300",
                active && "bg-zinc-950 text-white shadow-lg shadow-black/15 dark:bg-white dark:text-zinc-950",
                !active && "hover:bg-zinc-950/5 hover:text-zinc-950 dark:hover:bg-white/10 dark:hover:text-white",
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Card className="glass-panel mt-auto rounded-2xl p-4">
        <div className="text-sm font-semibold">Smart scheduling</div>
        <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          Conflict detection, buffers, and room utilization insights are ready for API wiring.
        </p>
      </Card>
    </aside>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="soft-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="relative flex min-h-screen">
        <div className="hidden lg:block">{sidebar}</div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button className="absolute inset-0 bg-black/55" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
              <motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: "spring", damping: 26 }}>
                {sidebar}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-background/75 px-4 py-3 backdrop-blur-2xl sm:px-6">
            <div className="flex items-center gap-3">
              <Button isIconOnly variant="ghost" className="lg:hidden" onPress={() => setMobileOpen(true)} aria-label="Open navigation">
                <Menu size={20} />
              </Button>
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden min-w-0 flex-1 items-center gap-3 rounded-xl border border-zinc-200/70 bg-white/70 px-3 py-2 text-sm text-zinc-500 shadow-sm transition hover:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 sm:flex"
              >
                <Search size={17} />
                <span className="truncate">Search rooms, bookings, people</span>
                <span className="ml-auto flex items-center gap-1 rounded-md border border-zinc-200 px-1.5 py-0.5 text-xs dark:border-white/15">
                  <Command size={12} /> K
                </span>
              </button>
              <Button isIconOnly variant="ghost" onPress={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
                <Sun className="hidden dark:block" size={19} />
                <Moon className="dark:hidden" size={19} />
              </Button>
              <Button isIconOnly variant="ghost" aria-label="Notifications">
                <Bell size={19} />
              </Button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div className="fixed inset-0 z-[60] grid place-items-start bg-black/55 px-4 pt-24 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.96, y: -12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: -12 }} className="mx-auto w-full max-w-2xl">
              <Card className="glass-panel rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <Search size={18} className="ml-2 text-zinc-400" />
                  <Input autoFocus placeholder="Search Aurora, cancelled bookings, 10 AM slots..." className="flex-1 border-0 bg-transparent shadow-none" />
                  <Button isIconOnly variant="ghost" onPress={() => setSearchOpen(false)} aria-label="Close search">
                    <X size={18} />
                  </Button>
                </div>
                <div className="grid gap-2 p-2">
                  {["Aurora Boardroom", "Today's schedule", "Reschedule BK-1026"].map((item) => (
                    <button key={item} className="rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/10">
                      {item}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}