"use client";

import { Button, Input, Modal, Spinner, toast, useOverlayState } from "@heroui/react";
import { CalendarClock, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AvailabilityGrid } from "@/features/availability/availability-grid";
import { cancelBooking, getRoomAvailability, rescheduleBooking } from "@/services/bookings";


export function CancellationModal({ bookingId, onCancelled }) {
  const [loading, setLoading] = useState(false);
  const state = useOverlayState();
  console.log(bookingId,"aasd")
  const handleCancel = async () => {
    setLoading(true);
    try {
      const response = await cancelBooking(bookingId);
      toast.success(response?.message || "Booking cancelled");
      state.close();
      onCancelled?.();
    } catch (error) {
      toast.danger("Cancel failed", { description: error.message || "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="danger" onPress={state.open}>
        <Trash2 size={16} /> Cancel
      </Button>

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container>
          <Modal.Dialog className="glass-panel rounded-2xl sm:max-w-[420px]">
            <Modal.Header>
              <Modal.Icon>
                <Trash2 className="size-5" />
              </Modal.Icon>
              <div>
                <Modal.Heading>Cancel booking?</Modal.Heading>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  The backend computes refundable vs non-refundable from server time.
                </p>
              </div>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Footer>
              <Button variant="ghost" onPress={state.close} isDisabled={loading}>
                Keep booking
              </Button>
              <Button variant="danger" onPress={handleCancel} isDisabled={loading}>
                {loading ? "Cancelling..." : "Cancel booking"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}


export function RescheduleModal({ bookingId, roomId, currentDate, onRescheduled }) {
  const state = useOverlayState();

  const [date, setDate] = useState(currentDate || new Date().toISOString().slice(0, 10));
  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch availability whenever the modal is open and date changes
  useEffect(() => {
    if (!state.isOpen || !roomId) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSelectedSlot(null);
      try {
        const data = await getRoomAvailability(roomId, date);
        setAvailability(data);
      } catch {
        toast.danger("Failed to load slots", { description: "Check your connection and try again." });
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [state.isOpen, roomId, date]);

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setSubmitLoading(true);
    try {
      const response = await rescheduleBooking(bookingId, {
        date,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
      });

      if (response?.success) {
        toast.success("Booking rescheduled", {
          description: `Moved to ${date} · ${selectedSlot.start}–${selectedSlot.end}`,
        });
        state.close();
        onRescheduled?.();
      } else {
        toast.danger("Reschedule failed", { description: response?.message || "Please try again." });
      }
    } catch (error) {
      const description =
        error.status === 409
          ? "That slot was just booked by someone else."
          : error.message || "Please try again.";
      toast.danger("Reschedule failed", { description });
    } finally {
      setSubmitLoading(false);
    }
  };

  const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : null;

  return (
    <>
      <Button variant="secondary" onPress={state.open}>
        <CalendarClock size={16} /> Reschedule
      </Button>

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container>
          {/* Wide enough to comfortably fit the 6-col slot grid */}
          <Modal.Dialog className="glass-panel rounded-2xl sm:max-w-[720px]">
            <Modal.Header>
              <Modal.Icon>
                <CalendarClock className="size-5" />
              </Modal.Icon>
              <div>
                <Modal.Heading>Reschedule booking</Modal.Heading>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Pick a new date and select an available slot.
                </p>
              </div>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="space-y-5">
              {/* Date picker row */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-zinc-400 shrink-0">Date</span>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  variant="bordered"
                  className="max-w-44"
                  aria-label="New date"
                />
              </div>

              {/* Availability grid */}
              {slotsLoading ? (
                <div className="flex h-44 items-center justify-center">
                  <Spinner size="md" />
                </div>
              ) : availability.length > 0 ? (
                <AvailabilityGrid slots={availability} onSlotSelect={setSelectedSlot} />
              ) : (
                <p className="py-8 text-center text-sm text-zinc-500">
                  No slots available for this date.
                </p>
              )}

              {/* Selected slot summary pill */}
              {selectedSlot && (
                <div className="flex items-center gap-2 rounded-xl bg-violet-400/10 px-4 py-3 text-sm text-violet-300">
                  <CalendarClock size={15} className="shrink-0" />
                  <span>
                    <span className="font-medium">{formattedDate}</span>
                    {" · "}
                    {selectedSlot.start}–{selectedSlot.end}
                  </span>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="ghost" onPress={state.close} isDisabled={submitLoading}>
                Close
              </Button>
              <Button
                variant="primary"
                onPress={handleConfirm}
                isDisabled={!selectedSlot || submitLoading}
              >
                {submitLoading ? "Saving..." : "Confirm reschedule"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}