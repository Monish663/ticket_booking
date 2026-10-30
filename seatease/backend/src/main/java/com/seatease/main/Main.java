package com.seatease.main;

import com.seatease.controller.BookingController;
import com.seatease.controller.SeatController;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import io.github.cdimascio.dotenv.Dotenv;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

/**
 * Main — Entry point for the SeatEase backend server.
 *
 * Uses Java's built-in com.sun.net.httpserver.HttpServer (no Spring Boot).
 *
 * Responsibilities:
 *   - Initialize the HTTP server on the configured port.
 *   - Register all API routes.
 *   - Add CORS support for the React frontend.
 *   - Print a clear startup message.
 */
public class Main {

    private static final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
    private static final int SERVER_PORT = Integer.parseInt(
            getEnv("SERVER_PORT", "8080"));
    private static final String FRONTEND_ORIGIN =
            getEnv("FRONTEND_ORIGIN", "http://localhost:5173");

    public static void main(String[] args) throws IOException {
        // Create the HTTP server
        HttpServer server = HttpServer.create(new InetSocketAddress(SERVER_PORT), 0);

        // Register API routes with CORS wrapper
        server.createContext("/api/seats", withCors(new SeatController()));
        server.createContext("/api/bookings", withCors(new BookingController()));

        // Use the default executor (single-threaded is fine for a college project)
        server.setExecutor(java.util.concurrent.Executors.newFixedThreadPool(10));

        // Start the server
        server.start();

        System.out.println("==============================================");
        System.out.println("   SeatEase Backend Server Started!");
        System.out.println("   Port:            " + SERVER_PORT);
        System.out.println("   API Base URL:    http://localhost:" + SERVER_PORT + "/api");
        System.out.println("   CORS Origin:     " + FRONTEND_ORIGIN);
        System.out.println("==============================================");
        System.out.println("   Endpoints:");
        System.out.println("   GET  /api/seats              - All seats");
        System.out.println("   GET  /api/seats/available    - Available seats");
        System.out.println("   POST /api/bookings           - Create booking");
        System.out.println("   GET  /api/bookings/{id}      - Get booking");
        System.out.println("   POST /api/bookings/{id}/cancel - Cancel booking");
        System.out.println("==============================================");
    }

    /**
     * Wraps an HttpHandler with CORS headers so the React frontend
     * (running on a different port) can communicate with this server.
     *
     * Also handles OPTIONS preflight requests required by browsers.
     *
     * OOP Concept: This is an example of the Decorator pattern —
     * we wrap the original handler to add CORS behavior without
     * modifying the handler itself.
     */
    private static HttpHandler withCors(HttpHandler handler) {
        return (HttpExchange exchange) -> {
            // Add CORS headers to every response
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

            // Handle preflight OPTIONS request
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1); // No content
                return;
            }

            // Delegate to the actual handler
            handler.handle(exchange);
        };
    }

    /**
     * Reads an environment variable with a fallback default.
     */
    private static String getEnv(String key, String defaultValue) {
        String value = dotenv.get(key);
        if (value == null || value.isEmpty()) {
            value = System.getenv(key);
        }
        return (value != null && !value.isEmpty()) ? value : defaultValue;
    }
}
