/**
 * Seat — A single clickable seat in the seating layout.
 *
 * Props:
 * - seat: { seatId, rowName, seatNumber, price, status }
 * - isSelected: boolean — whether this seat is currently selected
 * - onSelect: callback when the seat is clicked
 */
export default function Seat({ seat, isSelected, onSelect }) {
  const isBooked = seat.status === 'BOOKED';

  // Determine the visual style based on seat state
  let classes = 'w-10 h-10 sm:w-11 sm:h-11 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center ';

  if (isBooked) {
    // Booked seats — gray, not clickable
    classes += 'bg-booked/30 text-booked cursor-not-allowed border border-booked/20';
  } else if (isSelected) {
    // Selected seats — blue with a glow
    classes += 'bg-selected text-white cursor-pointer border border-selected/50 shadow-md shadow-selected/30 scale-105';
  } else {
    // Available seats — green, clickable
    classes += 'bg-available/20 text-available cursor-pointer border border-available/30 hover:bg-available/30 hover:scale-105 hover:shadow-md hover:shadow-available/20';
  }

  const handleClick = () => {
    if (!isBooked) {
      onSelect(seat.seatId);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isBooked}
      className={classes}
      title={isBooked ? `${seat.seatId} — Booked` : `${seat.seatId} — ₹${seat.price}`}
      aria-label={`Seat ${seat.seatId} — ${isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}`}
    >
      {seat.seatId}
    </button>
  );
}
