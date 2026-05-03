import { useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { api } from '../../lib/api';
import type { Booking } from '../../types';
import { getBookingBranchName } from '../../lib/branchDisplay';

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState('');

  const load = async () => {
    const { data } = await api.get('/bookings');
    setBookings(data);
  };

  useEffect(() => { load().catch(() => setMessage('Failed to load bookings')); }, []);

  const setStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      setMessage('Booking updated');
      await load();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Update failed');
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/bookings/${id}`);
      setMessage('Booking deleted');
      await load();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Page title="Admin Manage Bookings">
      {message && <p className="text-sm mb-2">{message}</p>}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100"><tr><th className="p-3 text-left">Member</th><th className="p-3 text-left">Trainer</th><th className="p-3 text-left">Branch</th><th className="p-3 text-left">Slot</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Action</th></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="p-3">{typeof b.userId === 'object' && b.userId ? b.userId.name : 'User'}</td>
                <td className="p-3">{'name' in b.trainerId ? b.trainerId.name : 'Trainer'}</td>
                <td className="p-3">{getBookingBranchName(b) || '-'}</td>
                <td className="p-3">{b.slot}</td>
                <td className="p-3 capitalize">{b.status}</td>
                <td className="p-3 flex gap-2">
                  <button className="text-xs px-2 py-1 bg-green-100 rounded" onClick={() => setStatus(b._id, 'confirmed')}>Confirm</button>
                  <button className="text-xs px-2 py-1 bg-yellow-100 rounded" onClick={() => setStatus(b._id, 'pending')}>Pending</button>
                  <button className="text-xs px-2 py-1 bg-red-100 rounded" onClick={() => setStatus(b._id, 'cancelled')}>Cancel</button>
                  <button className="text-xs px-2 py-1 bg-slate-100 rounded" onClick={() => remove(b._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}
