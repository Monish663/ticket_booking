/**
 * api.js — API Service Layer
 *
 * All communication with the Java backend goes through this file.
 * React components never access MySQL directly.
 * The backend URL is configured via the VITE_API_BASE_URL environment variable.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * GET /api/seats — Fetch all seats with their current status.
 */
export async function fetchAllSeats() {
  const response = await fetch(`${API_BASE_URL}/seats`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch seats.');
  }
  return data.data;
}

/**
 * GET /api/seats/available — Fetch only available seats.
 */
export async function fetchAvailableSeats() {
  const response = await fetch(`${API_BASE_URL}/seats/available`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch available seats.');
  }
  return data.data;
}

/**
 * POST /api/bookings — Create a new booking.
 * The backend calculates the total amount; we never send it from the frontend.
 */
export async function createBooking({ name, mobile, email, seatIds }) {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mobile, email, seatIds }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create booking.');
  }
  return data.data;
}

/**
 * GET /api/bookings/{bookingId} — Fetch booking details.
 */
export async function fetchBooking(bookingId) {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Booking not found.');
  }
  return data.data;
}

/**
 * POST /api/bookings/{bookingId}/cancel — Cancel a booking.
 */
export async function cancelBooking(bookingId) {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
    method: 'POST',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to cancel booking.');
  }
  return data.data;
}
