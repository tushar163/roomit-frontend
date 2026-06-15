
const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${url}/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || data.error || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const Getdata = (endpoint) => request(endpoint, { method: "GET" });
export const Postdata = (endpoint, payload) => request(endpoint, { method: "POST", body: JSON.stringify(payload) });
export const Patchdata = (endpoint, payload) => request(endpoint, { method: "PATCH", body: JSON.stringify(payload || {}) });
export const Deletedata = (endpoint) => request(endpoint, { method: "DELETE" });
export const Putdata = (endpoint, payload) => request(endpoint, { method: "PUT", body: JSON.stringify(payload) });

export const endpoints = {
  rooms: "v1/room/rooms",
  roomById: (id) => `v1/room/rooms?id=${id}`,
  availability: (roomId, date) => `v1/availability/rooms/${roomId}/availability?date=${date}`,
  createBooking: "v1/booking/bookings",
  bookingsByEmail: (email) => `v1/booking/bookings?email=${email}`,
  cancelBooking: (id) => `v1/booking/bookings?id=${id}`,
  rescheduleBooking: (id) => `v1/booking/bookings?id=${id}`,
};
