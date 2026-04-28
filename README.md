# TaskFlow — Mini SaaS Task Management System

A production-ready full-stack Task Management SaaS built with Node.js, Express, React, and PostgreSQL.

## Features

- **JWT Authentication** — Secure signup/login with bcrypt password hashing
- **Multi-User Task Isolation** — Every user sees only their own tasks
- **Full Task CRUD** — Create, read, update, delete tasks
- **Status Tracking** — Pending → In Progress → Completed workflow
- **Priority Levels** — High / Medium / Low with visual indicators
- **Due Dates** — Set deadlines with overdue highlighting
- **Search & Filter** — Real-time search + filter by status
- **Dashboard Stats** — Live counts by status
- **Protected Routes** — Frontend + backend route protection
- **Input Validation** — express-validator on all API inputs
- **Error Middleware** — Centralized error handling

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| HTTP Client | Axios (with JWT interceptor) |
| Backend | Node.js, Express.js |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Validation | express-validator |
| ORM | Sequelize v6 |
| Database | PostgreSQL |
| Notifications | react-hot-toast |

---

## Project Structure

```
taskflow/
├── backend/
│   ├── config/
│   │   └── database.js        # Sequelize connection
│   ├── controllers/
│   │   ├── authController.js  # signup, login, getMe
│   │   └── taskController.js  # CRUD + status update
│   ├── middleware/
│   │   ├── auth.js            # JWT protect middleware
│   │   ├── errorHandler.js    # Global error handler
│   │   └── validate.js        # Input validation rules
│   ├── models/
│   │   ├── User.js            # User model (bcrypt hooks)
│   │   └── Task.js            # Task model (belongsTo User)
│   ├── routes/
│   │   ├── auth.js            # /api/auth/*
│   │   └── tasks.js           # /api/tasks/*
│   ├── .env.example
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ProtectedRoute.jsx
        │   ├── TaskCard.jsx
        │   └── TaskModal.jsx
        ├── context/
        │   └── AuthContext.jsx    # Global auth state
        ├── hooks/
        │   └── useTasks.js        # Task API calls + state
        ├── pages/
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   └── Dashboard.jsx
        └── utils/
            └── api.js             # Axios instance + interceptors
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd taskflow
```

### 2. Set Up the Database

```sql
CREATE DATABASE taskflow_db;
```

### 3. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow_db
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Install dependencies and start:
```bash
npm install
npm run dev
```

The server will auto-sync the database schema on first run.

### 4. Configure Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Visit **http://localhost:5173**

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | Get all tasks (with filters) | Private |
| POST | `/api/tasks` | Create new task | Private |
| GET | `/api/tasks/:id` | Get single task | Private |
| PUT | `/api/tasks/:id` | Update task | Private |
| PATCH | `/api/tasks/:id/status` | Update status only | Private |
| DELETE | `/api/tasks/:id` | Delete task | Private |

**Query params for GET /api/tasks:**
- `status` — filter by status (`pending`, `in_progress`, `completed`)
- `priority` — filter by priority (`low`, `medium`, `high`)
- `search` — search title/description

---

## Database Schema

### Users
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | VARCHAR(100) | Required |
| email | VARCHAR(255) | Unique, required |
| password | VARCHAR(255) | bcrypt hashed |
| createdAt | TIMESTAMP | Auto |
| updatedAt | TIMESTAMP | Auto |

### Tasks
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| userId | UUID | FK → users.id (CASCADE) |
| title | VARCHAR(255) | Required |
| description | TEXT | Optional |
| status | ENUM | pending / in_progress / completed |
| priority | ENUM | low / medium / high |
| dueDate | DATE | Optional |
| createdAt | TIMESTAMP | Auto |
| updatedAt | TIMESTAMP | Auto |

---

## Security

- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT tokens verified on every protected request
- User-task isolation enforced at the **database query level** (userId filter)
- Input validation on all endpoints via express-validator
- CORS configured for specific frontend origin
