import Seat from './Seat';
import SeatLegend from './SeatLegend';
import { Monitor } from 'lucide-react';

/**
 * SeatGrid — Visual seating layout with 5 rows × 6 seats.
 * Shows a "screen" indicator at the top, the seat grid, and a legend.
 *
 * Props:
 * - seats: array of seat objects from the backend
 * - selectedSeatIds: array of currently selected seat IDs
 * - onSeatSelect: callback when a seat is clicked
 */
export default function SeatGrid({ seats, selectedSeatIds, onSeatSelect }) {
  // Group seats by row (A, B, C, D, E)
  const rows = ['A', 'B', 'C', 'D', 'E'];

  const getSeatsByRow = (rowName) =>
    seats.filter((s) => s.rowName === rowName).sort((a, b) => a.seatNumber - b.seatNumber);

  return (
    <div className="bg-surface rounded-2xl border border-white/5 p-6 sm:p-8">
      {/* Screen Indicator */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 text-slate-500 mb-2">
          <Monitor className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-widest">Screen</span>
        </div>
        <div className="max-w-md mx-auto h-1.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full" />
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col items-center gap-3">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-2 sm:gap-3">
            {/* Row label */}
            <span className="w-6 text-right text-sm font-medium text-slate-500">{row}</span>

            {/* Seats in this row */}
            <div className="flex gap-2 sm:gap-3">
              {getSeatsByRow(row).map((seat) => (
                <Seat
                  key={seat.seatId}
                  seat={seat}
                  isSelected={selectedSeatIds.includes(seat.seatId)}
                  onSelect={onSeatSelect}
                />
              ))}
            </div>

            {/* Row label (right side) */}
            <span className="w-6 text-left text-sm font-medium text-slate-500">{row}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6">
        <SeatLegend />
      </div>
    </div>
  );
}
