"use client";

import { Card, Chip, Input, toast } from "@heroui/react";
import { Monitor, Users, Wifi } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AvailabilityGrid } from "@/features/availability/availability-grid";
import { BookingFormModal } from "@/features/bookings/booking-form-modal";
import { getRoomAvailability, getRoomById } from "@/services/bookings";

const fallbackImage =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop";

export function RoomDetailView({ id }) {
  const [room, setRoom] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  console.log(isFormSubmitted, "isFormSubmitted")
  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      setSelectedSlot(null);
      try {
        const [roomData, availabilityData] = await Promise.all([
          getRoomById(id),
          getRoomAvailability(id, date),
        ]);
        if (roomData) {
          toast.success("Room details loaded successfully!", {
            actionProps: {
              children: "View",
              className: "bg-success text-success-foreground hover:bg-success/90",
            },
            description: `Details for ${roomData.name} have been fetched.`,
          });
          setRoom(roomData);
        } else {
          toast.error("Failed to load room details.");
        }
        if (availabilityData) {
          toast.success("Availability data loaded successfully!", {
            actionProps: {
              children: "View",
              className: "bg-success text-success-foreground hover:bg-success/90",
            },
            description: `Availability for ${roomData.name} has been fetched.`,
          });
          setAvailability(availabilityData);
        } else {
          toast.error("Failed to load availability data.");
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
        toast.error("An error occurred while fetching room details.", {
          actionProps: {
            children: "Retry",
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id, date]);

  const nextAvailable = useMemo(() => {
    const slot = availability.find((item) => item.available);
    return slot?.start || room?.nextAvailable || "No slots";
  }, [availability, room]);

  if (loading && !room) {
    return <Card className="glass-panel h-[520px] animate-pulse rounded-3xl" />;
  }

  if (!room) {
    return (
      <Card className="glass-panel rounded-2xl p-8">
        <h1 className="text-xl font-semibold">Room not found</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Check the room id or seed rooms in the backend.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${room.image || fallbackImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
        <div className="relative min-h-[420px] max-w-3xl p-6 text-white sm:p-10">
          <Chip variant="secondary">Next available {nextAvailable}</Chip>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight">{room.name}</h1>
          <p className="mt-4 max-w-xl leading-7 text-white/72">
            Capacity-aware meeting room with server-backed 30-minute slot availability.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Chip>
              <Users size={15} /> {room.capacity} people
            </Chip>
            <Chip>
              <Wifi size={15} /> Hybrid ready
            </Chip>
            <Chip>
              <Monitor size={15} /> 4K display
            </Chip>
            <Chip>{room.bufferTime || 0} min buffer</Chip>
          </div>
        </div>
      </section>

      {/* Grid + sidebar */}
      <section className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card className="glass-panel rounded-2xl p-5">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Availability grid</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Daily 30-minute slots for {room.name}.
              </p>
            </div>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              variant="bordered"
              className="max-w-44"
              aria-label="Availability date"
            />
          </div>
          {loading ? (
            <div className="h-52 animate-pulse rounded-2xl bg-white/10" />
          ) : (
            <AvailabilityGrid slots={availability} onSlotSelect={setSelectedSlot} />
          )}
        </Card>

        <Card className="glass-panel h-fit rounded-2xl p-5 xl:sticky xl:top-24">
          <h2 className="text-lg font-semibold">Booking sidebar</h2>
          <div className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Floor</span>
              <span>{room.floor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Capacity</span>
              <span>{room.capacity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Buffer</span>
              <span>{room.bufferTime || 0} min</span>
            </div>
            {/* Show the currently-selected slot so the user knows what they're booking */}
            {selectedSlot && (
              <div className="flex justify-between rounded-xl bg-violet-400/10 px-3 py-2 text-violet-300">
                <span>Selected slot</span>
                <span className="font-medium">
                  {selectedSlot.start}
                  {selectedSlot.end ? ` – ${selectedSlot.end}` : ""}
                </span>
              </div>
            )}
          </div>
          <div className="mt-6">
            <BookingFormModal
              roomId={room._id}
              roomName={room.name}
              date={date}
              selectedSlot={selectedSlot}
              triggerLabel="Reserve this room"
              onBookingSuccess={setIsFormSubmitted}
            />

          </div>
        </Card>
      </section>
    </div>
  );
}