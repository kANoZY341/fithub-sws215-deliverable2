import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Page } from '../../components/Page';
import { api } from '../../lib/api';
import { formatDateTimeDubai } from '../../lib/uaeFormat';

interface AdminDashboardData {
  metrics: {
    totalUsers: number;
    activeMemberships: number;
    pendingBookings: number;
    confirmedBookings: number;
    checkInsToday: number;
  };
  recentActivity: { type: 'booking' | 'attendance'; createdAt: string; text: string }[];
}

export function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardData>({
    metrics: {
      totalUsers: 0,
      activeMemberships: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      checkInsToday: 0
    },
    recentActivity: []
  });

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setDashboard(res.data))
      .catch(() => setDashboard((prev) => ({ ...prev, recentActivity: [] })));
  }, []);

  return (
    <Page title="Admin Dashboard">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="text-2xl font-semibold">{dashboard.metrics.totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-slate-500">Active Memberships</p>
          <p className="text-2xl font-semibold">{dashboard.metrics.activeMemberships}</p>
        </div>
        <Link to="/admin/bookings" className="bg-white rounded-xl shadow p-4 hover:bg-slate-50">
          <p className="text-sm text-slate-500">Bookings</p>
          <p className="text-2xl font-semibold">
            {dashboard.metrics.pendingBookings} pending / {dashboard.metrics.confirmedBookings} confirmed
          </p>
        </Link>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-slate-500">Check-ins Today</p>
          <p className="text-2xl font-semibold">{dashboard.metrics.checkInsToday}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link to="/admin/plans" className="rounded bg-brand-600 px-3 py-2 text-sm font-medium text-white">Manage Plans</Link>
        <Link to="/admin/trainers" className="rounded bg-brand-600 px-3 py-2 text-sm font-medium text-white">Manage Trainers</Link>
        <Link to="/admin/bookings" className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white">Manage Bookings</Link>
        <Link to="/admin/users" className="rounded border border-slate-300 px-3 py-2 text-sm font-medium">View Users</Link>
        <Link to="/admin/reports" className="rounded border border-slate-300 px-3 py-2 text-sm font-medium">Reports</Link>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        <div className="space-y-2 text-sm">
          {!dashboard.recentActivity.length && <p className="text-slate-500">No recent activity.</p>}
          {dashboard.recentActivity.map((activity, index) => (
            <div key={`${activity.createdAt}-${index}`} className="flex flex-wrap items-center justify-between rounded border border-slate-100 p-2">
              <p>{activity.text}</p>
              <p className="text-xs text-slate-500">{formatDateTimeDubai(activity.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}
