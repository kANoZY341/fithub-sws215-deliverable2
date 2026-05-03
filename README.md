# FitHub - Gym Management System

FitHub is a full-stack MERN gym management system developed for **SWS 215 - Web Development Deliverable 2**.

The project includes a React + Vite frontend, a Node.js + Express backend, MongoDB database integration, JWT authentication, bcrypt password hashing, role-based access control, admin APIs, real CRUD operations, Postman testing, and live deployment using Vercel, Render, and MongoDB Atlas.

---

## Final Project Information

**Course:** SWS 215 - Web Development  
**Deliverable:** Deliverable 2 - Full-Stack Final Project  
**Project Title:** FitHub - Gym Management System  
**Group ID:** 5  

### Group Members

| Student Name | Student ID |
|---|---|
| Ahmad Aljanahi | 20210001364 |
| Mohammed Jouni | 20220001249 |
| Abdullatif AlHammadi | 20220002310 |

---

## Live Project Links

- **Live Frontend:** https://fithub-sws215-deliverable2.vercel.app
- **Live Backend:** https://fithub-sws215-deliverable2.onrender.com
- **Backend API Base URL:** https://fithub-sws215-deliverable2.onrender.com/api
- **Backend Health Check:** https://fithub-sws215-deliverable2.onrender.com/api/health
- **GitHub Repository:** https://github.com/kANoZY341/fithub-sws215-deliverable2

---

## Evaluation Login Credentials

### Admin Account

```text
Email: admin@fithub.local
Password: Admin@123
```

### User Account

```text
Email: aisha@fithub.local
Password: Member@123
```

### Additional User Account

```text
Email: omar@fithub.local
Password: Member@123
```

---

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- Mongoose
- MongoDB
- JSON Web Token authentication
- bcryptjs password hashing

### Database

- MongoDB Atlas for deployment
- MongoDB Local or Atlas for development

### Deployment

- Frontend deployed on Vercel
- Backend deployed on Render
- Database hosted on MongoDB Atlas

---

## Main Features

### Public Website

- Landing page
- Membership plans page
- Trainer listing page
- Trainer details and booking flow
- About page
- Contact page
- Chatbot component
- Responsive layout

### Authentication and Security

- User registration
- User login
- JWT-based authentication
- Password hashing using bcryptjs
- Protected routes
- Role-based access control for user and admin
- Backend validation and JSON error responses

### Member Features

- Member dashboard
- Profile and settings page
- Phone number update
- Preferred branch selection
- Membership checkout
- Active membership tracking
- Duplicate active membership prevention
- Trainer booking
- My Bookings page
- Attendance/check-in support

### Admin Features

- Admin dashboard with real backend statistics
- Admin reports page
- Admin users page
- Manage membership plans
- Create, read, update, and delete plans
- Manage trainers
- Create, read, update, and delete trainers
- Manage bookings
- Confirm, mark pending, cancel, and delete bookings
- View live MongoDB data through the admin interface

### Branch-Based Trainer System

Trainers are assigned to UAE branches. The trainer page includes a branch filter, and each booking stores the trainer, slot, and branch information in MongoDB.

Branches used in the project:

- Dubai - Al Barsha
- Abu Dhabi - Al Reem
- Sharjah - Al Majaz

---

## MongoDB Collections

The project uses the following MongoDB collections:

```text
users
plans
trainers
bookings
memberships
attendance
branches
```

---

## Project Structure

```text
GroubID5/
│
├── client/                         React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── server/                         Node.js + Express backend
│   ├── src/
│   ├── package.json
│   ├── seed.js
│   └── .env.example
│
├── README.md                       Main project guide
├── API_DOCUMENTATION.md            API route documentation
├── POSTMAN_GUIDE.md                Postman testing guide
├── DEPLOYMENT_GUIDE.md             Deployment instructions
├── FitHub_Postman_Collection.json  Postman collection
├── FitHub_Postman_Environment.json Postman environment
└── Run-FitHub.bat                  Windows helper script
```

