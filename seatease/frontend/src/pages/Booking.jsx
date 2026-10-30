import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SeatGrid from '../components/SeatGrid';
import BookingSummary from '../components/BookingSummary';
import BookingForm from '../components/BookingForm';
import { fetchAllSeats, createBooking } from '../services/api';
import { AlertCircle, RefreshCw, Armchair, ChevronRight } from 'lucide-react';

export default function Booking() {
  const navigate = useNavigate();

  // State
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('select'); // 'select' | 'form'

  const PRICE_PER_SEAT = 150;

  // Load seats from backend on mount
  useEffect(() => {
    loadSeats();
  }, []);

  const loadSeats = async () => {
    setLoadingSeats(true);
    setError(null);
    try {
      const data = await fetchAllSeats();
      setSeats(data);
      // Clean up any previously selected seats that might now be booked
      setSelectedSeatIds((prev) =>
        prev.filter((id) => {
          const s = data.find((seat) => seat.seatId === id);
          return s && s.status === 'AVAILABLE';
        })
      );
    } catch (err) {
      setError(
        err.message || 'Unable to connect to the backend server. Please verify Java server is running on port 8080.'
      );
    } finally {
      setLoadingSeats(false);
    }
  };

  // Toggle seat selection
  const handleSeatSelect = (seatId) => {
    const seat = seats.find((s) => s.seatId === seatId);
    if (!seat || seat.status !== 'AVAILABLE') return;

    setSelectedSeatIds((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedSeatIds([]);
  };

  // Submit booking to backend
  const handleBookingSubmit = async (customerData) => {
    setBookingLoading(true);
    setError(null);

    try {
      const result = await createBooking({
        ...customerData,
        seatIds: selectedSeatIds,
      });

      // Navigate to confirmation page with the returned booking object
      navigate('/confirmation', { state: { booking: result } });
    } catch (err) {
      // If seat was taken or conflict occurred
      setError(err.message || 'Booking failed. A seat may have already been booked.');
      // Refresh seats so UI displays updated state
      await loadSeats();
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb / Step Indicator */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/5">
        <div className="flex items-center gap-2 text-sm">
          <span
            onClick={() => setStep('select')}
            className={`cursor-pointer transition-colors ${
              step === 'select' ? 'text-primary font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Select Seats
          </span>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span
            className={step === 'form' ? 'text-primary font-bold' : 'text-slate-500 font-medium'}
          >
            2. Customer Details
          </span>
        </div>

        <button
          onClick={loadSeats}
          disabled={loadingSeats}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg"
          title="Refresh seat availability from server"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingSeats ? 'animate-spin' : ''}`} />
          <span>Refresh Seats</span>
        </button>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Notice: </span>
            {error}
          </div>
        </div>
      )}

      {loadingSeats && seats.length === 0 ? (
        <div className="py-24 text-center">
          <div className="inline-block p-4 rounded-full bg-primary/10 text-primary mb-4 animate-bounce">
            <Armchair className="w-8 h-8" />
          </div>
          <p className="text-slate-400 font-medium">Loading seating layout from Java server...</p>
        </div>
      ) : (
        <>
          {step === 'select' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Seat Grid */}
              <div className="lg:col-span-8 space-y-4">
                <SeatGrid
                  seats={seats}
                  selectedSeatIds={selectedSeatIds}
                  onSeatSelect={handleSeatSelect}
                />
              </div>

              {/* Right Column: Dynamic Selection Summary */}
              <div className="lg:col-span-4 sticky top-24">
                <BookingSummary
                  selectedSeats={selectedSeatIds}
                  pricePerSeat={PRICE_PER_SEAT}
                  onProceed={() => {
                    if (selectedSeatIds.length > 0) {
                      setStep('form');
                    }
                  }}
                  onClear={handleClearSelection}
                />
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <BookingForm
                selectedSeatIds={selectedSeatIds}
                pricePerSeat={PRICE_PER_SEAT}
                onSubmit={handleBookingSubmit}
                isLoading={bookingLoading}
                onBack={() => setStep('select')}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
