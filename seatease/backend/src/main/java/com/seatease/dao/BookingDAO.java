package com.seatease.dao;

import com.seatease.database.DatabaseConnection;
import com.seatease.model.Booking;
import com.seatease.model.Customer;

import java.sql.*;
import java.time.LocalDateTime;

/**
 * BookingDAO — Data Access Object for the 'bookings' table.
 *
 * Handles creating bookings, retrieving booking records, and
 * updating booking status for cancellation.
 */
public class BookingDAO {

    /**
     * Inserts a new booking record and returns the generated booking ID.
     * Uses the provided connection for transaction support.
     */
    public int createBooking(Connection conn, int customerId, double totalAmount) throws SQLException {
        String sql = "INSERT INTO bookings (customer_id, total_amount, booking_status) VALUES (?, ?, 'CONFIRMED')";

        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, customerId);
            stmt.setDouble(2, totalAmount);
            stmt.executeUpdate();

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                }
                throw new SQLException("Failed to retrieve generated booking ID.");
            }
        }
    }

    /**
     * Retrieves a booking by its ID, including the customer information.
     * The seat list is loaded separately by BookingSeatDAO.
     * Returns null if not found.
     */
    public Booking getBookingById(int bookingId) throws SQLException {
        String sql = "SELECT b.booking_id, b.total_amount, b.booking_date, b.booking_status, " +
                     "c.customer_id, c.name, c.mobile, c.email " +
                     "FROM bookings b " +
                     "JOIN customers c ON b.customer_id = c.customer_id " +
                     "WHERE b.booking_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, bookingId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    // Build the Customer object from the JOIN result
                    Customer customer = new Customer(
                            rs.getInt("customer_id"),
                            rs.getString("name"),
                            rs.getString("mobile"),
                            rs.getString("email")
                    );

                    // Build the Booking object
                    Booking booking = new Booking();
                    booking.setBookingId(rs.getInt("booking_id"));
                    booking.setCustomer(customer);
                    booking.setTotalAmount(rs.getDouble("total_amount"));
                    booking.setBookingDate(rs.getTimestamp("booking_date").toLocalDateTime());
                    booking.setBookingStatus(rs.getString("booking_status"));
                    // selectedSeats will be set by the service layer via BookingSeatDAO

                    return booking;
                }
            }
        }
        return null;
    }

    /**
     * Updates the booking status (e.g., CONFIRMED → CANCELLED).
     * Uses the provided connection for transaction support.
     */
    public void updateBookingStatus(Connection conn, int bookingId, String status) throws SQLException {
        String sql = "UPDATE bookings SET booking_status = ? WHERE booking_id = ?";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setInt(2, bookingId);
            stmt.executeUpdate();
        }
    }
}
