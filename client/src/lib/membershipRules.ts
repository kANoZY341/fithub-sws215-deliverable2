import type { Membership } from '../types';

export const ACTIVE_MEMBERSHIP_MESSAGE =
  'You already have an active membership plan. Please cancel or wait until it expires before choosing a new plan.';

export const LOGIN_REQUIRED_MEMBERSHIP_MESSAGE =
  'Please log in first to subscribe to a membership plan.';

export const hasActiveMembership = (memberships: Membership[]) => {
  const now = new Date();
  return memberships.some((membership) =>
    membership.status === 'active' && new Date(membership.endDate) >= now
  );
};
