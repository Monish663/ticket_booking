# SeatEase — Online Seat Booking System

> **A college-level Java OOP & JDBC Mini Project with a Modern React Frontend**

SeatEase is a complete, beginner-friendly online seat booking web application designed to demonstrate core **Object-Oriented Programming (OOP) in Java**, **JDBC connectivity**, **MySQL transaction control**, and a **clean, modern React + Tailwind CSS frontend**.

---

## 1. Project Overview

SeatEase allows users to:
1. **Browse Seating Layout**: View a 30-seat hall layout (5 rows A–E × 6 seats 1–6) with a realistic screen indicator.
2. **Select Seats Interactively**: Dynamic seat selection with live price calculation (₹150 per seat). Available seats are shown in green, selected seats in blue, and booked seats in gray.
3. **Book with Validation**: Provide name and 10-digit mobile number with server-side validation.
4. **Prevent Double Booking**: Uses database transactions with `SELECT ... FOR UPDATE` row locking to prevent race conditions and ensure ACID compliance.
5. **Receive Instant Confirmation**: Get a clear digital ticket with Booking ID, timestamp, and breakdown.
6. **Lookup & Cancel Bookings**: Search reservations by Booking ID and cancel tickets to instantly release seats back to the hall.

---

## 2. Technology Stack

### Backend
- **Language**: Java 17+
- **HTTP Server**: Built-in Java HTTP Server (`com.sun.net.httpserver.HttpServer`) — *No Spring Boot or heavy frameworks*
- **Database Driver**: MySQL Connector/J (`mysql-connector-j` 8.3.0)
- **JSON Processing**: Google Gson (`gson` 2.10.1)
- **Environment Management**: `dotenv-java` 3.0.0
- **Build Tool**: Apache Maven

### Database
- **Engine**: MySQL 8.0+
- **Database Name**: `seatease_db`
- **Data Access**: Pure JDBC with `PreparedStatement` and connection transactions (`setAutoCommit(false)`, `commit()`, `rollback()`)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **HTTP Client**: Native Fetch API

---

## 3. Project Directory Structure

```text
seatease/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── seatease/
│   │       │           ├── controller/
│   │       │           │   ├── BookingController.java
│   │       │           │   └── SeatController.java
│   │       │           ├── dao/
│   │       │           │   ├── BookingDAO.java
│   │       │           │   ├── BookingSeatDAO.java
│   │       │           │   ├── CustomerDAO.java
│   │       │           │   └── SeatDAO.java
│   │       │           ├── database/
│   │       │           │   └── DatabaseConnection.java
│   │       │           ├── main/
│   │       │           │   └── Main.java
│   │       │           ├── model/
│   │       │           │   ├── ApiResponse.java
│   │       │           │   ├── Booking.java
│   │       │           │   ├── Customer.java
│   │       │           │   └── Seat.java
│   │       │           └── service/
│   │       │               ├── BookingService.java
│   │       │               └── SeatService.java
│   │       └── resources/
│   │           └── schema.sql
│   ├── .env.example
│   ├── .env
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookingConfirmation.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   ├── BookingSummary.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Seat.jsx
│   │   │   ├── SeatGrid.jsx
│   │   │   └── SeatLegend.jsx
│   │   ├── pages/
│   │   │   ├── Booking.jsx
│   │   │   ├── Confirmation.jsx
│   │   │   ├── Home.jsx
│   │   │   └── MyBookingsPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 4. Database Setup

1. Make sure your local MySQL service is running.
2. Open MySQL CLI or MySQL Workbench and execute the script in `backend/src/main/resources/schema.sql`:

```bash
mysql -u root -p < "backend/src/main/resources/schema.sql"
```

Or copy-paste the SQL directly:
```sql
CREATE DATABASE IF NOT EXISTS seatease_db;
USE seatease_db;