---

## Local Installation

### Prerequisites

Install the following before running the project:

- Node.js 20 or newer
- npm 10 or newer
- MongoDB installed locally, or a MongoDB Atlas connection string
- Git
- VS Code
- MongoDB Compass
- Postman

---

## Backend Setup

Open a terminal in the project root folder:

```bash
cd server
npm install
```

Create the backend environment file:

```bash
copy .env.example .env
```

Example local backend `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fithub
JWT_SECRET=replace_with_a_long_random_secret
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174
CLIENT_URL=http://localhost:5173
```

Run the backend:

```bash
npm run dev
```

Backend local URL:

```text
http://localhost:5000
```

Backend health check:

```text
http://localhost:5000/api/health
```

---

## Frontend Setup

Open another terminal in the project root folder:

```bash
cd client
npm install
```

Create the frontend environment file:

```bash
copy .env.example .env
```

Example local frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Frontend local URL:

```text
http://localhost:5173
```

If port `5173` is busy, Vite may open on:

```text
http://localhost:5174
```

Both ports are supported in the backend CORS configuration.

---

## Seed the Database

The seed file creates sample users, branches, membership plans, trainers, bookings, memberships, and attendance records.

Run this from the `server` folder:

```bash
npm run seed
```

Seeded data includes:

- Admin user
- Normal users
- Membership plans
- 12 trainers across 3 UAE branches
- Bookings
- Membership records
- Attendance records
- Branch data

---

## Run Project Locally

Open two terminals.

### Terminal 1 - Backend

```bash
cd server
npm run dev
```

Expected result:

```text
MongoDB connected
Server running on port 5000
```

### Terminal 2 - Frontend

```bash
cd client
npm run dev
```

Expected result:

```text
Local: http://localhost:5173
```

or:

```text
Local: http://localhost:5174
```

---

## Build Check

Before submission or deployment, run:

```bash
cd client
npm run build
```

The build should complete successfully and create a `dist` folder.

---

## API Overview

The backend uses RESTful API routes.

Main API areas:

```text
/auth
/plans
/trainers
/bookings
/memberships
/admin
/reports
/users
/health
```

Example API endpoints:

```text
GET    /api/health
POST   /api/auth/register
POST   /api/auth/login
GET    /api/plans
POST   /api/plans
PUT    /api/plans/:id
DELETE /api/plans/:id
GET    /api/trainers
POST   /api/trainers
PUT    /api/trainers/:id
DELETE /api/trainers/:id
POST   /api/bookings
GET    /api/bookings
PUT    /api/bookings/:id/status
DELETE /api/bookings/:id
GET    /api/memberships/my
POST   /api/memberships/subscribe
GET    /api/admin/reports
GET    /api/admin/users
```

Full API details are documented in:

```text
API_DOCUMENTATION.md
```

---

## Postman Testing

The project includes ready-to-import Postman files:

```text
FitHub_Postman_Collection.json
FitHub_Postman_Environment.json
```

Import both files into Postman.

Set the environment:

```text
FitHub Local Environment
```

Local API base URL:

```text
http://localhost:5000/api
```

For deployed testing, update `baseUrl` to:

```text
https://fithub-sws215-deliverable2.onrender.com/api
```

Recommended Postman testing order:

```text
1. Health Check
2. Login User
3. Login Admin
4. Get Current User/Profile
5. Get All Plans
6. Create Plan as Admin
7. Update Plan as Admin
8. Delete Plan as Admin
9. Get All Trainers
10. Create Trainer as Admin
11. Update Trainer as Admin
12. Delete Trainer as Admin
13. Subscribe to Membership Plan
14. Duplicate Membership Test
15. Create Booking as User
16. Get Bookings
17. Update Booking Status as Admin
18. Delete Booking
19. Admin Dashboard
20. Admin Reports
21. Admin Users List
```

Full Postman instructions are documented in:

