# Event Management Portal

A beginner-friendly, clean, responsive full-stack **Event Management Portal** designed for college projects. It allows students to browse events and register, and administrators to securely manage events (Add, Edit, Delete) and view registrations.

---

## 🚀 Quick Start (Running the Application)

Follow these simple steps to get the application up and running on your system:

### 1. Install Dependencies
Navigate to the `backend` folder and install the required NPM packages:
```bash
cd backend
npm install
```

### 2. Start the Application
Start the Node.js / Express backend server:
```bash
npm start
```

On start:
- The server will attempt to connect to your configured database.
- **Auto-Fallback Support**: If a local or remote MongoDB instance is not available (or is blocked by network settings), it will automatically launch a secure **in-memory MongoDB instance** and populate it with sample events and admin credentials.
- The server will run on: [http://localhost:5000](http://localhost:5000)

### 3. Open the Portal
Open your browser and navigate to:
👉 **[http://localhost:5000](http://localhost:5000)** (served directly by Express!)

---

## 🔑 Admin Credentials
To access the Administrator Dashboard to add, update, delete events, or view attendee registrations:
* **Username**: `admin`
* **Password**: `admin123`

---

## 🛠️ Folder Structure

```
Event Management Portal/
├── backend/
│   ├── config/db.js           # Database connection & memory fallback
│   ├── middleware/auth.js     # Session-based auth middleware
│   ├── models/                # Database Schemas (Event, Admin, Registration)
│   ├── routes/                # API route handlers
│   ├── server.js              # Server entry point & static serving
│   ├── seed.js                # Database seeder utility
│   └── .env                   # Environment configurations
│
└── frontend/                  # Responsive user interface files
    ├── css/style.css          # Styled using curated harmonious color theme
    ├── js/                    # Vanilla JavaScript client controller logic
    ├── index.html             # Home page with event grids & live search
    ├── event-detail.html      # Detail view with organizer metadata
    ├── register.html          # Student Registration Form
    ├── admin-login.html       # Secure Admin Login page
    └── admin-dashboard.html   # Admin panel (Tab layout, modals, tables)
```

---

## 📋 Features

- **College Theme UI**: Styled with clean modern fonts, soft gradients, responsive glassmorphism styles, cards, and smooth hover state transitions.
- **Search Bar**: Real-time frontend matching by event name, venue, or description.
- **Event Registrations**: Allows guests to register. Employs email regex format and field requirement validations.
- **Admin Panel**: Secure dashboard tabs separating Event CRUD controls and the attendee registration spreadsheet lists. Includes edit modals.
