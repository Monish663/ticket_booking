package com.seatease.dao;

import com.seatease.database.DatabaseConnection;
import com.seatease.model.Customer;

import java.sql.*;

/**
 * CustomerDAO — Data Access Object for the 'customers' table.
 *
 * Handles saving new customers and retrieving customer records.
 * Uses PreparedStatement for all queries with user-supplied values.
 */
public class CustomerDAO {

    /**
     * Saves a new customer and returns the generated customer ID.
     * Uses the provided connection for transaction support.
     */
    public int saveCustomer(Connection conn, Customer customer) throws SQLException {
        String sql = "INSERT INTO customers (name, mobile, email) VALUES (?, ?, ?)";

        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, customer.getName());
            stmt.setString(2, customer.getMobile());
            stmt.setString(3, customer.getEmail());
            stmt.executeUpdate();

            // Retrieve the auto-generated customer_id
            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                }
                throw new SQLException("Failed to retrieve generated customer ID.");
            }
        }
    }

    /**
     * Retrieves a customer by their ID.
     * Returns null if not found.
     */
    public Customer getCustomerById(int customerId) throws SQLException {
        String sql = "SELECT customer_id, name, mobile, email FROM customers WHERE customer_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, customerId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Customer(
                            rs.getInt("customer_id"),
                            rs.getString("name"),
                            rs.getString("mobile"),
                            rs.getString("email")
                    );
                }
            }
        }
        return null;
    }
}
