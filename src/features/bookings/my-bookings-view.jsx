"use client";

import { Button, Card, Chip, Input } from "@heroui/react";
import { useState } from "react";
import { EmptyState } from "@/components/ui/state-panels";
import { CancellationModal, RescheduleModal } from "@/features/bookings/booking-action-modals";
import { toBookingRow } from "@/lib/data";
import { getBookingsByEmail } from "@/services/bookings";

export function MyBookingsView() {
  const [email, setEmail] = useState("nia@company.com");
  const [bookings, setBookings] = useState();
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const lookupBookings = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await getBookingsByEmail(email);
      console.log("raw response", response);
      setBookings(response);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };
  console.log("bookings", bookings);

  return (
    <div className="space-y-6">
      <div>
        <Chip variant="secondary">My bookings</Chip>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Manage meeting reservations.</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Lookup by employee email. No auth is required for the assignment flow.</p>
      </div>

      <Card className="glass-panel rounded-2xl p-4">
        <form onSubmit={lookupBookings} className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="employee@company.com"
            variant="bordered"
            aria-label="Employee email"
          />
          <Button type="submit" variant="primary" isDisabled={loading}>{loading ? "Searching..." : "Find bookings"}</Button>
        </form>
      </Card>

      {searched && bookings.length === 0 ? (
        <EmptyState title="No bookings for this email" description="Try another employee email or create a new room booking." />
      ) : (
        <div className="grid gap-4">
          {bookings?.map((booking) => (
            <Card key={booking.id} className="glass-panel rounded-2xl p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{booking.title}</h2>
                    <Chip variant={booking.status?.startsWith("cancelled") ? "danger" : "success"}>{booking.status}</Chip>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{booking.room} · {booking.date} · {booking.time}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <RescheduleModal bookingId={booking.id} />
                  {!booking.status?.startsWith("cancelled") && <CancellationModal bookingId={booking.id} />}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
