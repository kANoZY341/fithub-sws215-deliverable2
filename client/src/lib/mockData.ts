import type { Plan, Trainer } from '../types';

export const mockPlans: Plan[] = [
  {
    _id: 'starter-30',
    name: 'Starter 30',
    price: 249,
    durationDays: 30,
    features: ['Full gym access', '1 trainer consultation', 'Locker access'],
    active: true
  },
  {
    _id: 'pro-90',
    name: 'Pro 90',
    price: 649,
    durationDays: 90,
    features: ['Full gym access', '6 PT sessions', 'Group classes', 'Recovery zone'],
    active: true
  },
  {
    _id: 'elite-180',
    name: 'Elite 180',
    price: 1199,
    durationDays: 180,
    features: ['Unlimited classes', '12 PT sessions', 'Priority booking', 'Nutrition check-ins'],
    active: true
  }
];

export const mockTrainers: Trainer[] = [
  {
    _id: 'trainer-ahmed',
    name: 'Ahmed Al Mansoori',
    specialty: 'Strength & Conditioning',
    bio: 'Focuses on progressive strength programs for busy professionals in Dubai.',
    languages: ['Arabic', 'English'],
    availableSlots: ['Mon 18:00', 'Wed 20:00', 'Fri 10:00'],
    branchName: 'Dubai - Al Barsha'
  },
  {
    _id: 'trainer-sarah',
    name: 'Sarah Khan',
    specialty: 'Fat Loss & HIIT',
    bio: 'Designs efficient workouts for sustainable fat loss and stamina improvement.',
    languages: ['English', 'Hindi', 'Urdu'],
    availableSlots: ['Tue 19:00', 'Thu 18:30', 'Sat 09:00'],
    branchName: 'Abu Dhabi - Al Reem'
  },
  {
    _id: 'trainer-omar',
    name: 'Omar Haddad',
    specialty: 'Mobility & Rehab',
    bio: 'Specializes in safe return-to-training plans and movement quality.',
    languages: ['Arabic', 'English', 'French'],
    availableSlots: ['Sun 11:00', 'Tue 17:30', 'Thu 20:00'],
    branchName: 'Sharjah - Al Majaz'
  }
];
