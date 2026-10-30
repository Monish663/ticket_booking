import React from 'react';
import { Armchair, Heart, Code2, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Note */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Armchair className="w-4 h-4 text-primary" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Seat<span className="text-primary">Ease</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 mt-2 max-w-sm">
              Online Seat Booking System — College Java OOP & JDBC Mini Project.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/booking" className="hover:text-primary transition-colors">
              Book Seats
            </Link>
            <Link to="/my-bookings" className="hover:text-primary transition-colors">
              My Bookings
            </Link>
          </div>

          {/* Tech stack badge */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-primary" /> React + Java 17
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-primary" /> MySQL JDBC
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SeatEase. Designed for demonstration and viva presentation.
        </div>
      </div>
    </footer>
  );
}
