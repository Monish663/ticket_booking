import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { fetchAllSeats } from '../services/api';

export default function Home() {
  const [stats, setStats] = useState({
    total: 30,
    available: 30,
    booked: 0,
  });

  useEffect(() => {
    // Fetch live seat statistics from the Java backend
    const loadSeatStats = async () => {
      try {
        const seats = await fetchAllSeats();
        const available = seats.filter((s) => s.status === 'AVAILABLE').length;
        const booked = seats.filter((s) => s.status === 'BOOKED').length;
        setStats({
          total: seats.length,
          available,
          booked,
        });
      } catch (err) {
        console.warn('Could not load live seat stats:', err.message);
        // Fall back to default 30 seats
      }
    };

    loadSeatStats();
  }, []);

  return (
    <div>
      <Hero
        totalSeats={stats.total}
        availableSeats={stats.available}
        bookedSeats={stats.booked}
      />
    </div>
  );
}
