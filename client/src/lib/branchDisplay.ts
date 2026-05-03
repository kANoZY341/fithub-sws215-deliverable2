import type { Booking, Trainer } from '../types';

export const getTrainerBranchName = (trainer?: Pick<Trainer, 'branchId' | 'branchName'> | null) => {
  if (!trainer) return '';
  if (trainer.branchName) return trainer.branchName;
  if (trainer.branchId && typeof trainer.branchId === 'object') return trainer.branchId.name;
  return '';
};

export const getBookingBranchName = (booking: Booking) => {
  if (booking.branchName) return booking.branchName;
  if (booking.branchId && typeof booking.branchId === 'object') return booking.branchId.name;
  if (typeof booking.trainerId === 'object') return getTrainerBranchName(booking.trainerId as Trainer);
  return '';
};