-- 1. Seats Table
CREATE TABLE IF NOT EXISTS seats (
    seat_id     VARCHAR(5)      PRIMARY KEY,
    row_name    VARCHAR(1)      NOT NULL,
    seat_number INT             NOT NULL,
    price       DECIMAL(10,2)   NOT NULL,
    status      VARCHAR(20)     NOT NULL DEFAULT 'AVAILABLE'
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT             PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100)    NOT NULL,
    mobile      VARCHAR(10)     NOT NULL,
    email       VARCHAR(150)
);

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    booking_id      INT             PRIMARY KEY AUTO_INCREMENT,
    customer_id     INT             NOT NULL,
    total_amount    DECIMAL(10,2)   NOT NULL,
    booking_date    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    booking_status  VARCHAR(20)     NOT NULL DEFAULT 'CONFIRMED',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- 4. Booking Seats Mapping Table
CREATE TABLE IF NOT EXISTS booking_seats (
    booking_id  INT         NOT NULL,
    seat_id     VARCHAR(5)  NOT NULL,
    PRIMARY KEY (booking_id, seat_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (seat_id)    REFERENCES seats(seat_id)
);

-- Seed 30 seats (A1-A6, B1-B6, C1-C6, D1-D6, E1-E6)
INSERT INTO seats (seat_id, row_name, seat_number, price, status) VALUES
('A1', 'A', 1, 150.00, 'AVAILABLE'), ('A2', 'A', 2, 150.00, 'AVAILABLE'),
('A3', 'A', 3, 150.00, 'AVAILABLE'), ('A4', 'A', 4, 150.00, 'AVAILABLE'),
('A5', 'A', 5, 150.00, 'AVAILABLE'), ('A6', 'A', 6, 150.00, 'AVAILABLE'),
('B1', 'B', 1, 150.00, 'AVAILABLE'), ('B2', 'B', 2, 150.00, 'AVAILABLE'),
('B3', 'B', 3, 150.00, 'AVAILABLE'), ('B4', 'B', 4, 150.00, 'AVAILABLE'),
('B5', 'B', 5, 150.00, 'AVAILABLE'), ('B6', 'B', 6, 150.00, 'AVAILABLE'),
('C1', 'C', 1, 150.00, 'AVAILABLE'), ('C2', 'C', 2, 150.00, 'AVAILABLE'),
('C3', 'C', 3, 150.00, 'AVAILABLE'), ('C4', 'C', 4, 150.00, 'AVAILABLE'),
('C5', 'C', 5, 150.00, 'AVAILABLE'), ('C6', 'C', 6, 150.00, 'AVAILABLE'),
('D1', 'D', 1, 150.00, 'AVAILABLE'), ('D2', 'D', 2, 150.00, 'AVAILABLE'),
('D3', 'D', 3, 150.00, 'AVAILABLE'), ('D4', 'D', 4, 150.00, 'AVAILABLE'),
('D5', 'D', 5, 150.00, 'AVAILABLE'), ('D6', 'D', 6, 150.00, 'AVAILABLE'),
('E1', 'E', 1, 150.00, 'AVAILABLE'), ('E2', 'E', 2, 150.00, 'AVAILABLE'),
('E3', 'E', 3, 150.00, 'AVAILABLE'), ('E4', 'E', 4, 150.00, 'AVAILABLE'),
('E5', 'E', 5, 150.00, 'AVAILABLE'), ('E6', 'E', 6, 150.00, 'AVAILABLE');
```

---

## 5. Configuration

### Backend Configuration (`seatease/backend/.env`)
Create or edit `.env` in the `backend/` directory:
```env
DB_URL=jdbc:mysql://localhost:3306/seatease_db
DB_USERNAME=root
DB_PASSWORD=your_mysql_password_here
SERVER_PORT=8080
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend Configuration (`seatease/frontend/.env`)
Create or edit `.env` in the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 6. How to Run Locally

### Step 1: Start the Java Backend
1. Open a terminal in the `seatease/backend/` folder:
```bash
cd seatease/backend
```
2. Compile and run using Maven:
```bash
mvn clean compile exec:java -Dexec.mainClass="com.seatease.main.Main"
```
Or package and run the JAR:
```bash
mvn clean package
java -jar target/seatease-backend-1.0.0.jar
```
*Expected Console Output:*
```text
==============================================
   SeatEase Backend Server Started!
   Port:            8080
   API Base URL:    http://localhost:8080/api
   CORS Origin:     http://localhost:5173
==============================================
```

### Step 2: Start the React Frontend
1. Open a second terminal in the `seatease/frontend/` folder:
```bash
cd seatease/frontend
```
2. Install dependencies (if not already done):
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
4. Open your browser and navigate to:
```text
http://localhost:5173
```

---

## 7. REST API Documentation

### 1. Get All Seats
- **Endpoint**: `GET /api/seats`
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "All seats retrieved successfully.",
  "data": [
    {
      "seatId": "A1",
      "rowName": "A",
      "seatNumber": 1,
      "price": 150.0,
      "status": "AVAILABLE"
    },
    ...
  ]
}
```

### 2. Get Available Seats
- **Endpoint**: `GET /api/seats/available`
- **Response** (`200 OK`): Returns only seats with `status = "AVAILABLE"`.

### 3. Create Booking
- **Endpoint**: `POST /api/bookings`
- **Request Body**:
```json
{
  "name": "Kishor",
  "mobile": "9876543210",
  "email": "kishor@example.com",
  "seatIds": ["A1", "A2"]
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "message": "Booking created successfully!",
  "data": {
    "bookingId": 1,
    "customer": {
      "customerId": 1,
      "name": "Kishor",
      "mobile": "9876543210",
      "email": "kishor@example.com"
    },
    "selectedSeats": [
      { "seatId": "A1", "rowName": "A", "seatNumber": 1, "price": 150.0, "status": "BOOKED" },
      { "seatId": "A2", "rowName": "A", "seatNumber": 2, "price": 150.0, "status": "BOOKED" }
    ],
    "totalAmount": 300.0,
    "bookingDate": "2026-10-12 23:25:00",
    "bookingStatus": "CONFIRMED"
  }
}
```
- **Conflict Response** (`409 Conflict`):
```json
{
  "success": false,
  "message": "Seat 'A1' is no longer available. Please refresh and try again.",
  "data": null
}
```

### 4. Get Booking by ID
- **Endpoint**: `GET /api/bookings/{bookingId}`
- **Response** (`200 OK`): Returns booking details with customer info and seats.
- **Not Found** (`404 Not Found`):
```json
{
  "success": false,
  "message": "Booking #999 not found.",
  "data": null
}
```

### 5. Cancel Booking
- **Endpoint**: `POST /api/bookings/{bookingId}/cancel`
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Booking #1 cancelled successfully.",
  "data": {
    "bookingId": 1,
    "bookingStatus": "CANCELLED",
    ...
  }
}
```

