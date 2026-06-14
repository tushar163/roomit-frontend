import { Activity, CalendarCheck, DoorOpen, XCircle } from "lucide-react";

export const fallbackRooms = [
  {
    _id: "665f1f1f1f1f1f1f1f1f1001",
    name: "Aurora Boardroom",
    floor: "12th Floor",
    capacity: 18,
    bufferTime: 10,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
    utilization: 86,
    nextAvailable: "10:30",
  },
  {
    _id: "665f1f1f1f1f1f1f1f1f1002",
    name: "Studio Sync",
    floor: "7th Floor",
    capacity: 8,
    bufferTime: 0,
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1600&auto=format&fit=crop",
    utilization: 64,
    nextAvailable: "12:00",
  },
  {
    _id: "665f1f1f1f1f1f1f1f1f1003",
    name: "Lumen Focus",
    floor: "3rd Floor",
    capacity: 4,
    bufferTime: 15,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1600&auto=format&fit=crop",
    utilization: 42,
    nextAvailable: "Now",
  },
  {
    _id: "665f1f1f1f1f1f1f1f1f1004",
    name: "Atlas Conference",
    floor: "5th Floor",
    capacity: 12,
    bufferTime: 10,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop",
    utilization: 73,
    nextAvailable: "15:00",
  },
];

export const fallbackBookings = [
  {
    _id: "BK-1028",
    room: fallbackRooms[0],
    title: "Q3 Revenue Review",
    bookedBy: { name: "Nia Patel", email: "nia@company.com" },
    date: "2026-06-14",
    startTime: "09:30",
    endTime: "10:30",
    status: "confirmed",
  },
  {
    _id: "BK-1027",
    room: fallbackRooms[1],
    title: "Design Crit",
    bookedBy: { name: "Arjun Mehta", email: "arjun@company.com" },
    date: "2026-06-14",
    startTime: "11:00",
    endTime: "12:00",
    status: "confirmed",
  },
  {
    _id: "BK-1026",
    room: fallbackRooms[2],
    title: "Candidate Debrief",
    bookedBy: { name: "Maya Rao", email: "maya@company.com" },
    date: "2026-06-15",
    startTime: "14:00",
    endTime: "14:30",
    status: "cancelled-refundable",
  },
];

export const metrics = [
  { label: "Total rooms", value: "24", trend: "+3 this month", icon: DoorOpen, tone: "violet" },
  { label: "Total bookings", value: "1,284", trend: "+18.2%", icon: CalendarCheck, tone: "cyan" },
  { label: "Active bookings", value: "186", trend: "42 today", icon: Activity, tone: "emerald" },
  { label: "Cancelled", value: "31", trend: "-6.1%", icon: XCircle, tone: "rose" },
];

export const fallbackAvailability = [
  { start: "09:00", end: "09:30", available: false },
  { start: "09:30", end: "10:00", available: false },
  { start: "10:00", end: "10:30", available: true },
  { start: "10:30", end: "11:00", available: true },
  { start: "11:00", end: "11:30", available: false },
  { start: "11:30", end: "12:00", available: false },
  { start: "12:00", end: "12:30", available: true, buffer: true },
  { start: "12:30", end: "13:00", available: true },
  { start: "13:00", end: "13:30", available: true },
  { start: "13:30", end: "14:00", available: true },
  { start: "14:00", end: "14:30", available: false },
  { start: "14:30", end: "15:00", available: true, buffer: true },
];

export function toBookingRow(booking) {
  return {
    id: booking._id,
    room: typeof booking.room === "object" ? booking.room?.name : booking.room,
    title: booking.title,
    host: booking.bookedBy?.name || "Employee",
    date: booking.date,
    time: `${booking.startTime} - ${booking.endTime}`,
    status: booking.status,
    email: booking.bookedBy?.email,
  };
}
