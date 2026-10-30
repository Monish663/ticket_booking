import { useState } from 'react';
import { User, Phone, Mail, Ticket, IndianRupee } from 'lucide-react';

/**
 * BookingForm — Customer details form for confirming a booking.
 *
 * Props:
 * - selectedSeatIds: array of selected seat IDs
 * - pricePerSeat: price per seat (₹150)
 * - onSubmit: callback with { name, mobile, email }
 * - isLoading: whether a booking request is in progress
 * - onBack: callback to go back to seat selection
 */
export default function BookingForm({ selectedSeatIds, pricePerSeat, onSubmit, isLoading, onBack }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const totalPrice = selectedSeatIds.length * pricePerSeat;

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Customer name is required.';
    }
    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(mobile.trim())) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits.';
    }
    if (selectedSeatIds.length === 0) {
      newErrors.seats = 'At least one seat must be selected.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim() || null,
      });
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-white/5 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-white mb-6">Customer Details</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <User className="w-4 h-4 text-primary" />
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1.5">{errors.name}</p>}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Phone className="w-4 h-4 text-primary" />
            Mobile Number <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="Enter 10-digit mobile number"
            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
          {errors.mobile && <p className="text-red-400 text-sm mt-1.5">{errors.mobile}</p>}
        </div>

        {/* Email (optional) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Mail className="w-4 h-4 text-primary" />
            Email Address <span className="text-slate-500">(optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Booking Summary */}
        <div className="bg-background rounded-xl p-5 border border-white/5 space-y-3">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Booking Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 flex items-center gap-2">
              <Ticket className="w-4 h-4" /> Selected Seats
            </span>
            <span className="text-white font-medium">{selectedSeatIds.join(', ') || '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Number of Seats</span>
            <span className="text-white font-medium">{selectedSeatIds.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Price per Seat</span>
            <span className="text-white font-medium">₹{pricePerSeat}</span>
          </div>
          <div className="border-t border-white/5 pt-3 flex justify-between">
            <span className="text-slate-300 font-medium flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-primary" /> Total Amount
            </span>
            <span className="text-primary text-lg font-bold">₹{totalPrice}</span>
          </div>
          {errors.seats && <p className="text-red-400 text-sm">{errors.seats}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-medium px-6 py-3 rounded-xl transition-all duration-200"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading || selectedSeatIds.length === 0}
            className="flex-1 bg-primary hover:bg-cyan-400 text-background font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/25"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Booking...
              </span>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
