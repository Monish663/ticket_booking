import { Link } from 'react-router-dom';
import { ArrowRight, Ticket, Users, CheckCircle } from 'lucide-react';

/**
 * Hero — Landing page hero section.
 * Shows tagline, description, seat stats, and a CTA button.
 *
 * Props:
 * - totalSeats: total number of seats
 * - availableSeats: number of available seats
 * - bookedSeats: number of booked seats
 */
export default function Hero({ totalSeats, availableSeats, bookedSeats }) {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <Ticket className="w-4 h-4" />
            Online Seat Booking System
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Your Seat,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              Your Choice
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Select your preferred seats from our interactive seating layout, enter your details,
            and receive instant booking confirmation. Simple, fast, and reliable.
          </p>

          {/* CTA Button */}
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 bg-primary hover:bg-cyan-400 text-background font-semibold px-8 py-3.5 rounded-xl text-base transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
          >
            Book Your Seat
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Total Seats"
            value={totalSeats}
            color="text-white"
            bgColor="bg-white/5"
          />
          <StatCard
            icon={<CheckCircle className="w-5 h-5" />}
            label="Available"
            value={availableSeats}
            color="text-available"
            bgColor="bg-available/5"
          />
          <StatCard
            icon={<Ticket className="w-5 h-5" />}
            label="Booked"
            value={bookedSeats}
            color="text-booked"
            bgColor="bg-booked/5"
          />
        </div>

        {/* Instructions */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-white text-center mb-6">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Select Seats', desc: 'Choose available seats from the interactive layout.' },
              { step: '2', title: 'Enter Details', desc: 'Fill in your name, mobile, and email (optional).' },
              { step: '3', title: 'Get Confirmation', desc: 'Receive your booking ID and confirmation instantly.' },
            ].map((item) => (
              <div key={item.step} className="bg-surface rounded-xl p-5 border border-white/5 text-center">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="text-white font-medium mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, color, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-5 border border-white/5 text-center`}>
      <div className={`${color} flex items-center justify-center gap-2 mb-2`}>
        {icon}
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  );
}