---

## 8. Java Architecture & OOP Concepts Explanation

Every class in SeatEase was intentionally architected to demonstrate core OOP principles:

### Package `com.seatease.model`
| Class | OOP Concepts Demonstrated | Description |
|---|---|---|
| `Seat.java` | **Encapsulation** | Holds seat identifier, row, number, price, and status. All attributes are `private` and accessed via public getters and setters. |
| `Customer.java` | **Encapsulation** | Stores customer contact details. Has overloaded constructors for before-persistence and after-persistence states. |
| `Booking.java` | **Composition** | Represents a booking. Demonstrates the "HAS-A" relationship: a Booking contains a `Customer` object and a `List<Seat>` objects. |
| `ApiResponse.java` | **Generics & Abstraction** | Generic class `ApiResponse<T>` providing a unified, clean JSON contract across all API endpoints. |

### Package `com.seatease.dao` (Data Access Object)
| Class | Role & Principle |
|---|---|
| `SeatDAO.java` | Handles SQL queries on the `seats` table (`SELECT`, row-locking `SELECT ... FOR UPDATE`, `UPDATE`). |
| `CustomerDAO.java` | Handles insertion into `customers` and retrieving generated keys. |
| `BookingDAO.java` | Handles `INSERT` and `JOIN` queries for `bookings` and `customers`. |
| `BookingSeatDAO.java` | Manages the many-to-many junction table `booking_seats` using JDBC batch operations (`addBatch()`, `executeBatch()`). |

