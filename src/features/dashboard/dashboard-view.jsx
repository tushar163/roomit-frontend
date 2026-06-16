"use client";

import { Button, Card, Chip, Tabs } from "@heroui/react";
import { motion } from "framer-motion";
import { Activity, ArrowUpRight, CalendarCheck, CalendarDays, Clock3, DoorOpen, XCircle } from "lucide-react";
import { BookingTable } from "@/components/ui/booking-table";
import { MetricCard } from "@/components/ui/metric-card";
import { useEffect, useState } from "react";
import { getDashboardMetrics } from "@/services/bookings";
import { fallbackBookings, fallbackRooms, metrics as fallbackMetrics, toBookingRow } from "@/lib/data";

const metricIcons = {
  "Total rooms": DoorOpen,
  "Total bookings": CalendarCheck,
  "Active bookings": Activity,
  Cancelled: XCircle,
};

function normalizeMetrics(items) {
  return items.map((metric) => ({
    ...metric,
    icon: metricIcons[metric.label] || Activity,
  }));
}

export function DashboardView() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [availabilityRoomId, setAvailabilityRoomId] = useState("");
  const [availabilityDate, setAvailabilityDate] = useState(new Date().toISOString().slice(0, 10));
  const [bookingLimit, setBookingLimit] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await getDashboardMetrics(availabilityRoomId, availabilityDate, bookingLimit);
        
        setRooms(response?.rooms);
        setBookings(response.recentBookings?.length ? response.recentBookings : fallbackBookings.map(toBookingRow));
        setMetrics(normalizeMetrics(response.metrics?.length ? response.metrics : fallbackMetrics));
        if (!availabilityRoomId && response?.rooms?.[0]?._id) setAvailabilityRoomId(response.rooms[0]._id);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setRooms(fallbackRooms);
        setBookings(fallbackBookings.map(toBookingRow));
        setMetrics(normalizeMetrics(fallbackMetrics));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [availabilityRoomId, availabilityDate, bookingLimit]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
        <Card className="glass-panel overflow-hidden rounded-2xl p-4 sm:p-6">
          <div className="max-w-2xl">
            <Chip variant="secondary">Live workspace intelligence</Chip>
            <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">Book rooms faster with a calm, premium control center.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">A dark-mode-first SaaS dashboard for room availability, utilization, and meeting lifecycle actions.</p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Conflicts avoided", "Avg setup buffer", "Room health"].map((label, index) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold">{index === 0 ? "42" : index === 1 ? "9m" : "98%"}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="glass-panel rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Today</p>
              <h2 className="text-xl font-semibold">Schedule</h2>
            </div>
            <CalendarDays className="text-violet-300" />
          </div>
          <div className="mt-5 space-y-3">
            {loading && <div className="h-20 animate-pulse rounded-xl bg-white/10" />}
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="rounded-xl bg-white/6 p-3">
                <div className="flex items-center gap-2 text-sm font-medium"><Clock3 size={15} />{booking.time}</div>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{booking.title}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => <MetricCard key={metric.label} metric={metric} index={index} />)}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="glass-panel min-w-0 rounded-2xl p-4 sm:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-lg font-semibold">Room utilization</h2><p className="text-sm text-zinc-500">Capacity and demand by room</p></div>
            <Button variant="ghost" className="w-full sm:w-auto">View analytics <ArrowUpRight size={16} /></Button>
          </div>
          <div className="space-y-4">
            {rooms.map((room) => (
              <div key={room._id}>
                <div className="mb-2 flex justify-between text-sm"><span>{room.name}</span><span>{room.utilization}%</span></div>
                <div className="h-3 rounded-full bg-zinc-200/60 dark:bg-white/10">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400" initial={{ width: 0 }} animate={{ width: `${room.utilization}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="glass-panel rounded-2xl p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Calendar preview</h2>
          <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs">
            {Array.from({ length: 35 }, (_, index) => (
              <span key={index} className={`rounded-lg py-2 ${[4, 10, 16, 22].includes(index) ? "bg-violet-500 text-white" : "bg-white/5"}`}>{(index % 30) + 1}</span>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(280px,0.72fr)_minmax(0,1fr)]">
        <Card className="glass-panel rounded-2xl p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Booking activity</h2>
          <div className="mt-5 space-y-5">
            {bookings.slice(0, 5).map((item) => (
              <div key={item.id} className="flex gap-3 text-sm">
                <span className="mt-1 size-2 rounded-full bg-cyan-300" />
                <div><p>{item.title}</p><p className="text-xs text-zinc-500">{item.date}</p></div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="glass-panel min-w-0 rounded-2xl p-4 sm:p-5">
          <Tabs aria-label="Recent booking tabs">
            <Tabs.List>
              <Tabs.Tab id="recent">Recent bookings</Tabs.Tab>
              <Tabs.Tab id="upcoming">Upcoming meetings</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel id="recent" className="mt-4"><BookingTable bookings={bookings} /></Tabs.Panel>
            <Tabs.Panel id="upcoming" className="mt-4"><BookingTable bookings={bookings.filter((booking) => booking.status === "confirmed")} /></Tabs.Panel>
          </Tabs>
        </Card>
      </section>
    </div>
  );
}
