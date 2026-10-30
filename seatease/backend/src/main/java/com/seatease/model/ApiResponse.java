package com.seatease.model;

/**
 * ApiResponse — A generic wrapper for all JSON responses from the API.
 *
 * OOP Concepts demonstrated:
 * - Generics (parameterized type T for the data field).
 * - Encapsulation.
 *
 * Every API response includes:
 *   - success: whether the operation succeeded.
 *   - message: a human-readable description.
 *   - data: the payload (can be any type — Seat, Booking, List, etc.).
 */
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // Convenience factory methods
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    // --- Getters and Setters ---

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
