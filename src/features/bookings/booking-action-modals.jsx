"use client";

import { Button, Input, Modal, toast } from "@heroui/react";
import { CalendarClock, Trash2 } from "lucide-react";
import { useState } from "react";
import { cancelBooking } from "@/services/bookings";

export function CancellationModal({ bookingId }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      const response = await cancelBooking(bookingId);
      toast.success(response?.message || "Booking cancelled");
      setOpen(false);
    } catch (error) {
      toast.danger("Cancel failed", { description: error.message || "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="danger" onPress={() => setOpen(true)}><Trash2 size={16} /> Cancel</Button>
      <Modal isOpen={open} onOpenChange={setOpen}>
        <Modal.Backdrop />
        <Modal.Container>
          <Modal.Dialog className="glass-panel rounded-2xl">
            <Modal.Header><Modal.Icon><Trash2 /></Modal.Icon><Modal.Heading>Cancel booking?</Modal.Heading><Modal.CloseTrigger /></Modal.Header>
            <Modal.Body><p className="text-sm text-zinc-500 dark:text-zinc-400">The backend computes refundable vs non-refundable from server time.</p></Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={() => setOpen(false)} isDisabled={loading}>Keep booking</Button>
              <Button variant="danger" onPress={handleCancel} isDisabled={loading}>{loading ? "Cancelling..." : "Cancel booking"}</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>
    </>
  );
}

export function RescheduleModal({ bookingId }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onPress={() => setOpen(true)}><CalendarClock size={16} /> Reschedule</Button>
      <Modal isOpen={open} onOpenChange={setOpen}>
        <Modal.Backdrop />
        <Modal.Container>
          <Modal.Dialog className="glass-panel rounded-2xl">
            <Modal.Header><Modal.Icon><CalendarClock /></Modal.Icon><Modal.Heading>Reschedule {bookingId}</Modal.Heading><Modal.CloseTrigger /></Modal.Header>
            <Modal.Body className="grid gap-4 sm:grid-cols-3">
              <Input type="date" defaultValue="2026-06-15" variant="bordered" aria-label="New date" />
              <Input type="time" defaultValue="11:00" variant="bordered" aria-label="New start time" />
              <Input type="time" defaultValue="11:45" variant="bordered" aria-label="New end time" />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={() => setOpen(false)}>Close</Button>
              <Button variant="primary" onPress={() => toast.info("Reschedule API needed", { description: "Add PATCH /api/bookings/:id/reschedule to enable this." })}>Save changes</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>
    </>
  );
}
