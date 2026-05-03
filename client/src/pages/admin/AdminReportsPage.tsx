import { useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { api } from '../../lib/api';

export function AdminReportsPage() {
  const [stats, setStats] = useState({
    users: 0,
    regularUsers: 0,
    admins: 0,
    plans: 0,
    trainers: 0,
    bookings: 0,
    memberships: 0,
    attendance: 0,
    activeMemberships: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/admin/reports')
      .then((res) => {
        setStats(res.data);
        setMessage('');
      })
      .catch((err: any) => setMessage(err?.response?.data?.message || 'Failed to load reports'));
  }, []);

  return (
    <Page title="Admin Reports">
      {message && <p className="mb-4 text-sm text-red-600">{message}</p>}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4"><p className="text-slate-500 text-sm">Users</p><p className="text-3xl font-bold">{stats.users}</p><p className="text-xs text-slate-500">{stats.regularUsers} members / {stats.admins} admins</p></div>
        <div className="bg-white rounded-xl shadow p-4"><p className="text-slate-500 text-sm">Plans</p><p className="text-3xl font-bold">{stats.plans}</p></div>
        <div className="bg-white rounded-xl shadow p-4"><p className="text-slate-500 text-sm">Trainers</p><p className="text-3xl font-bold">{stats.trainers}</p></div>
        <div className="bg-white rounded-xl shadow p-4"><p className="text-slate-500 text-sm">Total Bookings</p><p className="text-3xl font-bold">{stats.bookings}</p></div>
        <div className="bg-white rounded-xl shadow p-4"><p className="text-slate-500 text-sm">Total Memberships</p><p className="text-3xl font-bold">{stats.memberships}</p></div>
        <div className="bg-white rounded-xl shadow p-4"><p className="text-slate-500 text-sm">Total Attendance</p><p className="text-3xl font-bold">{stats.attendance}</p></div>
        <div className="bg-white rounded-xl shadow p-4"><p className="text-slate-500 text-sm">Active Memberships</p><p className="text-3xl font-bold">{stats.activeMemberships}</p></div>
        <div className="bg-white rounded-xl shadow p-4"><p className="text-slate-500 text-sm">Pending Bookings</p><p className="text-3xl font-bold">{stats.pendingBookings}</p></div>
        <div className="bg-white rounded-xl shadow p-4"><p className="text-slate-500 text-sm">Confirmed Bookings</p><p className="text-3xl font-bold">{stats.confirmedBookings}</p><p className="text-xs text-slate-500">{stats.cancelledBookings} cancelled</p></div>
      </div>
    </Page>
  );
}
