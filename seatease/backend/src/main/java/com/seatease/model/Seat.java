package com.seatease.model;

/**
 * Seat — Represents a single seat in the venue.
 *
 * OOP Concepts demonstrated:
 * - Encapsulation: All fields are private; accessed via getters/setters.
 * - Constructor overloading: Default + parameterized constructors.
 *
 * Each seat has a unique ID like "A1", a row name ("A"), a seat number (1),
 * a price (₹150), and a status (AVAILABLE / BOOKED).
 */
public class Seat {

    private String seatId;      // e.g., "A1"
    private String rowName;     // e.g., "A"
    private int seatNumber;     // e.g., 1
    private double price;       // e.g., 150.00
    private String status;      // AVAILABLE or BOOKED

    // Default constructor
    public Seat() {
    }

    // Parameterized constructor
    public Seat(String seatId, String rowName, int seatNumber, double price, String status) {
        this.seatId = seatId;
        this.rowName = rowName;
        this.seatNumber = seatNumber;
        this.price = price;
        this.status = status;
    }

    // --- Getters and Setters ---

    public String getSeatId() {
        return seatId;
    }

    public void setSeatId(String seatId) {
        this.seatId = seatId;
    }

    public String getRowName() {
        return rowName;
    }

    public void setRowName(String rowName) {
        this.rowName = rowName;
    }

    public int getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(int seatNumber) {
        this.seatNumber = seatNumber;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Seat{" +
                "seatId='" + seatId + '\'' +
                ", rowName='" + rowName + '\'' +
                ", seatNumber=" + seatNumber +
                ", price=" + price +
                ", status='" + status + '\'' +
                '}';
    }
}
