# FitHub - Gym Management System

FitHub is a full-stack MERN gym management system for SWS 215 Web Development Deliverable 2. It includes a React + Vite frontend, Node.js + Express backend, MongoDB collections, JWT authentication, bcrypt password hashing, role-based access control, admin APIs, and real CRUD flows.

## Group Information

- Course: SWS 215 Web Development
- Deliverable: Deliverable 2
- Project name: FitHub - Gym Management System
- Group members and student IDs:
  - Student Name 1 - Student ID 1
  - Student Name 2 - Student ID 2
  - Student Name 3 - Student ID 3
- Website link/domain placeholder: `https://your-fithub-domain.example`

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- Security: JWT authentication, bcryptjs password hashing, user/admin role checks

## Project Structure

```text
GroubID5/
  client/              React + Vite frontend
  server/              Express + MongoDB backend
  README.md            Setup and project guide
  API_DOCUMENTATION.md API route list
  POSTMAN_GUIDE.md     Evaluation testing steps
  Run-FitHub.bat       Windows helper to start both apps
```

## Features

- Register and login with JWT.
- Passwords are hashed with bcrypt before saving to MongoDB.
- User and admin roles are enforced on protected routes.
- Public browsing for plans, trainers, branches, about, and contact pages.
- Member dashboard with real memberships, bookings, and attendance from MongoDB.
- Membership checkout creates a real membership record.
- Users with an active membership are blocked from subscribing to another plan until the active plan expires.
- Trainer booking creates a real booking record.
- Admin dashboard reads real backend metrics.
- Admin CRUD for plans and trainers.
- Admin booking status management and booking deletion.
- API validation and consistent JSON error responses.

## MongoDB Collections

- `users`
- `plans`
- `trainers`
- `bookings`
- `memberships`
- `attendance`
- `branches`

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

## Environment Setup

Create environment files from the examples:

```bash
cd server
copy .env.example .env

cd ../client
copy .env.example .env
```

Server `.env` values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fithub
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@fithub.local
ADMIN_PASSWORD=Admin@123
```

Client `.env` values:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not commit real `.env` files or production secrets.

## Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

## Seed the Database

Run this after MongoDB is running:

```bash
cd server
npm run seed
```

Seed credentials:

- Admin: `admin@fithub.local` / `Admin@123`
- User: `aisha@fithub.local` / `Member@123`
- User: `omar@fithub.local` / `Member@123`

The seed script creates users, branches, plans, trainers, memberships, bookings, and attendance records.

## Run Locally

Open two terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API health check: `http://localhost:5000/api/health`

Windows shortcut:

```bash
Run-FitHub.bat
```

## Build Check

```bash
cd client
npm run build
```

## Deployment Readiness

Frontend deployment:

- Build command: `npm run build`
- Output folder: `client/dist`
- Required env: `VITE_API_URL=https://your-backend-domain.example/api`

Backend deployment:

- Start command: `npm start`
- Required env vars: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
- Use MongoDB Atlas for hosted database deployments.
- Set `CLIENT_URL` to the deployed frontend URL.

## Documentation

- API route list: `API_DOCUMENTATION.md`
- Postman testing guide: `POSTMAN_GUIDE.md`
