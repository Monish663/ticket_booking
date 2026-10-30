package com.seatease.service;

import com.seatease.dao.SeatDAO;
import com.seatease.model.Seat;

import java.sql.SQLException;
import java.util.List;

/**
 * SeatService — Business logic for seat operations.
 *
 * Sits between the controller and DAO layers.
 * Validates seat selections and retrieves seat information.
 */
public class SeatService {

    private final SeatDAO seatDAO;

    public SeatService() {
        this.seatDAO = new SeatDAO();
    }

    /**
     * Returns all 30 seats with their current status.
     */
    public List<Seat> getAllSeats() throws SQLException {
        return seatDAO.getAllSeats();
    }

    /**
     * Returns only seats that are currently available.
     */
    public List<Seat> getAvailableSeats() throws SQLException {
        return seatDAO.getAvailableSeats();
    }

    /**
     * Validates that a list of seat IDs is not empty.
     * Throws IllegalArgumentException if validation fails.
     */
    public void validateSeatSelection(List<String> seatIds) {
        if (seatIds == null || seatIds.isEmpty()) {
            throw new IllegalArgumentException("At least one seat must be selected.");
        }
    }
}
