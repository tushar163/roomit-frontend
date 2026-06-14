import { fallbackAvailability, fallbackBookings, fallbackRooms } from "@/lib/data";
import { endpoints, Getdata, Patchdata, Postdata } from "@/services/service";

export async function getRooms() {
  try {
    const response = await Getdata(endpoints.rooms);
    return response.data || fallbackRooms;
  } catch (error) {
    console.warn("Using static rooms fallback:", error.message);
    return fallbackRooms;
  }
}

export async function getRoomById(id) {
  try {
    const response = await Getdata(endpoints.roomById(id));
    return response.data || fallbackRooms.find((room) => room._id === id);
  } catch (error) {
    console.warn("Using static room fallback:", error.message);
    return fallbackRooms.find((room) => room._id === id) || fallbackRooms[0];
  }
}

export async function getRoomAvailability(roomId, date) {
  try {
    const response = await Getdata(endpoints.availability(roomId, date));
    return response.data || fallbackAvailability;
  } catch (error) {
    console.warn("Using static availability fallback:", error.message);
    return fallbackAvailability;
  }
}

export async function createBooking(payload) {
  return Postdata(endpoints.createBooking, payload);
}

export async function getBookingsByEmail(email) {
  if (!email) return [];
  try {
    const response = await Getdata(endpoints.bookingsByEmail(email));
    return response.data || [];
  } catch (error) {
    console.warn("Using static bookings fallback:", error.message);
    return fallbackBookings.filter((booking) => booking.bookedBy?.email?.toLowerCase() === email.toLowerCase());
  }
}

export async function cancelBooking(id) {
  return Patchdata(endpoints.cancelBooking(id));
}
