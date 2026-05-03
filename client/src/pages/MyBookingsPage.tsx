import { useEffect, useState } from 'react';
import { Page } from '../components/Page';
import { api } from '../lib/api';
import type { Booking } from '../types';
import { getBookingBranchName } from '../lib/branchDisplay';

export function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/bookings/my');
      setBookings(data);
      setError('');
    } catch (err: any) {
      setBookings([]);
      setError(err?.response?.data?.message || 'Unable to load bookings from the backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    try {
      await api.delete(`/bookings/${id}`);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to delete booking.');
    }
  };

  return (
    <Page title="My Bookings">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {!loading && !bookings.length && !error && <p className="text-sm text-slate-500">No bookings yet.</p>}
      {!!bookings.length && (
        <>
          <div className="mb-4 bg-white rounded-xl shadow p-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm text-slate-500">Total upcoming sessions</p>
              <p className="text-2xl font-semibold">{bookings.filter((b) => b.status !== 'cancelled').length}</p>
            </div>
            <p className="text-xs text-slate-500">Booking status updates are managed by admin confirmation flow.</p>
          </div>
          <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Trainer</th>
                <th className="p-3 text-left">Branch</th>
                <th className="p-3 text-left">Slot</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-3">{'name' in b.trainerId ? b.trainerId.name : 'Trainer'}</td>
                  <td className="p-3">{getBookingBranchName(b) || '-'}</td>
                  <td className="p-3">{b.slot}</td>
                  <td className="p-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs capitalize ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : b.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="text-sm text-red-600" onClick={() => remove(b._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </Page>
  );
}
