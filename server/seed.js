require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Branch = require('./src/models/Branch');
const Plan = require('./src/models/Plan');
const Trainer = require('./src/models/Trainer');
const Membership = require('./src/models/Membership');
const Booking = require('./src/models/Booking');
const Attendance = require('./src/models/Attendance');
const { UAE_BRANCHES } = require('./src/constants/branches');

const daysAgo = (days, hour = 8) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const seed = async () => {
  await connectDB();

  await Promise.all([
    Attendance.deleteMany({}),
    Booking.deleteMany({}),
    Membership.deleteMany({}),
    Trainer.deleteMany({}),
    Plan.deleteMany({}),
    Branch.deleteMany({}),
    User.deleteMany({})
  ]);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@fithub.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const memberPasswordHash = await bcrypt.hash('Member@123', 10);

  const [admin, memberOne, memberTwo] = await User.create([
    {
      name: 'FitHub Admin',
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: 'admin',
      phone: '+97145550000'
    },
    {
      name: 'Aisha Khan',
      email: 'aisha@fithub.local',
      passwordHash: memberPasswordHash,
      role: 'user',
      phone: '+971501111111',
      preferredBranch: 'Dubai - Al Barsha'
    },
    {
      name: 'Omar Saeed',
      email: 'omar@fithub.local',
      passwordHash: memberPasswordHash,
      role: 'user',
      phone: '+971502222222',
      preferredBranch: 'Abu Dhabi - Al Reem'
    }
  ]);

  const branches = await Branch.insertMany(
    UAE_BRANCHES.map((branch) => ({ ...branch, active: true }))
  );
  const branchByName = Object.fromEntries(branches.map((branch) => [branch.name, branch]));

  const plans = await Plan.insertMany([
    {
      name: 'Basic Monthly',
      price: 149,
      durationDays: 30,
      features: ['Gym floor access', 'Locker room access', 'Fitness assessment'],
      active: true
    },
    {
      name: 'Flex Monthly',
      price: 199,
      durationDays: 30,
      features: ['Gym floor access', '3 group classes per week', 'Locker access'],
      active: true
    },
    {
      name: 'Momentum Quarterly',
      price: 549,
      durationDays: 90,
      features: ['Unlimited classes', '2 PT sessions monthly', 'Body composition check'],
      active: true
    },
    {
      name: 'Elite Annual',
      price: 1999,
      durationDays: 365,
      features: ['Unlimited classes', 'Priority booking', 'Monthly nutrition consult'],
      active: true
    },
    {
      name: 'Ladies Wellness',
      price: 229,
      durationDays: 30,
      features: ['Women-only classes', 'Mobility sessions', 'Wellness coaching'],
      active: true
    },
    {
      name: 'Student Flex',
      price: 129,
      durationDays: 30,
      features: ['Gym floor access', 'Off-peak class access', 'Student-friendly monthly price'],
      active: true
    },
    {
      name: 'Personal Training Plus',
      price: 799,
      durationDays: 60,
      features: ['Gym floor access', '8 personal training sessions', 'Nutrition check-in', 'Priority trainer booking'],
      active: true
    },
    {
      name: 'Family Package',
      price: 699,
      durationDays: 90,
      features: ['Access for 2 adults', 'Weekend family classes', 'Shared progress review', 'Guest locker access'],
      active: true
    }
  ]);
  const planByName = Object.fromEntries(plans.map((plan) => [plan.name, plan]));

  const trainerSeeds = [
    {
      branchName: 'Dubai - Al Barsha',
      name: 'Noor Al Mansoori',
      specialty: 'Functional Strength',
      bio: 'Dubai-based coach helping busy professionals build sustainable strength and mobility routines.',
      languages: ['Arabic', 'English'],
      availableSlots: ['Mon 07:00', 'Wed 19:00', 'Fri 08:00', 'Sat 10:00']
    },
    {
      branchName: 'Dubai - Al Barsha',
      name: 'Sara Haddad',
      specialty: 'Pilates and Posture',
      bio: 'Focuses on core stability and posture correction for desk workers and postpartum clients.',
      languages: ['Arabic', 'English', 'French'],
      availableSlots: ['Mon 18:00', 'Wed 08:00', 'Fri 16:00', 'Sat 11:30']
    },
    {
      branchName: 'Dubai - Al Barsha',
      name: 'Ahmed Darwish',
      specialty: 'Strength and Hypertrophy',
      bio: 'Builds progressive strength programs for members who want visible muscle gain and safer lifting technique.',
      languages: ['Arabic', 'English'],
      availableSlots: ['Tue 07:00', 'Thu 19:00', 'Fri 10:00', 'Sun 18:30']
    },
    {
      branchName: 'Dubai - Al Barsha',
      name: 'Lina Faris',
      specialty: 'Yoga and Mobility',
      bio: 'Guides mobility, breathwork, and yoga sessions for recovery, flexibility, and better movement quality.',
      languages: ['Arabic', 'English'],
      availableSlots: ['Mon 09:00', 'Wed 18:30', 'Sat 08:00', 'Sun 10:30']
    },
    {
      branchName: 'Abu Dhabi - Al Reem',
      name: 'Ravi Menon',
      specialty: 'Weight Management',
      bio: 'Works with UAE members on practical fat-loss plans for office schedules and hot-weather training.',
      languages: ['English', 'Hindi', 'Urdu'],
      availableSlots: ['Tue 06:30', 'Thu 18:30', 'Fri 19:00', 'Sat 09:00']
    },
    {
      branchName: 'Abu Dhabi - Al Reem',
      name: 'Bilal Qureshi',
      specialty: 'Boxing Conditioning',
      bio: 'Former amateur boxer delivering high-energy conditioning sessions and technique-focused pads.',
      languages: ['English', 'Hindi', 'Urdu'],
      availableSlots: ['Tue 19:30', 'Thu 07:30', 'Fri 17:30', 'Sat 08:30']
    },
    {
      branchName: 'Abu Dhabi - Al Reem',
      name: 'Fatima Al Nuaimi',
      specialty: "Women's Fitness",
      bio: 'Supports women with strength, confidence, and sustainable fitness plans in a welcoming coaching style.',
      languages: ['Arabic', 'English'],
      availableSlots: ['Mon 06:30', 'Wed 17:30', 'Fri 09:30', 'Sun 19:00']
    },
    {
      branchName: 'Abu Dhabi - Al Reem',
      name: 'Omar Haddad',
      specialty: 'Athletic Conditioning',
      bio: 'Coaches speed, agility, and conditioning for members preparing for sports, events, and performance goals.',
      languages: ['Arabic', 'English'],
      availableSlots: ['Tue 08:00', 'Thu 20:00', 'Sat 12:00', 'Sun 07:30']
    },
    {
      branchName: 'Sharjah - Al Majaz',
      name: 'Mariam Al Ketbi',
      specialty: 'Mobility and Rehab',
      bio: 'Helps members rebuild movement confidence with low-impact strength, mobility, and rehab-friendly sessions.',
      languages: ['Arabic', 'English'],
      availableSlots: ['Mon 08:00', 'Wed 19:30', 'Fri 07:30', 'Sat 13:00']
    },
    {
      branchName: 'Sharjah - Al Majaz',
      name: 'Khalid Hassan',
      specialty: 'Strength and Hypertrophy',
      bio: 'Creates structured strength blocks for beginners and intermediates who want measurable progress.',
      languages: ['Arabic', 'English', 'Urdu'],
      availableSlots: ['Tue 18:00', 'Thu 08:30', 'Fri 18:00', 'Sun 09:00']
    },
    {
      branchName: 'Sharjah - Al Majaz',
      name: 'Dana Youssef',
      specialty: 'HIIT and Fat Loss',
      bio: 'Runs efficient high-intensity sessions that blend conditioning, strength circuits, and smart recovery.',
      languages: ['Arabic', 'English'],
      availableSlots: ['Mon 19:00', 'Wed 07:00', 'Sat 16:00', 'Sun 11:30']
    },
    {
      branchName: 'Sharjah - Al Majaz',
      name: 'Zayed Al Hammadi',
      specialty: 'Beginner Fitness',
      bio: 'Makes first-time gym members comfortable with clear coaching, simple progressions, and habit building.',
      languages: ['Arabic', 'English'],
      availableSlots: ['Tue 09:30', 'Thu 17:30', 'Fri 11:00', 'Sat 18:30']
    }
  ];

  const trainers = await Trainer.insertMany(
    trainerSeeds.map((trainer) => ({
      ...trainer,
      branchId: branchByName[trainer.branchName]._id
    }))
  );
  const trainerByName = Object.fromEntries(trainers.map((trainer) => [trainer.name, trainer]));

  await Membership.insertMany([
    {
      userId: memberOne._id,
      planId: planByName['Elite Annual']._id,
      startDate: daysAgo(40),
      endDate: daysAgo(-325),
      status: 'active'
    },
    {
      userId: memberTwo._id,
      planId: planByName['Momentum Quarterly']._id,
      startDate: daysAgo(20),
      endDate: daysAgo(-70),
      status: 'active'
    }
  ]);

  await Booking.insertMany([
    {
      userId: memberOne._id,
      trainerId: trainerByName['Noor Al Mansoori']._id,
      branchId: trainerByName['Noor Al Mansoori'].branchId,
      branchName: trainerByName['Noor Al Mansoori'].branchName,
      slot: 'Fri 08:00',
      status: 'confirmed'
    },
    {
      userId: memberOne._id,
      trainerId: trainerByName['Sara Haddad']._id,
      branchId: trainerByName['Sara Haddad'].branchId,
      branchName: trainerByName['Sara Haddad'].branchName,
      slot: 'Sat 11:30',
      status: 'pending'
    },
    {
      userId: memberTwo._id,
      trainerId: trainerByName['Ravi Menon']._id,
      branchId: trainerByName['Ravi Menon'].branchId,
      branchName: trainerByName['Ravi Menon'].branchName,
      slot: 'Thu 18:30',
      status: 'confirmed'
    },
    {
      userId: memberTwo._id,
      trainerId: trainerByName['Bilal Qureshi']._id,
      branchId: trainerByName['Bilal Qureshi'].branchId,
      branchName: trainerByName['Bilal Qureshi'].branchName,
      slot: 'Fri 17:30',
      status: 'pending'
    }
  ]);

  await Attendance.insertMany([
    { userId: memberOne._id, checkedInAt: daysAgo(0, 9), method: 'manual', note: 'Morning strength' },
    { userId: memberOne._id, checkedInAt: daysAgo(1, 8), method: 'manual', note: 'Cardio block' },
    { userId: memberOne._id, checkedInAt: daysAgo(2, 9), method: 'manual', note: 'Leg day' },
    { userId: memberOne._id, checkedInAt: daysAgo(4, 7), method: 'manual', note: 'Recovery session' },
    { userId: memberTwo._id, checkedInAt: daysAgo(0, 18), method: 'manual', note: 'Evening class' },
    { userId: memberTwo._id, checkedInAt: daysAgo(3, 18), method: 'manual', note: 'HIIT class' }
  ]);

  console.log('Seed completed successfully');
  console.log('Admin credentials:');
  console.log('Email: ' + adminEmail);
  console.log('Password: ' + adminPassword);
  console.log('Demo member credentials:');
  console.log('Email: aisha@fithub.local');
  console.log('Email: omar@fithub.local');
  console.log('Password: Member@123');
  console.log('Branches seeded: ' + branches.length);
  console.log('Plans seeded: ' + plans.length);
  console.log('Trainers seeded: ' + trainers.length);
  console.log('Admin user id: ' + admin._id);

  process.exit(0);
};

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
