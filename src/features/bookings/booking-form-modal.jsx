"use client";

import { Button, Input, Modal, toast } from "@heroui/react";
import { CalendarCheck2 } from "lucide-react";
import { useState } from "react";
import { createBooking } from "@/services/bookings";

const emptyForm = {
  name: "",
  email: "",
  title: "",
  date: "",
  startTime: "",
  endTime: "",
};

export function BookingFormModal({ roomId, roomName = "the room", triggerLabel = "Book room", defaultDate = "" }) {
  const [formData, setFormData] = useState({ ...emptyForm, date: defaultDate });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim().length < 2 ? "Enter your full name." : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Use a valid work email." : "";
      case "title":
        return value.trim().length < 3 ? "Meeting title is required." : "";
      case "date":
        return !value.trim() ? "Choose a date." : "";
      case "startTime":
        return !value.trim() ? "Choose a start time." : "";
      case "endTime":
        return !value.trim() ? "Choose an end time." : "";
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

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      nextErrors.endTime = "End time must be after start time.";
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await createBooking({
        room: roomId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        title: formData.title,
        bookedBy: {
          name: formData.name,
          email: formData.email,
        },
      });

      if (response?.success) {
        setOpen(false);
        setFormData({ ...emptyForm, date: defaultDate });
        setErrors({});
        toast.success("Room booked", { description: `${roomName} is reserved.` });
      } else {
        toast.danger("Booking failed", { description: response?.message || "Please try again." });
      }
    } catch (error) {
      const description = error.status === 409 ? "That slot was just booked by another user." : error.message || "Please try again.";
      toast.danger("Booking failed", { description });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <Button
        variant="primary"
        onPress={() => {
          setFormData((prev) => ({ ...prev, date: prev.date || defaultDate }));
          setOpen(true);
        }}
      >
        {triggerLabel}
      </Button>
      <Modal.Backdrop />
      <Modal.Container>
        <Modal.Dialog className="glass-panel rounded-2xl sm:max-w-[540px]">
          <Modal.Header>
            <Modal.Icon><CalendarCheck2 className="size-5" /></Modal.Icon>
            <div>
              <Modal.Heading>Book {roomName}</Modal.Heading>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Reserve consecutive slots. Conflicts are enforced by the API.</p>
            </div>
            <Modal.CloseTrigger />
          </Modal.Header>

          <form onSubmit={handleSubmit}>
            <Modal.Body className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" error={errors.name}>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Nia Patel" variant="bordered" />
              </Field>
              <Field label="Email" error={errors.email}>
                <Input name="email" value={formData.email} onChange={handleChange} placeholder="nia@company.com" type="email" variant="bordered" />
              </Field>
              <Field label="Meeting title" error={errors.title} className="sm:col-span-2">
                <Input name="title" value={formData.title} onChange={handleChange} placeholder="Frontend planning" variant="bordered" />
              </Field>
              <Field label="Date" error={errors.date}>
                <Input name="date" value={formData.date} onChange={handleChange} type="date" variant="bordered" />
              </Field>
              <Field label="Start time" error={errors.startTime}>
                <Input name="startTime" value={formData.startTime} onChange={handleChange} type="time" variant="bordered" />
              </Field>
              <Field label="End time" error={errors.endTime}>
                <Input name="endTime" value={formData.endTime} onChange={handleChange} type="time" variant="bordered" />
              </Field>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="ghost" onPress={() => setOpen(false)} isDisabled={loading}>Cancel</Button>
              <Button type="submit" variant="primary" isDisabled={loading}>{loading ? "Booking..." : "Confirm booking"}</Button>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
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
