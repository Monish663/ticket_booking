import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Ticket,
  User,
  Calendar,
  AlertCircle,
  XCircle,
  CheckCircle,
  Phone,
  Mail,
  IndianRupee,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { fetchBooking, cancelBooking } from '../services/api';

export default function MyBookings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookingIdInput, setBookingIdInput] = useState(searchParams.get('id') || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Cancellation modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Auto-search if ID is present in query parameters
  useEffect(() => {
    const idFromQuery = searchParams.get('id');
    if (idFromQuery && !booking) {
      handleSearch(idFromQuery);
    }
  }, [searchParams]);

  const handleSearch = async (idToSearch) => {
    const id = idToSearch || bookingIdInput.trim();
    if (!id) {
      setError('Please enter a valid Booking ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const data = await fetchBooking(id);
      setBooking(data);
      setSearchParams({ id });
    } catch (err) {
      setBooking(null);
      setError(err.message || `No booking found with ID #${id}`);
    } finally {
      setLoading(false);
    }
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(bookingIdInput);
  };

  const handleConfirmCancel = async () => {
    if (!booking) return;

    setCancelLoading(true);
    setError(null);

    try {
      const updated = await cancelBooking(booking.bookingId);
      setBooking(updated);
      setShowCancelModal(false);
      setSuccessMsg(`Booking #${booking.bookingId} has been successfully cancelled. The seats are now available.`);
    } catch (err) {
      setError(err.message || 'Failed to cancel the booking.');
      setShowCancelModal(false);
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    if (typeof date === 'string') {
      return new Date(date).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    }
    return String(date);
  };

  const isCancelled = booking?.bookingStatus === 'CANCELLED';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Search Header Card */}
      <div className="bg-surface rounded-2xl border border-white/5 p-6 sm:p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">Find Your Booking</h2>
        <p className="text-slate-400 text-sm mb-6">
          Enter your numeric Booking ID to view your reservation details or manage seat cancellations.
        </p>

        <form onSubmit={onSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="number"
              min="1"
              value={bookingIdInput}
              onChange={(e) => setBookingIdInput(e.target.value)}
              placeholder="e.g. 1"
              className="w-full bg-background border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-cyan-400 text-background font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <span>Search Booking</span>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-4 rounded-xl bg-available/10 border border-available/20 text-available text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Booking Details Card */}
      {booking && (
        <div className="bg-surface rounded-2xl border border-white/5 shadow-2xl overflow-hidden animate-fadeIn">
          {/* Header Strip */}
          <div
            className={`p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isCancelled ? 'bg-red-500/5' : 'bg-primary/5'
            }`}
          >
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400">Booking Reference</div>
              <div className="text-2xl font-bold font-mono text-white mt-0.5">
                #{booking.bookingId}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                  isCancelled
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : 'bg-available/10 text-available border-available/30'
                }`}
              >
                {isCancelled ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                {booking.bookingStatus}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Customer & Timestamp row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background/60 rounded-xl p-4 border border-white/5 space-y-2">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" /> Customer Details
                </div>
                <div className="text-white font-semibold">{booking.customer?.name}</div>
                <div className="text-slate-400 text-sm flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> +91 {booking.customer?.mobile}
                </div>
                {booking.customer?.email && (
                  <div className="text-slate-400 text-sm flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-500" /> {booking.customer?.email}
                  </div>
                )}
              </div>

              <div className="bg-background/60 rounded-xl p-4 border border-white/5 space-y-2">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Booking Timestamp
                </div>
                <div className="text-white font-medium">{formatDate(booking.bookingDate)}</div>
                <p className="text-xs text-slate-500 pt-1">
                  Status: {isCancelled ? 'Booking Cancelled' : 'Confirmed & Active'}
                </p>
              </div>
            </div>

            {/* Seats Reserved */}
            <div className="bg-background/60 rounded-xl p-5 border border-white/5 space-y-4">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-primary" /> Seats Reserved
              </div>

              <div className="flex flex-wrap gap-2">
                {booking.selectedSeats?.map((seat) => (
                  <span
                    key={seat.seatId || seat}
                    className={`px-3 py-1 rounded-lg text-sm font-mono font-bold border ${
                      isCancelled
                        ? 'bg-booked/20 text-booked border-booked/30 line-through'
                        : 'bg-primary/10 text-primary border-primary/30'
                    }`}
                  >
                    Seat {seat.seatId || seat}
                  </span>
                ))}
              </div>

              <div className="border-t border-white/5 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Seats Count:</span>
                  <span className="text-white font-medium">{booking.selectedSeats?.length || 0}</span>
                </div>
                <div className="flex justify-between text-slate-200 font-semibold pt-1 border-t border-white/5 text-base">
                  <span className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4 text-primary" /> Total Amount:
                  </span>
                  <span className="text-xl font-bold text-primary">₹{booking.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Cancel Button */}
            <div className="pt-2">
              {isCancelled ? (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5 text-slate-400 text-sm text-center">
                  This booking has been cancelled and cannot be cancelled again.
                </div>
              ) : (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                >
                  Cancel Booking & Release Seats
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog / Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-surface max-w-md w-full rounded-2xl border border-white/10 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-white">Cancel Booking #{booking?.bookingId}?</h3>
              <p className="text-slate-400 text-sm mt-2">
                Are you sure you want to cancel this booking? The status will be marked as{' '}
                <span className="text-red-400 font-semibold">CANCELLED</span>, and the reserved seats will immediately be made available for others to book.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
                className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-medium py-2.5 px-4 rounded-xl transition-colors"
              >
                No, Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancelLoading}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
              >
                {cancelLoading ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
