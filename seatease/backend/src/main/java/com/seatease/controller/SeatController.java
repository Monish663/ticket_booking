package com.seatease.controller;

import com.google.gson.Gson;
import com.seatease.model.ApiResponse;
import com.seatease.model.Seat;
import com.seatease.service.SeatService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * SeatController — Handles HTTP requests related to seats.
 *
 * Implements HttpHandler from Java's built-in HTTP server.
 * Routes:
 *   GET /api/seats           → returns all seats
 *   GET /api/seats/available  → returns only available seats
 *
 * OOP Concept: Polymorphism — SeatController implements the HttpHandler
 * interface, providing its own handle() behavior.
 */
public class SeatController implements HttpHandler {

    private final SeatService seatService;
    private final Gson gson;

    public SeatController() {
        this.seatService = new SeatService();
        this.gson = new Gson();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Set CORS headers for every response
        exchange.getResponseHeaders().set("Content-Type", "application/json");

        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        // Only allow GET requests for seat endpoints
        if (!"GET".equalsIgnoreCase(method)) {
            sendResponse(exchange, 405, gson.toJson(ApiResponse.error("Method not allowed.")));
            return;
        }

        try {
            if ("/api/seats/available".equals(path)) {
                handleGetAvailableSeats(exchange);
            } else if ("/api/seats".equals(path)) {
                handleGetAllSeats(exchange);
            } else {
                sendResponse(exchange, 404, gson.toJson(ApiResponse.error("Endpoint not found.")));
            }
        } catch (Exception e) {
            System.err.println("Error in SeatController: " + e.getMessage());
            sendResponse(exchange, 500,
                    gson.toJson(ApiResponse.error("An unexpected error occurred while fetching seats.")));
        }
    }

    /**
     * GET /api/seats — Returns all 30 seats with their status.
     */
    private void handleGetAllSeats(HttpExchange exchange) throws Exception {
        List<Seat> seats = seatService.getAllSeats();
        String json = gson.toJson(ApiResponse.success("All seats retrieved successfully.", seats));
        sendResponse(exchange, 200, json);
    }

    /**
     * GET /api/seats/available — Returns only available seats.
     */
    private void handleGetAvailableSeats(HttpExchange exchange) throws Exception {
        List<Seat> seats = seatService.getAvailableSeats();
        String json = gson.toJson(ApiResponse.success("Available seats retrieved successfully.", seats));
        sendResponse(exchange, 200, json);
    }

    /**
     * Helper to send an HTTP response with a given status code and body.
     */
    private void sendResponse(HttpExchange exchange, int statusCode, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
