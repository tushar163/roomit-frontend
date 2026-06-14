"use client";

import { Button, Input, Modal, toast, useOverlayState } from "@heroui/react";
import { CalendarCheck2, Clock } from "lucide-react";
import { useState } from "react";
import { createBooking } from "@/services/bookings";

const emptyForm = {
  name: "",
  email: "",
  title: "",
};

/**
 * @param roomId      - room._id
 * @param roomName    - display name
 * @param date        - "YYYY-MM-DD" string owned by RoomDetailView
 * @param selectedSlot - { start: "HH:MM", end: "HH:MM" } from AvailabilityGrid
 * @param triggerLabel - button label
 */
export function BookingFormModal({
  roomId,
  roomName = "the room",
  triggerLabel = "Book room",
  date = "",
  selectedSlot = null,
}) {
  const [formData, setFormData] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const state = useOverlayState();

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim().length < 2 ? "Enter your full name." : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Use a valid work email."
          : "";
      case "title":
        return value.trim().length < 3 ? "Meeting title is required." : "";
      default:
        return "";
    }
  };

  const validate = () => {
    const nextErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) nextErrors[field] = error;
    });
    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await createBooking({
        room: roomId,
        date,
        startTime: selectedSlot?.start,
        endTime: selectedSlot?.end,
        title: formData.title,
        bookedBy: {
          name: formData.name,
          email: formData.email,
        },
      });

      if (response?.success) {
        state.close();
        setFormData({ ...emptyForm });
        setErrors({});
        toast.success("Room booked", { description: `${roomName} is reserved.` });
      } else {
        toast.danger("Booking failed", {
          description: response?.message || "Please try again.",
        });
      }
    } catch (error) {
      const description =
        error.status === 409
          ? "That slot was just booked by another user."
          : error.message || "Please try again.";
      toast.danger("Booking failed", { description });
    } finally {
      setLoading(false);
    }
  };

  const hasSlot = selectedSlot?.start;

  // Format "YYYY-MM-DD" → "Mon, 14 Jun 2026" for the summary pill
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
      <Button
        variant="primary"
        fullWidth
        isDisabled={!hasSlot}
        onPress={state.open}
        title={!hasSlot ? "Select an available slot first" : undefined}
      >
        {triggerLabel}
      </Button>

      {!hasSlot && (
        <p className="mt-2 text-center text-xs text-zinc-500">
          Select an available slot above to continue.
        </p>
      )}

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container>
          <Modal.Dialog className="glass-panel rounded-2xl sm:max-w-[540px]">
            <Modal.Header>
              <Modal.Icon>
                <CalendarCheck2 className="size-5" />
              </Modal.Icon>
              <div>
                <Modal.Heading>Book {roomName}</Modal.Heading>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Conflicts are enforced by the API.
                </p>
              </div>
              <Modal.CloseTrigger />
            </Modal.Header>

            {/* Read-only booking summary */}
            {hasSlot && (
              <div className="mx-6 mb-1 flex items-center gap-3 rounded-xl bg-violet-400/10 px-4 py-3 text-sm text-violet-300">
                <Clock size={15} className="shrink-0" />
                <span>
                  <span className="font-medium">{formattedDate}</span>
                  {" · "}
                  {selectedSlot.start}
                  {selectedSlot.end ? ` – ${selectedSlot.end}` : ""}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Modal.Body className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" error={errors.name}>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nia Patel"
                    variant="bordered"
                  />
                </Field>
                <Field label="Email" error={errors.email}>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nia@company.com"
                    type="email"
                    variant="bordered"
                  />
                </Field>
                <Field label="Meeting title" error={errors.title} className="sm:col-span-2">
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Frontend planning"
                    variant="bordered"
                  />
                </Field>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="ghost" onPress={state.close} isDisabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isDisabled={loading}>
                  {loading ? "Booking..." : "Confirm booking"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}

function Field({ label, error, children, className = "" }) {
  return (
    <label className={`grid gap-1.5 text-sm font-medium ${className}`}>
      <span>{label}</span>
      {children}
      {error && <span className="text-xs font-medium text-rose-400">{error}</span>}
    </label>
  );
}