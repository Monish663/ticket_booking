/**
 * SeatLegend — Visual legend showing what each seat color means.
 */
export default function SeatLegend() {
  const items = [
    { color: 'bg-available/20 border-available/30', label: 'Available' },
    { color: 'bg-selected border-selected/50', label: 'Selected' },
    { color: 'bg-booked/30 border-booked/20', label: 'Booked' },
  ];

  return (
    <div className="flex items-center justify-center gap-6 py-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded ${item.color} border`} />
          <span className="text-sm text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
