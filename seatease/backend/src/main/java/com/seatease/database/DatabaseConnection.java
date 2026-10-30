package com.seatease.database;

import io.github.cdimascio.dotenv.Dotenv;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DatabaseConnection — Manages JDBC connections to MySQL.
 *
 * Reads database credentials from environment variables (via .env file)
 * so that passwords are never hardcoded in source code.
 *
 * Usage:
 *   Connection conn = DatabaseConnection.getConnection();
 */
public class DatabaseConnection {

    private static final Dotenv dotenv = Dotenv.configure()
            .ignoreIfMissing()  // Allows system env vars to work too
            .load();

    private static final String DB_URL      = getEnv("DB_URL", "jdbc:mysql://localhost:3306/seatease_db");
    private static final String DB_USERNAME = getEnv("DB_USERNAME", "root");
    private static final String DB_PASSWORD = getEnv("DB_PASSWORD", "");

    /**
     * Creates and returns a new database connection.
     * Each call returns a fresh connection — the caller must close it.
     */
    public static Connection getConnection() throws SQLException {
        try {
            // Ensure the MySQL JDBC driver class is loaded
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("MySQL JDBC Driver not found. Add mysql-connector-j to your classpath.", e);
        }
        return DriverManager.getConnection(DB_URL, DB_USERNAME, DB_PASSWORD);
    }

    /**
     * Helper to read an environment variable, falling back to a default value.
     * First checks dotenv (.env file), then falls back to system env.
     */
    private static String getEnv(String key, String defaultValue) {
        String value = dotenv.get(key);
        if (value == null || value.isEmpty()) {
            value = System.getenv(key);
        }
        return (value != null && !value.isEmpty()) ? value : defaultValue;
    }
}
