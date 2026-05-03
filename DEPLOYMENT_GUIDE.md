# FitHub Deployment Guide

Target deployment:

- Database: MongoDB Atlas
- Backend API: Render, https://fithub-sws215-deliverable2.onrender.com
- Frontend: Vercel, https://fithub-sws215-deliverable2.vercel.app
- GitHub repository: https://github.com/kANoZY341/fithub-sws215-deliverable2
- Backend health check: https://fithub-sws215-deliverable2.onrender.com/api/health

Do not commit real secrets. Keep real values only in Atlas, Render, Vercel, or local `.env` files.

## 1. MongoDB Atlas

1. Go to MongoDB Atlas and create a free or shared cluster.
2. Create a database user from Database Access.
   - Use a strong username and password.
   - Give the user read/write access to the FitHub database.
3. Open Network Access and add an IP access rule.
   - For a class demo, `0.0.0.0/0` is the simplest option because Render uses changing outbound IPs.
   - For stricter production security, use private networking or a narrower access rule if available.
4. Open the cluster Connect screen and copy the Node.js connection string.
5. Replace the placeholder username, password, and database name.

Example shape only:

```text
mongodb+srv://USERNAME:PASSWORD@cluster-name.mongodb.net/fithub?retryWrites=true&w=majority
```

Use this full value as `MONGO_URI` on Render.

## 2. Render Backend

1. Push the project to GitHub.
2. In Render, choose New > Web Service.
3. Connect the GitHub repository.
4. Configure the service:
   - Runtime: Node
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:

```text
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
CORS_ORIGINS=https://fithub-sws215-deliverable2.vercel.app
CLIENT_URL=https://fithub-sws215-deliverable2.vercel.app
```

At first, you may not know the Vercel URL. You can leave `CORS_ORIGINS` and `CLIENT_URL` blank during the first backend deploy, then update them after the frontend is deployed.

6. Deploy the service.
7. Test the backend health route:

```text
https://fithub-sws215-deliverable2.onrender.com/api/health
```

Expected response:

```json
{
  "ok": true,
  "service": "FitHub API",
  "status": "running"
}
```

## 3. Vercel Frontend

1. In Vercel, create a new project from the same GitHub repository.
2. Configure the project:
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variable:

```text
VITE_API_URL=https://fithub-sws215-deliverable2.onrender.com/api
```

4. Deploy the frontend.
5. Open the Vercel URL and confirm the site loads.

## 4. CORS Setup

After Vercel gives you the frontend URL, go back to Render and update the backend environment variables:

```text
CORS_ORIGINS=https://fithub-sws215-deliverable2.vercel.app
CLIENT_URL=https://fithub-sws215-deliverable2.vercel.app
```

If you also have a custom domain, include both URLs separated by commas:

```text
CORS_ORIGINS=https://your-vercel-site.vercel.app,https://www.yourdomain.com
CLIENT_URL=https://your-vercel-site.vercel.app
```

Save the variables and redeploy the Render backend.

## 5. Production Seed

Only seed the Atlas database when it is new or safe to reset. The seed script deletes and recreates the demo collections.

Safe beginner path:

1. Confirm the Atlas database is empty or disposable.
2. Temporarily set `server/.env` locally to the Atlas `MONGO_URI`.
3. Run:

```powershell
cd server
npm run seed
```

4. Restore your local `server/.env` if you still want to use local MongoDB for development.
5. Do not run production seed again after real evaluator/demo data is added unless you intentionally want to reset it.

## 6. Final Live Test

1. Open the live Vercel frontend.

```text
https://fithub-sws215-deliverable2.vercel.app
```
2. Login as admin:

```text
admin@fithub.local
Admin@123
```

3. Login as user:

```text
aisha@fithub.local
Member@123
```

4. Confirm:
   - Plans load from the Render API.
   - Trainers load from the Render API.
   - Branch filter shows 4 trainers per branch.
   - Checkout creates a membership.
   - Duplicate active membership checkout is blocked.
   - Trainer booking creates a MongoDB booking with branch information.
   - Admin dashboard loads real backend data.
   - Admin plan CRUD works.
   - Admin trainer CRUD works.
   - Admin booking status update works.

## Deployment Order

1. Create MongoDB Atlas cluster, database user, and network access.
2. Deploy backend on Render with Atlas `MONGO_URI` and `JWT_SECRET`.
3. Test Render `/api/health`: `https://fithub-sws215-deliverable2.onrender.com/api/health`.
4. Deploy frontend on Vercel with `VITE_API_URL=https://fithub-sws215-deliverable2.onrender.com/api`.
5. Copy Vercel URL into Render `CORS_ORIGINS` and `CLIENT_URL`.
6. Redeploy Render backend.
7. Seed Atlas once if the database is empty and safe to reset.
8. Run the final live test.
