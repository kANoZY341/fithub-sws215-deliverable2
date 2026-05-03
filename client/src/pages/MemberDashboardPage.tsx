import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Page } from '../components/Page';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { AttendanceRecord, Booking, Membership } from '../types';
import { formatDateDubai, getDaysRemaining, getDubaiDateKey } from '../lib/uaeFormat';
import { getBookingBranchName } from '../lib/branchDisplay';

const DAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};

const getNextSlotDate = (slot: string) => {
  const [dayLabel, timeLabel] = slot.split(' ');
  const [hours, minutes] = (timeLabel || '00:00').split(':').map(Number);
  const targetDay = DAY_MAP[dayLabel];
  if (targetDay === undefined) return null;

  const now = new Date();
  const candidate = new Date(now);
  const dayDiff = (targetDay - candidate.getDay() + 7) % 7;
  candidate.setDate(candidate.getDate() + dayDiff);
  candidate.setHours(hours || 0, minutes || 0, 0, 0);

  if (candidate <= now) {
    candidate.setDate(candidate.getDate() + 7);
  }

  return candidate;
};

const calculateStreak = (records: AttendanceRecord[]) => {
  const uniqueDays = new Set(records.map((record) => getDubaiDateKey(record.checkedInAt)));
  if (!uniqueDays.size) return 0;

  const sortedDays = Array.from(uniqueDays).sort((a, b) => (a > b ? -1 : 1));
  const todayKey = getDubaiDateKey(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getDubaiDateKey(yesterday);

  if (sortedDays[0] !== todayKey && sortedDays[0] !== yesterdayKey) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sortedDays.length; i += 1) {
    const [prevYear, prevMonth, prevDay] = sortedDays[i - 1].split('-').map(Number);
    const [currYear, currMonth, currDay] = sortedDays[i].split('-').map(Number);
    const prev = Date.UTC(prevYear, prevMonth - 1, prevDay);
    const current = Date.UTC(currYear, currMonth - 1, currDay);
    const diffDays = Math.round((prev - current) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
};

export function MemberDashboardPage() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([api.get('/memberships/my'), api.get('/bookings/my'), api.get('/attendance/my')])
      .then(([membershipRes, bookingRes, attendanceRes]) => {
        setMemberships(membershipRes.data);
        setBookings(bookingRes.data);
        setAttendance(attendanceRes.data);
        setMessage('');
      })
      .catch((err: any) => {
        setMemberships([]);
        setBookings([]);
        setAttendance([]);
        setMessage(err?.response?.data?.message || 'Unable to load dashboard data from the backend.');
      });
  }, []);

  const activeMembership = useMemo(
    () => memberships.find((membership) => membership.status === 'active'),
    [memberships]
  );

  const nextBooking = useMemo(() => {
    const upcoming = bookings
      .filter((booking) => booking.status !== 'cancelled')
      .map((booking) => ({ booking, nextDate: getNextSlotDate(booking.slot) }))
      .filter((item) => item.nextDate)
      .sort((a, b) => (a.nextDate!.getTime() - b.nextDate!.getTime()));
    return upcoming[0]?.booking;
  }, [bookings]);

  const now = new Date();
  const dubaiMonthKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dubai',
    year: 'numeric',
    month: '2-digit'
  }).format(now);
  const monthAttendance = attendance.filter((record) =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Dubai',
      year: 'numeric',
      month: '2-digit'
    }).format(new Date(record.checkedInAt)) === dubaiMonthKey
  ).length;
  const currentStreak = calculateStreak(attendance);

  return (
    <Page title="Member Dashboard">
      {message && <p className="mb-4 text-sm text-red-600">{message}</p>}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-sm text-slate-500">Welcome back</p>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-sm">Preferred branch: {user?.preferredBranch || 'Not selected'}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-sm text-slate-500">Active membership</p>
          {activeMembership ? (
            <>
              <p className="font-semibold">{activeMembership.planId?.name}</p>
              <p className="text-sm">Expiry: {formatDateDubai(activeMembership.endDate)}</p>
              <p className="text-sm">Days remaining: {getDaysRemaining(activeMembership.endDate)}</p>
            </>
          ) : (
            <Link to="/plans" className="text-sm text-brand-700 hover:underline">Choose a membership plan</Link>
          )}
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-sm text-slate-500">Next booking</p>
          {nextBooking ? (
            <>
              <p className="font-semibold">{'name' in nextBooking.trainerId ? nextBooking.trainerId.name : 'Trainer'}</p>
              <p className="text-sm">{getBookingBranchName(nextBooking) || 'Branch not set'}</p>
              <p className="text-sm">{nextBooking.slot}</p>
            </>
          ) : (
            <p className="text-sm text-slate-500">No bookings yet</p>
          )}
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-sm text-slate-500">Check-ins this month</p>
          <p className="text-2xl font-semibold">{monthAttendance}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-sm text-slate-500">Current streak</p>
          <p className="text-2xl font-semibold">{currentStreak} days</p>
        </div>
        <Link to="/my-bookings" className="bg-brand-600 text-white shadow rounded-xl p-4 hover:bg-brand-500 transition-colors flex items-center justify-between">
          <span className="font-medium">View My Bookings</span>
          <span className="text-sm">Open</span>
        </Link>
      </div>

      <div className="mt-4 bg-white rounded-xl p-4 shadow">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link className="rounded bg-brand-600 px-3 py-2 text-white text-sm" to="/plans">View Plans</Link>
          <Link className="rounded bg-brand-600 px-3 py-2 text-white text-sm" to="/trainers">Book Trainer</Link>
          <Link className="rounded bg-brand-600 px-3 py-2 text-white text-sm" to="/attendance">Check-in</Link>
        </div>
      </div>
    </Page>
  );
}
