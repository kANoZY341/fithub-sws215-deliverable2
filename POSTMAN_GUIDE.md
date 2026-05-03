# FitHub Postman Guide

This guide explains how to import and use the ready-made Postman files for the FitHub Gym Management System.

Live links:

- Frontend: https://fithub-sws215-deliverable2.vercel.app
- Backend API: https://fithub-sws215-deliverable2.onrender.com/api
- Backend health check: https://fithub-sws215-deliverable2.onrender.com/api/health
- GitHub repository: https://github.com/kANoZY341/fithub-sws215-deliverable2

Files in the project root:

- `FitHub_Postman_Collection.json`
- `FitHub_Postman_Environment.json`

## 1. Start FitHub Locally

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

Optional database reset:

```bash
cd server
npm run seed
```

Local URLs:

```text
Frontend: http://localhost:5173
Backend API: http://localhost:5000/api
```

## 2. Import the Collection

1. Open Postman.
2. Click `Import`.
3. Click `Files`.
4. Select `FitHub_Postman_Collection.json` from the root `GroubID5` folder.
5. Click `Import`.
6. You should see a collection named `FitHub - Gym Management System API`.

## 3. Import the Environment

1. Click `Import` again.
2. Click `Files`.
3. Select `FitHub_Postman_Environment.json` from the root `GroubID5` folder.
4. Click `Import`.
5. You should see an environment named `FitHub Local Environment`.

## 4. Select the Environment

1. In the top-right Postman environment dropdown, choose `FitHub Local Environment`.
2. For local testing, confirm `baseUrl` is:

```text
http://localhost:5000/api
```

For live deployed backend testing, change `baseUrl` to:

```text
https://fithub-sws215-deliverable2.onrender.com/api
```

The collection automatically saves these variables during testing:

```text
userToken
adminToken
userId
planId
trainerId
bookingId
membershipId
```

## 5. Login Requests

Run these first:

1. `Setup / Health > Health Check`
2. `AUTH > Register User`
3. `AUTH > Login User`
4. `AUTH > Login Admin`
5. `AUTH > Get Current User/Profile`

Notes:

- `Register User` creates a fresh Postman user and saves `userToken` and `userId`.
- `Login User` logs in that fresh user if `Register User` was run first.
- If you run `Login User` before `Register User`, it uses the seeded user from collection variables: `aisha@fithub.local / Member@123`.
- `Login Admin` uses `admin@fithub.local / Admin@123` and saves `adminToken`.

## 6. Test Plans CRUD

Recommended order:

1. `PLANS CRUD > Get All Plans`
2. `PLANS CRUD > Create Plan as Admin`
3. `PLANS CRUD > Get Plan By ID`
4. `PLANS CRUD > Update Plan as Admin`

Run `PLANS CRUD > Delete Plan as Admin` only after you finish membership tests if you want to delete the Postman-created plan.

MongoDB Compass should show:

- After create: one new document in the `plans` collection.
- After update: that same plan document has the updated name, price, duration, or features.
- After delete: that Postman-created plan document is removed.
- Seed plans should still remain: `Flex Monthly`, `Momentum Quarterly`, `Elite Annual`, `Ladies Wellness`.

## 7. Test Trainers CRUD

Recommended order:

1. `TRAINERS CRUD > Get All Trainers`
2. `TRAINERS CRUD > Create Trainer as Admin`
3. `TRAINERS CRUD > Get Trainer By ID`
4. `TRAINERS CRUD > Update Trainer as Admin`

Run `TRAINERS CRUD > Delete Trainer as Admin` only after booking tests if the booking uses the Postman-created trainer.

MongoDB Compass should show:

- After create: one new document in the `trainers` collection.
- After update: that same trainer has updated profile fields and branch.
- After delete: that Postman-created trainer document is removed.
- Seed trainers should still remain: 12 total, 4 each for `Dubai - Al Barsha`, `Abu Dhabi - Al Reem`, and `Sharjah - Al Majaz`.

## 8. Test Bookings CRUD

Recommended order:

1. Make sure `AUTH > Register User`, `AUTH > Login User`, and `AUTH > Login Admin` have been run.
2. Make sure `TRAINERS CRUD > Create Trainer as Admin` has been run, or run `TRAINERS CRUD > Get All Trainers` to save a seeded trainer ID.
3. `BOOKINGS CRUD > Create Booking as User`
4. `BOOKINGS CRUD > Get Bookings`
5. `BOOKINGS CRUD > Get My Bookings as User`
6. `BOOKINGS CRUD > Update Booking Status as Admin`
7. `BOOKINGS CRUD > Delete Booking`

