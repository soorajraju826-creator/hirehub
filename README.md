# HireHub — MEAN Stack Job Portal

A starter full-stack job portal built with MongoDB, Express, Angular, and Node.js.

## Features
- JWT registration and login with `seeker`, `recruiter`, and `admin` roles
- Password hashing with bcrypt
- Public job listing, keyword/location/type filters, and pagination
- Recruiters can create, edit, and delete their own jobs
- Job seekers can apply once per job and view their applications
- Recruiters can review applicants and update application status
- Admin endpoints for listing users and jobs
- Angular standalone application with route protection and HTTP interceptor

## Requirements
- Node.js 20.19+ (or a compatible current LTS release)
- npm
- MongoDB Atlas or local MongoDB

## 1. Configure MongoDB
The server reads the MongoDB connection string from `MONGO_URI`.

Your Atlas URI format is:

`mongodb+srv://soorajraju826_db_user:<YOUR_DATABASE_PASSWORD>@cluster0.hoynvsv.mongodb.net/hirehub?retryWrites=true&w=majority`

Replace `<YOUR_DATABASE_PASSWORD>` locally with your database user's password. Do not commit credentials or share them publicly.

## 2. Start the backend
```bash
cd server
npm install
```

Set environment variables in your terminal before starting the server.

PowerShell:
```powershell
$env:MONGO_URI="your-mongodb-atlas-connection-string"
$env:JWT_SECRET="replace-with-a-long-random-secret"
$env:PORT="5000"
npm run dev
```

Windows CMD:
```cmd
set MONGO_URI=your-mongodb-atlas-connection-string
set JWT_SECRET=replace-with-a-long-random-secret
set PORT=5000
npm run dev
```

The API runs at `http://localhost:5000` and health check is `http://localhost:5000/api/health`.

## 3. Start the Angular frontend
Open a second terminal:
```bash
cd client
npm install
npm start
```

Open `http://localhost:4200`.

## First admin account
Public registration intentionally does not allow users to choose the `admin` role.
Create an admin account directly in MongoDB Atlas by changing an existing user's `role` to `admin`, or use the MongoDB shell after registering:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```
Log out and log in again to receive an admin token.

## API overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/jobs` (recruiter)
- `PATCH /api/jobs/:id` (job owner)
- `DELETE /api/jobs/:id` (job owner or admin)
- `POST /api/applications/:jobId` (seeker)
- `GET /api/applications/my` (seeker)
- `GET /api/applications/received` (recruiter)
- `PATCH /api/applications/:id/status` (recruiter who owns the job)
- `GET /api/admin/users` (admin)
- `GET /api/admin/jobs` (admin)

## Notes
- This is a functional starter, not a production-hardened recruitment platform.
- Add email verification, password reset, rate limiting, audit logging, cloud resume storage, and automated tests before production.
- Resume upload and payment features are not included in this initial version.
