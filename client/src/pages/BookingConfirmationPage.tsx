import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Page } from '../components/Page';
import { clearBookingDraft, readBookingDraft } from '../lib/flowStorage';

export function BookingConfirmationPage() {
  const navigate = useNavigate();
  const booking = readBookingDraft();
  const bookingRef = useMemo(
    () => `BK-${Math.floor(100000 + Math.random() * 900000)}`,
    []
  );

  useEffect(() => {
    if (!booking) navigate('/trainers');
    return () => clearBookingDraft();
  }, [booking, navigate]);

  if (!booking) return null;

  return (
    <Page title="Booking Confirmed">
      <div className="max-w-2xl bg-white rounded-xl shadow p-5 space-y-3">
        <p className="text-emerald-700 font-semibold">Your trainer session is confirmed.</p>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <p><span className="font-medium">Booking Ref:</span> {bookingRef}</p>
          {booking.bookingId && <p><span className="font-medium">MongoDB ID:</span> {booking.bookingId}</p>}
          <p><span className="font-medium">Trainer:</span> {booking.trainerName}</p>
          <p><span className="font-medium">Slot:</span> {booking.slot}</p>
          <p><span className="font-medium">Status:</span> {booking.status || 'pending'}</p>
          <p><span className="font-medium">Branch:</span> {booking.branch}</p>
          <p><span className="font-medium">Member:</span> {booking.memberName}</p>
          <p><span className="font-medium">Phone:</span> {booking.phone}</p>
        </div>
        {booking.notes && <p className="text-sm"><span className="font-medium">Notes:</span> {booking.notes}</p>}
        <div className="flex flex-wrap gap-2 pt-2">
          <Link to="/my-bookings" className="rounded bg-brand-600 text-white px-4 py-2 text-sm">View My Bookings</Link>
          <Link to="/trainers" className="rounded border border-slate-300 px-4 py-2 text-sm">Book Another Session</Link>
        </div>
      </div>
    </Page>
  );
}
