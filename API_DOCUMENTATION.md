# Final Project Information

**Course:** SWS 215 - Web Development  
**Project Title:** FitHub - Gym Management System  
**Group ID:** 5  

## Group Members

| Student Name | Student ID |
|---|---|
| Ahmad Aljanahi | 20210001364 |
| Mohammed Jouni | 20220001249 |
| Abdullatif AlHammadi | 20220002310 |

## Live Links

- **Live Frontend:** https://fithub-sws215-deliverable2.vercel.app
- **Live Backend:** https://fithub-sws215-deliverable2.onrender.com
- **Backend Health Check:** https://fithub-sws215-deliverable2.onrender.com/api/health
- **GitHub Repository:** https://github.com/kANoZY341/fithub-sws215-deliverable2

## Evaluation Login Credentials

**Admin Account**  
Email: admin@fithub.local  
Password: Admin@123  

**User Account**  
Email: aisha@fithub.local  
Password: Member@123  

---

# FitHub API Documentation

Live backend:

```text
https://fithub-sws215-deliverable2.onrender.com
```

Live API base URL:

```text
https://fithub-sws215-deliverable2.onrender.com/api
```

Live health check:

```text
https://fithub-sws215-deliverable2.onrender.com/api/health
```

GitHub repository:

```text
https://github.com/kANoZY341/fithub-sws215-deliverable2
```

Base URL for local testing:

```text
http://localhost:5000/api
```

All protected routes require this header:

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Error Format

```json
{
  "message": "Error message"
}
```

## Public Routes

### Health Check

Render/root health routes:

`GET /`

`GET /health`

`GET /api/health`

Auth: none

Response:

```json
{
  "ok": true,
  "service": "FitHub API",
  "status": "running"
}
```

### Register

`POST /auth/register`

Auth: none

```json
{
  "name": "Test Member",
  "email": "member@example.com",
  "phone": "+971501234567",
  "password": "Member@123"
}
```

### Login

`POST /auth/login`

Auth: none

```json
{
  "email": "admin@fithub.local",
  "password": "Admin@123"
}
```

### List Plans

`GET /plans`

Auth: none

### Get One Plan

`GET /plans/:id`

Auth: none

### List Trainers

`GET /trainers`

Auth: none

Optional query filters:

`GET /trainers?branchName=Dubai%20-%20Al%20Barsha`
`GET /trainers?branchId=BRANCH_ID_HERE`

Trainer responses include `branchId` and `branchName`.

### Get One Trainer

`GET /trainers/:id`

Auth: none

### List Branches

`GET /branches`

Auth: none

Seeded branches:

- Dubai - Al Barsha
- Abu Dhabi - Al Reem
- Sharjah - Al Majaz

## User Routes

### Get Current User

`GET /users/me`

Auth: user or admin

### Update Current User

`PATCH /users/me`

Auth: user or admin

```json
{
  "preferredBranch": "Dubai - Al Barsha",
  "phone": "+971501234567"
}
```

## Membership Routes

### Subscribe to Plan

`POST /memberships/subscribe`

Auth: user or admin

```json
{
  "planId": "PLAN_ID_HERE"
}
```

If no valid JWT is provided, the API returns:

```http
401 Unauthorized
```

```json
{
  "message": "Please log in to subscribe to a membership plan."
}
```

If the logged-in user already has an active, unexpired membership, the API returns:

```http
409 Conflict
```

```json
{
  "message": "User already has an active membership plan."
}
```

### My Memberships

`GET /memberships/my`

Auth: user or admin

### Get One Membership

`GET /memberships/:id`

Auth: owner or admin

### List All Memberships

`GET /memberships`

Auth: admin

## Booking Routes

### Create Booking

`POST /bookings`

Auth: user or admin

```json
{
  "trainerId": "TRAINER_ID_HERE",
  "slot": "Mon 07:00"
}
```

The backend copies the trainer branch into the booking as `branchId` and `branchName`.

### My Bookings

`GET /bookings/my`

Auth: user or admin

### Get One Booking

`GET /bookings/:id`

Auth: owner or admin

### Delete Booking

`DELETE /bookings/:id`

Auth: owner or admin

### List All Bookings

`GET /bookings`

Auth: admin

### Update Booking Status

`PATCH /bookings/:id/status`

Auth: admin

```json
{
  "status": "confirmed"
}
```

Allowed status values: `pending`, `confirmed`, `cancelled`

## Attendance Routes

### Check In

`POST /attendance/checkin`

Auth: user or admin

```json
{
  "note": "Morning workout"
}
```

### My Attendance

`GET /attendance/my`

Auth: user or admin

### List All Attendance

`GET /attendance`

Auth: admin

## Admin Plan CRUD

### Create Plan

`POST /plans`

Auth: admin

```json
{
  "name": "Weekend Pass",
  "price": 99,
  "durationDays": 14,
  "features": ["Gym access", "Weekend classes"],
  "active": true
}
```

### Update Plan

`PUT /plans/:id`

Auth: admin

```json
{
  "name": "Weekend Pass Plus",
  "price": 129,
  "durationDays": 21,
  "features": ["Gym access", "Weekend classes", "Locker access"],
  "active": true
}
```

### Delete Plan

`DELETE /plans/:id`

Auth: admin

## Admin Trainer CRUD

### Create Trainer

`POST /trainers`

Auth: admin

```json
{
  "name": "Maya Thomas",
  "specialty": "Strength Training",
  "bio": "Coach focused on safe strength progressions.",
  "languages": ["English", "Arabic"],
  "availableSlots": ["Mon 07:00", "Wed 18:00"],
  "branchName": "Dubai - Al Barsha"
}
```

### Update Trainer

`PUT /trainers/:id`

Auth: admin

```json
{
  "name": "Maya Thomas",
  "specialty": "Strength and Mobility",
  "bio": "Coach focused on safe strength and mobility progressions.",
  "languages": ["English", "Arabic"],
  "availableSlots": ["Mon 07:00", "Thu 18:00"],
  "branchName": "Abu Dhabi - Al Reem"
}
```

### Delete Trainer

`DELETE /trainers/:id`

Auth: admin

## Admin Portal APIs

### Dashboard Metrics

`GET /admin/dashboard`

Auth: admin

### User List

`GET /admin/users`

Auth: admin

### Reports

`GET /admin/reports`

Auth: admin

