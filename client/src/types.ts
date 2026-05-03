export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  phone?: string;
  role: UserRole;
  preferredBranch?: string;
}

export interface Plan {
  _id: string;
  name: string;
  price: number;
  durationDays: number;
  features: string[];
  active: boolean;
}

export interface Trainer {
  _id: string;
  name: string;
  specialty: string;
  bio: string;
  languages: string[];
  availableSlots: string[];
  branchId?: string | Branch;
  branchName: string;
}

export interface Booking {
  _id: string;
  userId?: { _id: string; name: string; email: string } | string;
  trainerId: Trainer | { _id: string; name: string; specialty: string; branchName?: string; branchId?: string | Branch };
  branchId?: string | Branch;
  branchName?: string;
  slot: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Membership {
  _id: string;
  planId: Plan;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired';
}

export interface AttendanceRecord {
  _id: string;
  userId?: { _id: string; name: string; email: string };
  checkedInAt: string;
  method: 'manual';
  note?: string;
}

export interface Branch {
  _id: string;
  name: string;
  city: string;
  area: string;
  active: boolean;
}
