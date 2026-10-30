package com.seatease.dao;

import com.seatease.database.DatabaseConnection;
import com.seatease.model.Seat;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * SeatDAO — Data Access Object for the 'seats' table.
 *
 * Contains only SQL and JDBC operations. No business logic or HTTP handling.
 * All queries use PreparedStatement for safety against SQL injection.
 */
public class SeatDAO {

    /**
     * Retrieves all 30 seats with their current status.
     */
    public List<Seat> getAllSeats() throws SQLException {
        List<Seat> seats = new ArrayList<>();
        String sql = "SELECT seat_id, row_name, seat_number, price, status FROM seats ORDER BY seat_id";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                seats.add(mapResultSetToSeat(rs));
            }
        }
        return seats;
    }

    /**
     * Retrieves only seats with status = 'AVAILABLE'.
     */
    public List<Seat> getAvailableSeats() throws SQLException {
        List<Seat> seats = new ArrayList<>();
        String sql = "SELECT seat_id, row_name, seat_number, price, status FROM seats WHERE status = 'AVAILABLE' ORDER BY seat_id";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                seats.add(mapResultSetToSeat(rs));
            }
        }
        return seats;
    }

    /**
     * Retrieves a single seat by its ID (e.g., "A1").
     * Returns null if not found.
     */
    public Seat getSeatById(String seatId) throws SQLException {
        String sql = "SELECT seat_id, row_name, seat_number, price, status FROM seats WHERE seat_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, seatId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToSeat(rs);
                }
            }
        }
        return null;
    }

    /**
     * Retrieves a seat by ID within an existing connection and locks the row
     * using SELECT ... FOR UPDATE (for use inside transactions).
     */
    public Seat getSeatByIdForUpdate(Connection conn, String seatId) throws SQLException {
        String sql = "SELECT seat_id, row_name, seat_number, price, status FROM seats WHERE seat_id = ? FOR UPDATE";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, seatId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToSeat(rs);
                }
            }
        }
        return null;
    }

    /**
     * Updates the status of a seat (e.g., AVAILABLE → BOOKED or BOOKED → AVAILABLE).
     * Uses the provided connection for transaction support.
     */
    public void updateSeatStatus(Connection conn, String seatId, String status) throws SQLException {
        String sql = "UPDATE seats SET status = ? WHERE seat_id = ?";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setString(2, seatId);
            stmt.executeUpdate();
        }
    }

    /**
     * Maps a ResultSet row to a Seat object.
     */
    private Seat mapResultSetToSeat(ResultSet rs) throws SQLException {
        return new Seat(
                rs.getString("seat_id"),
                rs.getString("row_name"),
                rs.getInt("seat_number"),
                rs.getDouble("price"),
                rs.getString("status")
        );
    }
}
