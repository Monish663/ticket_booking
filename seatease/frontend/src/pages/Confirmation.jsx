import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import BookingConfirmation from '../components/BookingConfirmation';
import { fetchBooking } from '../services/api';
import { Ticket, ArrowLeft, RefreshCw } from 'lucide-react';

export default function Confirmation() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If not in state, attempt to load from query param ?id=...
    const idFromQuery = searchParams.get('id');
    if (!booking && idFromQuery) {
      setLoading(true);
      fetchBooking(idFromQuery)
        .then((data) => setBooking(data))
        .catch((err) => setError(err.message || 'Could not load booking details.'))
        .finally(() => setLoading(false));
    }
  }, [searchParams, booking]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
        <p className="text-slate-400">Loading booking confirmation...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="w-16 h-16 rounded-full bg-white/5 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Ticket className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Booking Found</h2>
        <p className="text-slate-400 text-sm mb-6">
          {error || 'No confirmation data available to display. Please book a seat or check your reservation in My Bookings.'}
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 bg-primary hover:bg-cyan-400 text-background font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Book Seats
          </Link>
          <Link
            to="/my-bookings"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 font-medium px-5 py-2.5 rounded-xl text-sm transition-all"
          >
            My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <BookingConfirmation booking={booking} />
    </div>
  );
}
