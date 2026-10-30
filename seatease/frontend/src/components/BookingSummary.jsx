import React from 'react';
import { Ticket, IndianRupee, ArrowRight, Trash2 } from 'lucide-react';

/**
 * BookingSummary — Displays selection details alongside or below the seat grid.
 *
 * Props:
 * - selectedSeats: array of seat IDs (e.g. ['A1', 'A2'])
 * - pricePerSeat: number (e.g. 150)
 * - onProceed: callback to advance to details form
 * - onClear: callback to clear selected seats
 */
export default function BookingSummary({
  selectedSeats = [],
  pricePerSeat = 150,
  onProceed,
  onClear,
}) {
  const count = selectedSeats.length;
  const totalAmount = count * pricePerSeat;

  return (
    <div className="bg-surface rounded-2xl border border-white/5 p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-white">Selection Summary</h3>
        </div>
        {count > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            title="Clear all selections"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      <div className="py-4 space-y-3">
        <div className="flex justify-between items-start text-sm">
          <span className="text-slate-400">Selected Seats:</span>
          <div className="text-right">
            {count > 0 ? (
              <div className="flex flex-wrap justify-end gap-1.5 max-w-[200px]">
                {selectedSeats.map((seatId) => (
                  <span
                    key={seatId}
                    className="px-2 py-0.5 rounded-md bg-selected/20 text-selected border border-selected/40 text-xs font-semibold"
                  >
                    {seatId}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-slate-500 italic">None selected</span>
            )}
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Seat Count:</span>
          <span className="text-white font-medium">{count}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Price Per Seat:</span>
          <span className="text-white font-medium">₹{pricePerSeat}</span>
        </div>

        <div className="border-t border-white/5 pt-3 flex justify-between items-center">
          <span className="text-slate-300 font-semibold flex items-center gap-1">
            <IndianRupee className="w-4 h-4 text-primary" /> Total Amount:
          </span>
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300">
            ₹{totalAmount}
          </span>
        </div>
      </div>

      <button
        onClick={onProceed}
        disabled={count === 0}
        className="w-full mt-2 flex items-center justify-center gap-2 bg-primary hover:bg-cyan-400 text-background font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20"
      >
        <span>Continue to Details</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {count === 0 && (
        <p className="text-xs text-center text-slate-500 mt-2">
          Click on any green available seat above to select.
        </p>
      )}
    </div>
  );
}