### Package `com.seatease.service` (Business Logic)
| Class | Role & Principle |
|---|---|
| `SeatService.java` | Encapsulates seat query rules and validates non-empty selection lists. |
| `BookingService.java` | **Core Business Engine**. Validates phone number patterns, calculates total price server-side, executes ACID transactions, prevents race conditions with row locking, and handles cancellation rollback. |

### Package `com.seatease.controller` (Presentation / API)
| Class | Role & Principle |
|---|---|
| `SeatController.java` | Implements `HttpHandler` (**Polymorphism**). Dispatches GET requests to `SeatService`. |
| `BookingController.java` | Implements `HttpHandler` (**Polymorphism**). Parses incoming JSON payloads with Gson, invokes `BookingService`, and returns proper HTTP status codes (`201`, `400`, `404`, `409`, `500`). |

### Package `com.seatease.database` & `com.seatease.main`
| Class | Role |
|---|---|
| `DatabaseConnection.java` | Centralized factory for JDBC connections using environment variables. |
| `Main.java` | Starts the JDK `HttpServer`, configures thread pool, registers routes, and applies a **Decorator pattern** CORS wrapper (`withCors`). |

---

## 9. College Viva & Interview Preparation Guide

### Q1: What OOP concepts did you implement in this project?
- **Encapsulation**: All fields in `Seat`, `Customer`, and `Booking` are `private`, preventing direct external mutation and providing controlled access via getters/setters.
- **Composition**: A `Booking` "has-a" `Customer` and "has" multiple `Seats`. We composed complex models from simpler entities.
- **Abstraction**: Controllers handle HTTP requests without knowing how SQL queries work. DAOs perform database operations without knowing HTTP concepts.
- **Polymorphism**: `SeatController` and `BookingController` implement the `com.sun.net.httpserver.HttpHandler` interface, providing their own implementation of the `handle(HttpExchange)` method.
- **Generics**: `ApiResponse<T>` provides type-safe responses for different payload types.

### Q2: Why did you use transactions and `SELECT ... FOR UPDATE`?
**Answer**: If two users attempt to book seat `A1` simultaneously, without locking, both requests might see the seat as `AVAILABLE`. By using a transaction (`conn.setAutoCommit(false)`) and querying `SELECT ... FOR UPDATE`, the MySQL InnoDB engine acquires an exclusive row-level lock on seat `A1`. The second request must wait until the first commits. When the second transaction inspects the seat, its status is `BOOKED`, so the transaction aborts and rolls back safely with a HTTP 409 Conflict error.

### Q3: Why is the price calculated on the backend instead of the frontend?
**Answer**: Frontend data can be easily tampered with via browser developer tools or raw API requests. To guarantee integrity, the server retrieves each seat's price directly from the database and computes the sum.

### Q4: Why use `PreparedStatement` instead of `Statement`?
**Answer**: 
1. **Security**: `PreparedStatement` automatically escapes parameters, completely preventing SQL Injection attacks.
2. **Performance**: Pre-compiled statements can be reused efficiently by the database engine.

### Q5: Why did you not use Spring Boot?
**Answer**: Standard Java OOP and built-in JDK APIs (`com.sun.net.httpserver.HttpServer` and JDBC) allow us to clearly demonstrate how HTTP handling, thread pooling, connection management, and SQL execution operate at the fundamental level without framework abstraction.

---

## 10. Troubleshooting Guide

| Issue | Cause | Solution |
|---|---|---|
| `CommunicationsException: Communications link failure` | MySQL is not running or wrong port | Verify MySQL service is started on port 3306. Check credentials in `backend/.env`. |
| `Access denied for user 'root'@'localhost'` | Incorrect MySQL password | Update `DB_PASSWORD` in `backend/.env` with your actual MySQL password. |
| `Table 'seatease_db.seats' doesn't exist` | Database script was not executed | Run `backend/src/main/resources/schema.sql` in MySQL. |
| `Port 8080 already in use` | Another process is using port 8080 | Change `SERVER_PORT=8081` in `backend/.env` and update `VITE_API_BASE_URL` in `frontend/.env`. |
| `CORS Error in Browser` | Frontend origin does not match backend | Verify `FRONTEND_ORIGIN=http://localhost:5173` matches your Vite dev server port. |
