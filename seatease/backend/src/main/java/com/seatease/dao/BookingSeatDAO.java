package com.seatease.dao;

import com.seatease.database.DatabaseConnection;
import com.seatease.model.Seat;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * BookingSeatDAO — Data Access Object for the 'booking_seats' mapping table.
 *
 * This table links bookings to seats (many-to-many relationship).
 * A booking can have multiple seats, and seats appear in booking history.
 */
public class BookingSeatDAO {

    /**
     * Inserts all seat mappings for a booking.
     * Uses the provided connection for transaction support.
     */
    public void saveBookingSeats(Connection conn, int bookingId, List<String> seatIds) throws SQLException {
        String sql = "INSERT INTO booking_seats (booking_id, seat_id) VALUES (?, ?)";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for (String seatId : seatIds) {
                stmt.setInt(1, bookingId);
                stmt.setString(2, seatId);
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }

    /**
     * Retrieves all seats associated with a booking.
     * Uses a JOIN to get the full seat details.
     */
    public List<Seat> getSeatsByBookingId(int bookingId) throws SQLException {
        List<Seat> seats = new ArrayList<>();
        String sql = "SELECT s.seat_id, s.row_name, s.seat_number, s.price, s.status " +
                     "FROM booking_seats bs " +
                     "JOIN seats s ON bs.seat_id = s.seat_id " +
                     "WHERE bs.booking_id = ? " +
                     "ORDER BY s.seat_id";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, bookingId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    seats.add(new Seat(
                            rs.getString("seat_id"),
                            rs.getString("row_name"),
                            rs.getInt("seat_number"),
                            rs.getDouble("price"),
                            rs.getString("status")
                    ));
                }
            }
        }
        return seats;
    }

    /**
     * Retrieves only the seat IDs associated with a booking.
     * Used during cancellation to know which seats to release.
     */
    public List<String> getSeatIdsByBookingId(Connection conn, int bookingId) throws SQLException {
        List<String> seatIds = new ArrayList<>();
        String sql = "SELECT seat_id FROM booking_seats WHERE booking_id = ?";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, bookingId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    seatIds.add(rs.getString("seat_id"));
                }
            }
        }
        return seatIds;
    }
}
