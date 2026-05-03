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

# FitHub - Gym Management System

FitHub is a full-stack MERN gym management system for SWS 215 Web Development Deliverable 2. It includes a React + Vite frontend, Node.js + Express backend, MongoDB collections, JWT authentication, bcrypt password hashing, role-based access control, admin APIs, and real CRUD flows.

## Project Information

- Course: SWS 215 Web Development
- Deliverable: Deliverable 2
- Group: Group ID 5
- Project title: FitHub - Gym Management System
- Live website: https://fithub-sws215-deliverable2.vercel.app
- Backend API: https://fithub-sws215-deliverable2.onrender.com/api
- Backend health check: https://fithub-sws215-deliverable2.onrender.com/api/health
- GitHub repository: https://github.com/kANoZY341/fithub-sws215-deliverable2

## Evaluation Logins

- Admin: `admin@fithub.local` / `Admin@123`
- User: `aisha@fithub.local` / `Member@123`
- User: `omar@fithub.local` / `Member@123`

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas for deployment, MongoDB local or Atlas for development
- Security: JWT authentication, bcryptjs password hashing, user/admin role checks
- Deployment: Vercel frontend, Render backend, MongoDB Atlas database

## Features Summary

- Register and login with JWT.
- Passwords are hashed with bcrypt before saving to MongoDB.
- User and admin roles are enforced on protected routes.
- Public browsing for plans, trainers, branches, about, and contact pages.
- Branch-specific trainer system with 12 seeded trainers across 3 UAE branches.
- Member dashboard with real memberships, bookings, and attendance from MongoDB.
- Membership checkout creates a real membership record.
- Users with an active membership are blocked from subscribing to another plan until the active plan expires.
- Trainer booking creates a real booking record with branch information.
- Admin dashboard reads real backend metrics.
- Admin CRUD for plans and trainers.
- Admin booking status management and booking deletion.
- Admin users and reports pages.
- API validation and consistent JSON error responses.

## MongoDB Collections

- `users`
- `plans`
- `trainers`
- `bookings`
- `memberships`
- `attendance`
- `branches`

## Project Structure

```text
GroubID5/
  client/              React + Vite frontend
  server/              Express + MongoDB backend
  README.md            Setup and project guide
  API_DOCUMENTATION.md API route list
  POSTMAN_GUIDE.md     Evaluation testing steps
  DEPLOYMENT_GUIDE.md  Render/Vercel/Atlas deployment guide
  Run-FitHub.bat       Windows helper to start both apps
```

## Local Installation

Prerequisites:

- Node.js 20 or newer
- npm 10 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
```

## Environment Setup

Create environment files from the examples:

```bash
cd server
copy .env.example .env

cd ../client
copy .env.example .env
```

Server `.env` values for local development:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fithub
JWT_SECRET=replace_with_a_long_random_secret
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174
CLIENT_URL=http://localhost:5173
```

Client `.env` values for local development:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not commit real `.env` files or production secrets. Keep `.env.example` files in the repository.

## Seed the Database

Run this after MongoDB is running:

```bash
cd server
npm run seed
```

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

Local URLs:

- Frontend: `http://localhost:5173` or `http://localhost:5174`
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

## Deployment Summary

- GitHub repository: https://github.com/kANoZY341/fithub-sws215-deliverable2
- Frontend deployed on Vercel: https://fithub-sws215-deliverable2.vercel.app
- Backend deployed on Render: https://fithub-sws215-deliverable2.onrender.com
- Backend API base URL: https://fithub-sws215-deliverable2.onrender.com/api
- Backend health check: https://fithub-sws215-deliverable2.onrender.com/api/health
- Database hosted on MongoDB Atlas.

Vercel environment variable:

```text
VITE_API_URL=https://fithub-sws215-deliverable2.onrender.com/api
```

Render environment variables:

```text
PORT=5000
MONGO_URI=<MongoDB Atlas connection string>
JWT_SECRET=<long random secret>
CORS_ORIGINS=https://fithub-sws215-deliverable2.vercel.app
CLIENT_URL=https://fithub-sws215-deliverable2.vercel.app
```

## Documentation

- API route list: `API_DOCUMENTATION.md`
- Postman testing guide: `POSTMAN_GUIDE.md`
- Deployment guide: `DEPLOYMENT_GUIDE.md`



