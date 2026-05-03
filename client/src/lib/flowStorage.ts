export interface BookingDraft {
  bookingId?: string;
  trainerId: string;
  trainerName: string;
  slot: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  memberName: string;
  phone: string;
  branch: string;
  notes?: string;
}

export interface BookingSelection {
  trainerId: string;
  trainerName: string;
  specialty: string;
  slot: string;
  branchName?: string;
}

export interface CheckoutDraft {
  membershipId?: string;
  planId: string;
  planName: string;
  amount: number;
  durationDays: number;
  fullName: string;
  email: string;
  phone: string;
  cardLast4: string;
}

const BOOKING_KEY = 'fithub_booking_draft';
const BOOKING_SELECTION_KEY = 'fithub_booking_selection';
const CHECKOUT_KEY = 'fithub_checkout_draft';

export const saveBookingDraft = (payload: BookingDraft) => {
  localStorage.setItem(BOOKING_KEY, JSON.stringify(payload));
};

export const readBookingDraft = () => {
  const raw = localStorage.getItem(BOOKING_KEY);
  return raw ? (JSON.parse(raw) as BookingDraft) : null;
};

export const clearBookingDraft = () => localStorage.removeItem(BOOKING_KEY);

export const saveBookingSelection = (payload: BookingSelection) => {
  localStorage.setItem(BOOKING_SELECTION_KEY, JSON.stringify(payload));
};

export const readBookingSelection = () => {
  const raw = localStorage.getItem(BOOKING_SELECTION_KEY);
  return raw ? (JSON.parse(raw) as BookingSelection) : null;
};

export const clearBookingSelection = () => localStorage.removeItem(BOOKING_SELECTION_KEY);

export const saveCheckoutDraft = (payload: CheckoutDraft) => {
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(payload));
};

export const readCheckoutDraft = () => {
  const raw = localStorage.getItem(CHECKOUT_KEY);
  return raw ? (JSON.parse(raw) as CheckoutDraft) : null;
};

export const clearCheckoutDraft = () => localStorage.removeItem(CHECKOUT_KEY);
