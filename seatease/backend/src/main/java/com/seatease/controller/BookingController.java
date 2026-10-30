package com.seatease.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.seatease.model.ApiResponse;
import com.seatease.model.Booking;
import com.seatease.service.BookingService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * BookingController — Handles HTTP requests related to bookings.
 *
 * Routes:
 *   POST /api/bookings                    → create a booking
 *   GET  /api/bookings/{bookingId}        → get booking details
 *   POST /api/bookings/{bookingId}/cancel → cancel a booking
 *
 * OOP Concept: Polymorphism — BookingController implements HttpHandler,
 * providing its own routing and request-handling logic.
 */
public class BookingController implements HttpHandler {

    private final BookingService bookingService;
    private final Gson gson;

    public BookingController() {
        this.bookingService = new BookingService();
        this.gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, (JsonSerializer<LocalDateTime>) (src, typeOfSrc, context) ->
                        new JsonPrimitive(src.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))))
                .create();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json");

        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        try {
            // Route: POST /api/bookings — Create booking
            if ("POST".equalsIgnoreCase(method) && "/api/bookings".equals(path)) {
                handleCreateBooking(exchange);
                return;
            }

            // Route: POST /api/bookings/{id}/cancel — Cancel booking
            if ("POST".equalsIgnoreCase(method) && path.matches("/api/bookings/\\d+/cancel")) {
                int bookingId = extractBookingId(path);
                handleCancelBooking(exchange, bookingId);
                return;
            }

            // Route: GET /api/bookings/{id} — Get booking details
            if ("GET".equalsIgnoreCase(method) && path.matches("/api/bookings/\\d+")) {
                int bookingId = extractBookingId(path);
                handleGetBooking(exchange, bookingId);
                return;
            }

            sendResponse(exchange, 404, gson.toJson(ApiResponse.error("Endpoint not found.")));

        } catch (IllegalArgumentException e) {
            // 400 Bad Request — validation errors
            sendResponse(exchange, 400, gson.toJson(ApiResponse.error(e.getMessage())));
        } catch (IllegalStateException e) {
            // 409 Conflict — seat unavailable or booking already cancelled
            sendResponse(exchange, 409, gson.toJson(ApiResponse.error(e.getMessage())));
        } catch (Exception e) {
            System.err.println("Error in BookingController: " + e.getMessage());
            e.printStackTrace();
            sendResponse(exchange, 500,
                    gson.toJson(ApiResponse.error("An unexpected error occurred. Please try again.")));
        }
    }

    /**
     * POST /api/bookings
     *
     * Expected JSON body:
     * {
     *   "name": "Kishor",
     *   "mobile": "9876543210",
     *   "email": "kishor@example.com",
     *   "seatIds": ["A1", "A2"]
     * }
     */
    private void handleCreateBooking(HttpExchange exchange) throws Exception {
        String requestBody = readRequestBody(exchange);
        JsonObject json = gson.fromJson(requestBody, JsonObject.class);

        // Extract fields from the JSON request
        String name = getJsonString(json, "name");
        String mobile = getJsonString(json, "mobile");
        String email = getJsonString(json, "email");
        List<String> seatIds = getJsonStringArray(json, "seatIds");

        // Delegate to service (handles validation, transaction, etc.)
        Booking booking = bookingService.createBooking(name, mobile, email, seatIds);

        sendResponse(exchange, 201,
                gson.toJson(ApiResponse.success("Booking created successfully!", booking)));
    }

    /**
     * GET /api/bookings/{bookingId}
     */
    private void handleGetBooking(HttpExchange exchange, int bookingId) throws Exception {
        Booking booking = bookingService.getBookingById(bookingId);

        if (booking == null) {
            sendResponse(exchange, 404,
                    gson.toJson(ApiResponse.error("Booking #" + bookingId + " not found.")));
            return;
        }

        sendResponse(exchange, 200,
                gson.toJson(ApiResponse.success("Booking retrieved successfully.", booking)));
    }

    /**
     * POST /api/bookings/{bookingId}/cancel
     */
    private void handleCancelBooking(HttpExchange exchange, int bookingId) throws Exception {
        Booking booking = bookingService.cancelBooking(bookingId);

        if (booking == null) {
            sendResponse(exchange, 404,
                    gson.toJson(ApiResponse.error("Booking #" + bookingId + " not found.")));
            return;
        }

        sendResponse(exchange, 200,
                gson.toJson(ApiResponse.success("Booking #" + bookingId + " cancelled successfully.", booking)));
    }

    // =====================================================================
    // Helper methods
    // =====================================================================

    /**
     * Extracts the booking ID from the URL path.
     * e.g., "/api/bookings/42/cancel" → 42
     */
    private int extractBookingId(String path) {
        String[] parts = path.split("/");
        // Path format: /api/bookings/{id} or /api/bookings/{id}/cancel
        return Integer.parseInt(parts[3]);
    }

    /**
     * Reads the entire HTTP request body as a String.
     */
    private String readRequestBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody()) {
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    /**
     * Safely extracts a string value from a JSON object.
     */
    private String getJsonString(JsonObject json, String key) {
        if (json.has(key) && !json.get(key).isJsonNull()) {
            return json.get(key).getAsString().trim();
        }
        return null;
    }

    /**
     * Extracts a list of strings from a JSON array field.
     */
    private List<String> getJsonStringArray(JsonObject json, String key) {
        List<String> list = new ArrayList<>();
        if (json.has(key) && json.get(key).isJsonArray()) {
            JsonArray array = json.getAsJsonArray(key);
            for (JsonElement element : array) {
                list.add(element.getAsString().trim());
            }
        }
        return list;
    }

    /**
     * Sends an HTTP response.
     */
    private void sendResponse(HttpExchange exchange, int statusCode, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
