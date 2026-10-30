import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  User,
  Ticket,
  IndianRupee,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
} from 'lucide-react';

/**
 * BookingConfirmation — Displays full receipt and ticket details after successful booking.
 *
 * Props:
 * - booking: Object containing {
 *     bookingId,
 *     customer: { name, mobile, email },
 *     selectedSeats: [{ seatId, price, ... }],
 *     totalAmount,
 *     bookingDate,
 *     bookingStatus
 *   }
 */
export default function BookingConfirmation({ booking }) {
  const [copied, setCopied] = useState(false);

  if (!booking) return null;

  const {
    bookingId,
    customer = {},
    selectedSeats = [],
    totalAmount,
    bookingDate,
    bookingStatus = 'CONFIRMED',
  } = booking;

  const seatCount = selectedSeats.length;
  const pricePerSeat = seatCount > 0 ? (totalAmount / seatCount).toFixed(0) : 150;

  // Format date nicely
  const formattedDate = bookingDate
    ? typeof bookingDate === 'string'
      ? new Date(bookingDate).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : `${bookingDate.year || ''}-${bookingDate.month || ''}-${bookingDate.day || ''}`
    : new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  const handleCopyId = () => {
    navigator.clipboard.writeText(String(bookingId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Top Success Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-available/10 text-available mb-4 border border-available/30 shadow-lg shadow-available/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Booking Confirmed!</h1>
        <p className="text-slate-400 mt-2">
          Thank you, <span className="text-white font-medium">{customer.name}</span>! Your seats have been reserved successfully.
        </p>
      </div>

      {/* Ticket / Confirmation Card */}
      <div className="bg-surface rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative">
        {/* Glow Accent Top Bar */}
        <div className="h-2 bg-gradient-to-r from-available via-primary to-blue-500" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Row: Booking ID and Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Booking Reference ID
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-mono font-bold text-primary">
                  #{bookingId}
                </span>
                <button
                  onClick={handleCopyId}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                  title="Copy Booking ID"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-available" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                {copied && <span className="text-xs text-available">Copied!</span>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-available/15 text-available border border-available/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                {bookingStatus}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="bg-background/60 rounded-xl p-4 border border-white/5 space-y-2">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" /> Customer Info
              </div>
              <div className="text-white font-semibold text-base">{customer.name}</div>
              <div className="text-slate-400 text-sm flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" /> +91 {customer.mobile}
              </div>
              {customer.email && (
                <div className="text-slate-400 text-sm flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> {customer.email}
                </div>
              )}
            </div>

            {/* Date and Time */}
            <div className="bg-background/60 rounded-xl p-4 border border-white/5 space-y-2">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Booking Date & Time
              </div>
              <div className="text-white font-semibold text-base">{formattedDate}</div>
              <p className="text-xs text-slate-500">
                Keep your Booking ID handy to view or manage your ticket later.
              </p>
            </div>
          </div>

          {/* Seats Breakdown */}
          <div className="bg-background/60 rounded-xl p-5 border border-white/5 space-y-4">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-primary" /> Reserved Seats
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <div
                  key={seat.seatId || seat}
                  className="px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/30 text-primary font-mono font-bold text-sm"
                >
                  Seat {seat.seatId || seat}
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Number of Seats</span>
                <span className="text-white font-medium">{seatCount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Price per Seat</span>
                <span className="text-white font-medium">₹{pricePerSeat}</span>
              </div>
              <div className="flex justify-between text-slate-200 font-semibold pt-2 border-t border-white/5 text-base">
                <span className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 text-primary" /> Total Amount Paid
                </span>
                <span className="text-xl font-bold text-primary">₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-6 bg-surface border-t border-white/10 flex flex-col sm:flex-row gap-3">
          <Link
            to="/booking"
            className="flex-1 text-center bg-white/5 hover:bg-white/10 text-slate-200 font-medium py-3 px-4 rounded-xl transition-colors"
          >
            Book More Seats
          </Link>
          <Link
            to={`/my-bookings?id=${bookingId}`}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-cyan-400 text-background font-semibold py-3 px-4 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
          >
            <span>View in My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
