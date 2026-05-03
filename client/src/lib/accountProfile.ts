import type { AuthUser } from '../types';

export interface AccountProfile {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

const ACCOUNT_PROFILE_KEY = 'fithub_account_profile';

export const readAccountProfile = (): AccountProfile | null => {
  const raw = localStorage.getItem(ACCOUNT_PROFILE_KEY);
  return raw ? (JSON.parse(raw) as AccountProfile) : null;
};

export const saveAccountProfile = (profile: AccountProfile) => {
  localStorage.setItem(ACCOUNT_PROFILE_KEY, JSON.stringify(profile));
};

export const mergeUserWithProfile = (user: AuthUser, profile: AccountProfile | null): AuthUser => {
  if (!profile) return user;
  if (profile.email.toLowerCase() !== user.email.toLowerCase()) return user;

  return {
    ...user,
    firstName: profile.firstName,
    lastName: profile.lastName,
    fullName: profile.fullName,
    name: profile.fullName || user.name,
    phone: user.phone || profile.phone,
    role: user.role
  };
};
