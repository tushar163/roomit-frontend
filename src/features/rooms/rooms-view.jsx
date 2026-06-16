"use client";

import { Button, Card, Chip, Input, toast } from "@heroui/react";
import { Search, Users, Clock, Building2, CalendarDays } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getRooms } from "@/services/bookings";
import { useRouter } from "next/navigation";


function BufferBadge({ bufferTime }) {
  if (!bufferTime || bufferTime === 0) {
    return <Chip variant="secondary" size="sm">No buffer</Chip>;
  }
  return (
    <Chip variant="warning" size="sm">
      <Clock size={12} /> {bufferTime} min buffer
    </Chip>
  );
}

export function RoomsView() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  const hasFetched = useRef(false); // ← guards against Strict Mode double-invoke

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        if (data) {
          setRooms(data);
          toast.success("Rooms loaded successfully!", {
            actionProps: {
              children: "View",
              className: "bg-success text-success-foreground hover:bg-success/90",
            },
            description: `We've fetched ${data.length} rooms for you.`,
          });
        } else {
          toast.error("Failed to load rooms. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        toast.error("An error occurred while fetching rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const term = search.toLowerCase();
    return room.name?.toLowerCase().includes(term) || room.floor?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Chip variant="secondary">Rooms</Chip>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Find the right room instantly.
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Filter by capacity, floor, and buffer time.
          </p>
        </div>
        <div className="flex gap-3">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by room or floor"
            variant="bordered"
            className="min-w-64"
          />
          <Button isIconOnly variant="primary" aria-label="Search rooms">
            <Search size={18} />
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading && [1, 2, 3].map((item) => <Card key={item} className="glass-panel h-64 animate-pulse rounded-2xl" />)}
        {!loading && filteredRooms.map((room) => (
          <Card
            key={room._id}
            className="glass-panel overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 hover:shadow-premium"
          >
            <div className="p-5 flex flex-col gap-4">
              {/* Top row: floor badge + buffer chip */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-zinc-400">
                  <Building2 size={13} />
                  {room.floor}
                </div>
                <BufferBadge bufferTime={room.bufferTime} />
              </div>

              {/* Room name */}
              <h2 className="text-xl font-semibold leading-tight">{room.name}</h2>

              {/* Divider */}
              <div className="border-t border-zinc-100 dark:border-zinc-800" />

              {/* Stats: capacity + buffer time */}
              <div className="grid grid-cols-2 divide-x divide-zinc-100 dark:divide-zinc-800">
                <div className="flex flex-col gap-0.5 pr-4">
                  <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-zinc-400">
                    <Users size={12} /> Capacity
                  </span>
                  <span className="text-2xl font-semibold">
                    {room.capacity}
                    <span className="ml-1 text-sm font-normal text-zinc-400">people</span>
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 pl-4">
                  <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-zinc-400">
                    <Clock size={12} /> Buffer
                  </span>
                  <span className="text-2xl font-semibold">
                    {room.bufferTime || "—"}
                    {room.bufferTime > 0 && (
                      <span className="ml-1 text-sm font-normal text-zinc-400">min</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Created at */}
              {room.createdAt && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <CalendarDays size={12} />
                  Added on {new Date(room.createdAt).toLocaleDateString()}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button variant="secondary" className="flex-1" onClick={() => router.push(`/rooms/${room._id}`)}>
                  Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
