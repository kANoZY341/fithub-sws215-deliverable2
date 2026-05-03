import type { Booking, Membership, Plan } from '../types';
import type { BookingDraft, BookingSelection, CheckoutDraft } from './flowStorage';
import { readAccountProfile, saveAccountProfile } from './accountProfile';

const PHONE_KEY = 'fithub_profile_phone';
const DEMO_BOOKINGS_KEY = 'fithub_demo_bookings';
const DEMO_ACTIVE_MEMBERSHIP_KEY = 'fithub_demo_active_membership';

export const saveProfilePhone = (phone: string) => {
  const trimmed = phone.trim();
  localStorage.setItem(PHONE_KEY, trimmed);
  const account = readAccountProfile();
  if (account) {
    saveAccountProfile({ ...account, phone: trimmed });
  }
};

export const readProfilePhone = () => {
  const accountPhone = readAccountProfile()?.phone;
  if (accountPhone) return accountPhone;
  return localStorage.getItem(PHONE_KEY) || '';
};

export const readDemoBookings = (): Booking[] => {
  const raw = localStorage.getItem(DEMO_BOOKINGS_KEY);
  return raw ? (JSON.parse(raw) as Booking[]) : [];
};

export const saveDemoBookings = (bookings: Booking[]) => {
  localStorage.setItem(DEMO_BOOKINGS_KEY, JSON.stringify(bookings));
};

export const upsertDemoBookingFromDraft = (draft: BookingDraft) => {
  const next: Booking = {
    _id: `demo-booking-${Date.now()}`,
    trainerId: {
      _id: draft.trainerId,
      name: draft.trainerName,
      specialty: 'Personal Training'
    },
    slot: draft.slot,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  const current = readDemoBookings();
  saveDemoBookings([next, ...current].slice(0, 10));
};

export const createSeedDemoBooking = (selection: BookingSelection | null): Booking => ({
  _id: 'demo-booking-seed',
  trainerId: {
    _id: selection?.trainerId || 'trainer-demo',
    name: selection?.trainerName || 'Ahmed Al Mansoori',
    specialty: selection?.specialty || 'Strength & Conditioning'
  },
  slot: selection?.slot || 'Fri 10:00',
  status: 'confirmed',
  createdAt: new Date().toISOString()
});

const createPlanFromDraft = (draft: CheckoutDraft): Plan => ({
  _id: draft.planId,
  name: draft.planName,
  price: draft.amount,
  durationDays: draft.durationDays,
  features: ['Full gym access', 'Trainer booking support'],
  active: true
});

export const buildMembershipFromCheckoutDraft = (draft: CheckoutDraft): Membership => {
  const start = new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + draft.durationDays);

  return {
    _id: `demo-membership-${Date.now()}`,
    planId: createPlanFromDraft(draft),
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    status: 'active'
  };
};

export const saveActiveMembership = (membership: Membership) => {
  localStorage.setItem(DEMO_ACTIVE_MEMBERSHIP_KEY, JSON.stringify(membership));
};

export const readActiveMembership = (): Membership | null => {
  const raw = localStorage.getItem(DEMO_ACTIVE_MEMBERSHIP_KEY);
  return raw ? (JSON.parse(raw) as Membership) : null;
};

export const applySingleActiveMembershipPolicy = (
  memberships: Membership[],
  preferredActive: Membership | null
): Membership[] => {
  const withPreferred = preferredActive
    ? [preferredActive, ...memberships.filter((m) => m._id !== preferredActive._id)]
    : [...memberships];

  const activeIndexes = withPreferred
    .map((membership, index) => ({ membership, index }))
    .filter((item) => item.membership.status === 'active');

  if (!activeIndexes.length) return withPreferred;

  const keepActiveIndex = activeIndexes.reduce((latest, current) =>
    new Date(current.membership.endDate).getTime() > new Date(latest.membership.endDate).getTime() ? current : latest
  ).index;

  return withPreferred.map((membership, index) => {
    if (membership.status !== 'active') return membership;
    if (index === keepActiveIndex) return membership;
    return { ...membership, status: 'expired' as const };
  });
};