```text
POSTMAN_GUIDE.md
```

---

## CRUD Demonstration

The project supports full CRUD through both the website UI and Postman.

### Plans CRUD

- Create plan as admin
- View plans as user/public
- Update plan as admin
- Delete test plan as admin

### Trainers CRUD

- Create trainer as admin
- View trainers as user/public
- Update trainer as admin
- Delete test trainer as admin

### Bookings CRUD

- Create booking as user
- View bookings as user/admin
- Update booking status as admin
- Delete booking as admin or user where supported

MongoDB Compass can be used during evaluation to confirm that all CRUD actions update the database in real time.

---

## Important Business Rules

### Active Membership Lockout

A user cannot subscribe to a new membership plan if they already have an active membership.

Frontend behavior:

```text
Checkout button is disabled or blocked.
The user sees a message explaining they already have an active membership.
```

Backend behavior:

```text
POST /api/memberships/subscribe
returns 409 Conflict if the user already has an active membership.
```

### Login Required for Checkout

A logged-out visitor can view plans, but cannot checkout.

Frontend behavior:

```text
Clicking Checkout redirects the visitor to Login.
```

Backend behavior:

```text
Membership subscription requires a valid JWT token.
```

---

## Deployment Summary

### Frontend - Vercel

Live frontend:

```text
https://fithub-sws215-deliverable2.vercel.app
```

Vercel settings:

```text
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
```

Vercel environment variable:

```env
VITE_API_URL=https://fithub-sws215-deliverable2.onrender.com/api
```

### Backend - Render

Live backend:

```text
https://fithub-sws215-deliverable2.onrender.com
```

Backend API:

```text
https://fithub-sws215-deliverable2.onrender.com/api
```

Health check:

```text
https://fithub-sws215-deliverable2.onrender.com/api/health
```

Render settings:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Render environment variables:

```env
PORT=5000
MONGO_URI=<MongoDB Atlas connection string>
JWT_SECRET=<long random secret>
CORS_ORIGINS=https://fithub-sws215-deliverable2.vercel.app
CLIENT_URL=https://fithub-sws215-deliverable2.vercel.app
```

### Database - MongoDB Atlas

The deployed backend connects to MongoDB Atlas using the `MONGO_URI` environment variable.

The production database name is:

```text
fithub
```

---

## Evaluation Checklist

Before presentation, make sure these are ready:

```text
Live frontend opens successfully
Live backend health check returns ok
Plans page loads real database plans
Trainers page loads real database trainers
Login works
Admin login works
Admin dashboard loads
Postman collection is imported
MongoDB Compass is connected
CRUD can be demonstrated through website UI
CRUD can be demonstrated through Postman
MongoDB Compass shows live data changes
VS Code project folder is open
Frontend and backend code are visible
```

---

## What to Show During Presentation

Recommended order:

```text
1. Open live frontend website.
2. Show public pages: Home, Plans, Trainers, About, Contact.
3. Login as normal user.
4. Show dashboard and profile.
5. Show membership checkout or active membership lockout.
6. Book a trainer and show My Bookings.
7. Login as admin.
8. Show Admin Dashboard.
9. Show Admin Users and Admin Reports.
10. Create, update, and delete a test plan.
11. Create, update, and delete a test trainer.
12. Update and delete a test booking.
13. Open Postman and show API CRUD.
14. Open MongoDB Compass and show data changes.
15. Show VS Code project structure.
```

---

## Submission Notes

- Do not commit real `.env` files.
- Do not commit `node_modules`.
- Use `.env.example` files for safe environment variable examples.
- Only delete test records during evaluation.
- Seed/demo records should remain safe.
- Render free services may sleep after inactivity, so open the backend health check before evaluation.

---

## Related Documentation

- `API_DOCUMENTATION.md`
- `POSTMAN_GUIDE.md`
- `DEPLOYMENT_GUIDE.md`
- `FitHub_Postman_Collection.json`
- `FitHub_Postman_Environment.json`
