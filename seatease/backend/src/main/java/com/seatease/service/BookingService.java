package com.seatease.service;

import com.seatease.dao.BookingDAO;
import com.seatease.dao.BookingSeatDAO;
import com.seatease.dao.CustomerDAO;
import com.seatease.dao.SeatDAO;
import com.seatease.database.DatabaseConnection;
import com.seatease.model.Booking;
import com.seatease.model.Customer;
import com.seatease.model.Seat;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

/**
 * BookingService — Core business logic for the booking system.
 *
 * This is the MAIN location for all booking rules:
 *   - Validate customer information.
 *   - Verify seat availability using SELECT ... FOR UPDATE.
 *   - Calculate the total amount server-side.
 *   - Create bookings within a database transaction.
 *   - Cancel bookings and release seats.
 *
 * OOP Concepts demonstrated:
 * - Composition: BookingService uses DAO objects to perform persistence.
 * - Abstraction: Business operations are separated from SQL and HTTP.
 * - Exception handling: Validates input and handles SQL failures.
 *
 * WHY TRANSACTIONS? If two users try to book the same seat at the same time,
 * SELECT ... FOR UPDATE locks the seat rows, preventing double-booking. If any
 * step fails, the entire transaction is rolled back — no partial bookings.
 */
public class BookingService {

    private final SeatDAO seatDAO;
    private final CustomerDAO customerDAO;
    private final BookingDAO bookingDAO;
    private final BookingSeatDAO bookingSeatDAO;

    public BookingService() {
        this.seatDAO = new SeatDAO();
        this.customerDAO = new CustomerDAO();
        this.bookingDAO = new BookingDAO();
        this.bookingSeatDAO = new BookingSeatDAO();
    }

    /**
     * Creates a new booking using a database transaction.
     *
     * Steps:
     * 1. Validate customer data and seat selection.
     * 2. Start a transaction.
     * 3. Lock the selected seats (SELECT ... FOR UPDATE).
     * 4. Verify every seat exists and is AVAILABLE.
     * 5. Calculate total amount.
     * 6. Insert customer, booking, and booking-seat mappings.
     * 7. Mark seats as BOOKED.
     * 8. Commit the transaction.
     *
     * If anything fails, the entire transaction is rolled back.
     *
     * @param name    Customer name (required)
     * @param mobile  Customer mobile (10 digits, required)
     * @param email   Customer email (optional)
     * @param seatIds List of seat IDs to book (e.g., ["A1", "A2"])
     * @return The complete Booking object with all details
     */
    public Booking createBooking(String name, String mobile, String email, List<String> seatIds)
            throws SQLException {

        // --- Input validation ---
        validateCustomerInfo(name, mobile);
        validateSeatSelection(seatIds);

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false); // Start transaction

            // --- Step 1: Lock and verify each seat ---
            double totalAmount = 0;
            for (String seatId : seatIds) {
                Seat seat = seatDAO.getSeatByIdForUpdate(conn, seatId);

                if (seat == null) {
                    throw new IllegalArgumentException("Seat '" + seatId + "' does not exist.");
                }
                if (!"AVAILABLE".equals(seat.getStatus())) {
                    throw new IllegalStateException(
                            "Seat '" + seatId + "' is no longer available. Please refresh and try again.");
                }
                totalAmount += seat.getPrice();
            }

            // --- Step 2: Insert customer ---
            Customer customer = new Customer(name, mobile, email);
            int customerId = customerDAO.saveCustomer(conn, customer);
            customer.setCustomerId(customerId);

            // --- Step 3: Insert booking ---
            int bookingId = bookingDAO.createBooking(conn, customerId, totalAmount);

            // --- Step 4: Insert booking-seat mappings ---
            bookingSeatDAO.saveBookingSeats(conn, bookingId, seatIds);

            // --- Step 5: Mark seats as BOOKED ---
            for (String seatId : seatIds) {
                seatDAO.updateSeatStatus(conn, seatId, "BOOKED");
            }

            // --- Commit transaction ---
            conn.commit();

            // --- Build and return the booking response ---
            Booking booking = bookingDAO.getBookingById(bookingId);
            List<Seat> bookedSeats = bookingSeatDAO.getSeatsByBookingId(bookingId);
            booking.setSelectedSeats(bookedSeats);

            return booking;

        } catch (Exception e) {
            // Roll back the entire transaction on any failure
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException rollbackEx) {
                    System.err.println("Rollback failed: " + rollbackEx.getMessage());
                }
            }
            throw e; // Re-throw so the controller can handle it
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException closeEx) {
                    System.err.println("Failed to close connection: " + closeEx.getMessage());
                }
            }
        }
    }

    /**
     * Retrieves a booking by its ID, including customer and seat details.
     * Returns null if the booking is not found.
     */
    public Booking getBookingById(int bookingId) throws SQLException {
        Booking booking = bookingDAO.getBookingById(bookingId);
        if (booking != null) {
            List<Seat> seats = bookingSeatDAO.getSeatsByBookingId(bookingId);
            booking.setSelectedSeats(seats);
        }
        return booking;
    }

    /**
     * Cancels a booking and releases its seats using a transaction.
     *
     * Steps:
     * 1. Verify the booking exists and is not already cancelled.
     * 2. Start a transaction.
     * 3. Update booking status to CANCELLED.
     * 4. Release each associated seat (set status back to AVAILABLE).
     * 5. Commit the transaction.
     */
    public Booking cancelBooking(int bookingId) throws SQLException {
        // First check the booking exists (outside transaction)
        Booking booking = bookingDAO.getBookingById(bookingId);
        if (booking == null) {
            return null; // Will be handled as 404 by the controller
        }
        if ("CANCELLED".equals(booking.getBookingStatus())) {
            throw new IllegalStateException("Booking #" + bookingId + " is already cancelled.");
        }

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false); // Start transaction

            // Update booking status
            bookingDAO.updateBookingStatus(conn, bookingId, "CANCELLED");

            // Release associated seats
            List<String> seatIds = bookingSeatDAO.getSeatIdsByBookingId(conn, bookingId);
            for (String seatId : seatIds) {
                seatDAO.updateSeatStatus(conn, seatId, "AVAILABLE");
            }

            conn.commit();

            // Return the updated booking
            return getBookingById(bookingId);

        } catch (Exception e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException rollbackEx) {
                    System.err.println("Rollback failed: " + rollbackEx.getMessage());
                }
            }
            throw e;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException closeEx) {
                    System.err.println("Failed to close connection: " + closeEx.getMessage());
                }
            }
        }
    }

    // =====================================================================
    // Validation helpers
    // =====================================================================

    /**
     * Validates customer information.
     * Name is required. Mobile must be exactly 10 digits.
     */
    private void validateCustomerInfo(String name, String mobile) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name is required.");
        }
        if (mobile == null || !mobile.matches("\\d{10}")) {
            throw new IllegalArgumentException("Mobile number must be exactly 10 digits.");
        }
    }

    /**
     * Validates that at least one seat is selected.
     */
    private void validateSeatSelection(List<String> seatIds) {
        if (seatIds == null || seatIds.isEmpty()) {
            throw new IllegalArgumentException("At least one seat must be selected.");
        }
    }
}