MongoDB Compass should show:

- After create: one new document in the `bookings` collection with the logged-in user's ID, trainer ID, `branchId`, and `branchName`.
- After update: the booking `status` changes, usually from `pending` to `confirmed`.
- After delete: that booking document is removed.

## 9. Test Memberships and Duplicate 409

For a successful new membership:

1. Run `AUTH > Register User`.
2. Run `AUTH > Login User`.
3. Run `PLANS CRUD > Get All Plans` if `planId` is empty.
4. Run `MEMBERSHIPS > Subscribe to Membership Plan`.
5. Run `MEMBERSHIPS > Get My Membership`.

For duplicate active membership protection:

1. Run `MEMBERSHIPS > Subscribe to Membership Plan` once for the fresh user.
2. Run `MEMBERSHIPS > Duplicate Membership Test - should return 409 if user already has active plan`.
3. Expected response:

```json
{
  "message": "User already has an active membership plan."
}
```

Expected status:

```text
409 Conflict
```

MongoDB Compass should show:

- After first successful subscribe: one new document in the `memberships` collection.
- After duplicate test: no second active membership should be created for that same user.
- The existing active membership remains unchanged.

## 10. Test Admin Dashboard and Reports

Run:

1. `ADMIN / REPORTS > Admin Dashboard`
2. `ADMIN / REPORTS > Admin Reports`
3. `ADMIN / REPORTS > Admin Users List`

MongoDB Compass should match the returned counts:

- `users` count should include seeded users plus any Postman users.
- `plans` count should include active plans.
- `trainers` count should include trainer documents.
- `bookings` count should change after booking create/delete.
- `memberships` count should increase after successful subscription.
- `attendance` count should show seeded and created attendance records.

## 11. Best Presentation Order

Use this exact order during evaluation:

1. `Setup / Health > Health Check`
2. `AUTH > Register User`
3. `AUTH > Login User`
4. `AUTH > Login Admin`
5. `AUTH > Get Current User/Profile`
6. `PLANS CRUD > Get All Plans`
7. `PLANS CRUD > Create Plan as Admin`
8. `PLANS CRUD > Get Plan By ID`
9. `PLANS CRUD > Update Plan as Admin`
10. `TRAINERS CRUD > Get All Trainers`
11. `TRAINERS CRUD > Create Trainer as Admin`
12. `TRAINERS CRUD > Get Trainer By ID`
13. `TRAINERS CRUD > Update Trainer as Admin`
14. `MEMBERSHIPS > Subscribe to Membership Plan`
15. `MEMBERSHIPS > Get My Membership`
16. `MEMBERSHIPS > Duplicate Membership Test - should return 409 if user already has active plan`
17. `BOOKINGS CRUD > Create Booking as User`
18. `BOOKINGS CRUD > Get Bookings`
19. `BOOKINGS CRUD > Get My Bookings as User`
20. `BOOKINGS CRUD > Update Booking Status as Admin`
21. `BOOKINGS CRUD > Delete Booking`
22. `ADMIN / REPORTS > Admin Dashboard`
23. `ADMIN / REPORTS > Admin Reports`
24. `ADMIN / REPORTS > Admin Users List`
25. `TRAINERS CRUD > Delete Trainer as Admin`
26. `PLANS CRUD > Delete Plan as Admin`

This order avoids deleting the test plan or trainer before they are used in membership and booking tests.

## 12. What to Say During Evaluation

You can say:

```text
This Postman collection uses the real Express routes from the FitHub backend.
The environment stores the local base URL and automatically saves JWT tokens and MongoDB IDs after login/create requests.
Admin-only routes use the admin JWT, while user routes use the normal user JWT.
Plans and trainers demonstrate full CRUD.
Bookings demonstrate create, read, update status, and delete.
Memberships demonstrate successful subscription and backend duplicate-active-plan protection with 409 Conflict.
MongoDB Compass shows the matching users, plans, trainers, bookings, and memberships documents as each request runs.
```

## 13. Troubleshooting

If a request returns `401 Unauthorized`:

- Run `AUTH > Login User` or `AUTH > Login Admin` again.
- Confirm the environment is selected.

If a request returns `403 Forbidden`:

- You are probably using `userToken` on an admin-only route.
- Run `AUTH > Login Admin`.

If booking creation returns `409`:

- The trainer slot is already booked.
- Run `TRAINERS CRUD > Create Trainer as Admin` again to create a new trainer with a fresh slot, then retry booking.

If membership subscription returns `409`:

- This is correct when the user already has an active membership.
- Run `AUTH > Register User` to create a fresh user if you want to show a successful first subscription.
