# Event Management Portal — Implementation Plan

## Overview

A beginner-friendly full-stack Event Management Portal using **HTML/CSS/JS** on the frontend and **Node.js + Express + MongoDB** on the backend. The design will be clean, light-themed, card-based, and mobile responsive — appropriate for a college mini project.

---

## Proposed Folder Structure

```
Event Management Portal/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   └── auth.js                # Session-based auth middleware
│   ├── models/
│   │   ├── Event.js               # Mongoose event schema
│   │   ├── Registration.js        # Mongoose registration schema
│   │   └── Admin.js               # Mongoose admin schema
│   ├── routes/
│   │   ├── events.js              # Event CRUD routes
│   │   ├── registrations.js       # Registration routes
│   │   └── auth.js                # Login/logout routes
│   ├── seed.js                    # Sample data seeder
│   ├── server.js                  # Express app entry point
│   ├── .env                       # Environment variables
│   └── package.json
│
├── frontend/
│   ├── css/
│   │   └── style.css              # Shared styles
│   ├── js/
│   │   ├── api.js                 # Fetch wrapper / API calls
│   │   ├── home.js                # Home page logic
│   │   ├── event-detail.js        # Event detail page logic
│   │   ├── register.js            # Registration form logic
│   │   ├── admin-login.js         # Admin login logic
│   │   └── admin-dashboard.js     # Admin dashboard logic
│   ├── index.html                 # Home page
│   ├── event-detail.html          # Event details page
│   ├── register.html              # User registration page
│   ├── admin-login.html           # Admin login page
│   └── admin-dashboard.html       # Admin dashboard
│
└── README.md                      # Setup instructions
```

---

## Proposed Changes

### Backend

#### [NEW] `backend/package.json`
Dependencies: `express`, `mongoose`, `express-session`, `bcryptjs`, `cors`, `dotenv`, `nodemon` (dev).

#### [NEW] `backend/.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventportal
SESSION_SECRET=your_secret_key
```

#### [NEW] `backend/config/db.js`
Mongoose connection setup.

#### [NEW] `backend/models/Event.js`
Schema: `title`, `description`, `date`, `time`, `venue`, `image`, `organizer`.

#### [NEW] `backend/models/Registration.js`
Schema: `eventId`, `name`, `email`, `phone`.

#### [NEW] `backend/models/Admin.js`
Schema: `username`, `password` (hashed with bcryptjs).

#### [NEW] `backend/middleware/auth.js`
Session check middleware to protect admin routes.

#### [NEW] `backend/routes/events.js`
- `GET /api/events` — List all events
- `GET /api/events/:id` — Single event
- `POST /api/events` — Create (protected)
- `PUT /api/events/:id` — Update (protected)
- `DELETE /api/events/:id` — Delete (protected)

#### [NEW] `backend/routes/registrations.js`
- `POST /api/register` — Register for event
- `GET /api/registrations` — All registrations (protected)

#### [NEW] `backend/routes/auth.js`
- `POST /api/login` — Admin login
- `POST /api/logout` — Admin logout
- `GET /api/auth/check` — Check session status

#### [NEW] `backend/seed.js`
Seeds 5 sample events and 1 admin account (`admin` / `admin123`).

#### [NEW] `backend/server.js`
Express app with session, CORS, body-parser, and route mounting.

---

### Frontend

#### [NEW] `frontend/css/style.css`
- CSS variables for colors (`--primary: #4f46e5`, `--bg: #f8fafc`, etc.)
- Navbar, hero, card grid, forms, buttons
- Hover effects, transitions, responsive breakpoints

#### [NEW] `frontend/js/api.js`
Central fetch utility with base URL, error handling.

#### [NEW] `frontend/index.html` + `frontend/js/home.js`
- Navbar, Hero section, search bar, event cards grid
- Fetches `GET /api/events`, filters by search input

#### [NEW] `frontend/event-detail.html` + `frontend/js/event-detail.js`
- Reads `?id=` from URL, fetches `GET /api/events/:id`
- Displays full info + "Register" button that links to register page

#### [NEW] `frontend/register.html` + `frontend/js/register.js`
- Name, Email, Phone fields
- Pre-fills event from URL params, posts to `POST /api/register`

#### [NEW] `frontend/admin-login.html` + `frontend/js/admin-login.js`
- Username/password form, posts to `POST /api/login`
- Redirects to dashboard on success

#### [NEW] `frontend/admin-dashboard.html` + `frontend/js/admin-dashboard.js`
- Table of all events with Edit / Delete buttons
- Modal form to Add / Edit an event
- Registrations tab to view all registrations

---

## API Design

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/events` | No | Get all events |
| GET | `/api/events/:id` | No | Get one event |
| POST | `/api/events` | Yes | Create event |
| PUT | `/api/events/:id` | Yes | Update event |
| DELETE | `/api/events/:id` | Yes | Delete event |
| POST | `/api/register` | No | Register for event |
| GET | `/api/registrations` | Yes | View all registrations |
| POST | `/api/login` | No | Admin login |
| POST | `/api/logout` | Yes | Admin logout |
| GET | `/api/auth/check` | No | Session check |

---

## Verification Plan

### Automated
- Run `node seed.js` to populate DB
- `npm start` launches server on port 5000

### Manual Verification
1. Open `frontend/index.html` in browser (or use Live Server)
2. Verify events load from API
3. Click event → detail page loads correctly
4. Register for an event → confirm in DB
5. Admin login → dashboard loads
6. Add/Edit/Delete events → DB updates
7. View registrations tab in dashboard

---

## Open Questions

> [!IMPORTANT]
> **MongoDB Connection**: Do you have MongoDB installed locally, or would you prefer using MongoDB Atlas (cloud)? The `.env` will be set up for **local MongoDB** by default (`mongodb://localhost:27017/eventportal`).

> [!NOTE]
> **Event Images**: Since there's no file upload system, event images will be stored as URLs. The seed data will use placeholder image URLs. Do you want me to generate actual images using AI, or use free placeholder services?

> [!NOTE]
> **Serving Frontend**: The frontend HTML files will work by opening directly in a browser (file://) or via a local server like VS Code Live Server. Alternatively, I can configure Express to serve the frontend as static files — making it a single server setup. Which do you prefer?
