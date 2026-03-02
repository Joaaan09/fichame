# FichaMe

Minimalist time tracking app with Apple-inspired design. One button. One timer. Clock in and out with a single tap.

![MERN](https://img.shields.io/badge/Stack-MERN-61DAFB)
![React](https://img.shields.io/badge/React-19-blue)
![Express](https://img.shields.io/badge/Express-5-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-latest-green)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

---

## About

FichaMe is a work shift tracking application built with one goal: do one thing and do it well. It lets you clock in and out of work sessions with a single button, track your daily hours, organize sessions by custom categories, and review your full work history.

Designed to feel like a native Apple app -- clean typography, generous whitespace, subtle animations, and a semantic color system.

## Features

- **One-tap clock in/out** -- Green button to start, red button to stop
- **Real-time timer** -- Ultra-light 6rem display counting your current session
- **Custom categories** -- Organize work sessions with colored tags
- **Full history** -- Browse, filter, and search all past sessions
- **Manual entries** -- Create and edit sessions manually with custom dates
- **Daily stats** -- Automatic calculation of hours worked per day
- **Dark mode** -- Native dark theme toggle
- **Responsive** -- Full mobile support with bottom navigation
- **Auth system** -- Complete JWT-based authentication with bcrypt

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Node.js 20 | Server runtime |
| Express 5 | Web framework |
| MongoDB | NoSQL database |
| Mongoose 9 | MongoDB ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| validator | Input validation |

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 7 | Build tool + dev server |
| React Router 7 | SPA routing |
| Axios | HTTP client |
| React Select | Category dropdown |

### Infrastructure

| Technology | Purpose |
|---|---|
| Docker Compose | Service orchestration |
| Nginx | Reverse proxy + static file serving |
| Node Alpine | Lightweight Docker images |

## Architecture

```
fichame/
├── docker-compose.yaml
├── backend/
│   ├── Dockerfile
│   ├── index.js                  # Express server entry point
│   ├── database/connection.js    # MongoDB connection
│   ├── models/
│   │   ├── User.js               # name, email, password (hashed)
│   │   ├── Category.js           # name, color, user ref
│   │   └── WorkSession.js        # checkIn, checkOut, category ref
│   ├── controllers/
│   │   ├── UserController.js     # Register, login, update profile
│   │   ├── CategoryController.js # CRUD categories
│   │   └── WorkSessionController.js # Start, end, create, list sessions
│   ├── routes/
│   │   ├── user.js
│   │   ├── category.js
│   │   └── workSession.js
│   ├── middlewares/auth.js       # JWT verification middleware
│   ├── helpers/validate.js       # Input validation
│   └── services/jwt.js           # Token generation
└── frontend/
    ├── Dockerfile                # Multi-stage: build + Nginx
    ├── nginx.conf                # Proxy /api -> backend, SPA fallback
    ├── vite.config.js            # Dev proxy to backend
    └── src/
        ├── components/
        │   ├── pages/
        │   │   ├── Home.jsx      # Dashboard: timer + clock button
        │   │   ├── Historial.jsx # Session history with filters
        │   │   └── Profile.jsx   # User profile management
        │   ├── layout/
        │   │   ├── public/       # Auth pages layout (login, register)
        │   │   └── private/      # App layout (header, nav, categories)
        │   ├── user/
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   └── common/Modal.jsx  # Reusable modal component
        ├── context/
        │   ├── AuthProvider.jsx  # Global auth state
        │   └── ThemeContext.jsx  # Dark mode toggle
        ├── hooks/
        │   ├── useAuth.jsx       # Auth context accessor
        │   ├── useHome.jsx       # Dashboard logic (active session, stats)
        │   ├── useWorkSessions.jsx # Session CRUD operations
        │   ├── useCategories.jsx # Category management
        │   └── useForm.jsx       # Form state handler
        ├── helpers/
        │   ├── Global.jsx        # API base URL
        │   └── FormatDate.jsx    # Date formatting utilities
        └── router/Routing.jsx    # Route definitions
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Or: Node.js 20+ and MongoDB for local development

### Run with Docker (recommended)

```bash
# 1. Clone the repo
git clone https://github.com/Joaaan09/fichame.git
cd fichame

# 2. Create the external network (first time only)
docker network create reverse_proxy_network

# 3. Create backend environment file
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# 4. Build and start all services
docker compose up -d --build
```

The app will be available through your Nginx reverse proxy configuration.

### Run locally (development)

**Backend:**

```bash
cd backend
npm install

# Create .env file with:
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/fichame
# JWT_SECRET=your_secret_key

npx nodemon index.js
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs on `http://localhost:5173` with Vite's proxy forwarding `/api` requests to the backend on port 3000.

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://mongodb_fichame:27017/fichame` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_random_secret` |
| `NODE_ENV` | Runtime environment | `production` |

## API Endpoints

### Users `/api/user`

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Create a new account |
| POST | `/login` | No | Sign in and receive JWT token |
| PUT | `/update` | Yes | Update user profile |

### Categories `/api/category`

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/create` | Yes | Create a new category |
| GET | `/list` | Yes | List user's categories |
| DELETE | `/remove/:id` | Yes | Delete a category |

### Work Sessions `/api/work-session`

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/start` | Yes | Clock in (start a session) |
| POST | `/end` | Yes | Clock out (end active session) |
| POST | `/create` | Yes | Create a manual session |
| PUT | `/update/:id` | Yes | Edit an existing session |
| GET | `/list` | Yes | List all user sessions |
| GET | `/active` | Yes | Get current active session |
| DELETE | `/remove/:id` | Yes | Delete a session |

## Design System

Apple-inspired design tokens with light and dark mode support:

```
Light Mode                    Dark Mode
--bg-body:    #F5F5F7         #000000
--bg-card:    #FFFFFF         #1C1C1E
--text:       #1D1D1F         #F5F5F7
--accent:     #0071E3         #0071E3
--green:      #34C759         #34C759
--red:        #FF3B30         #FF3B30
```

Key design decisions:
- **Typography**: Inter / SF Pro system font stack, ultra-light (200) timer display
- **Spacing**: Generous whitespace with 24px card radius
- **Animations**: iOS-style cubic-bezier transitions (`0.25, 0.1, 0.25, 1`)
- **Glass effect**: Subtle glassmorphism on surfaces (`rgba(255,255,255,0.72)`)

## Docker Services

| Service | Container | Description |
|---|---|---|
| `server_fichame` | Backend API | Node.js + Express on port 3000 |
| `client_fichame` | Frontend | Nginx serving React build on port 80 |
| `mongodb_fichame` | Database | MongoDB with persistent volume |

All services communicate through the `reverse_proxy_network` Docker network.

### Useful Commands

```bash
# Rebuild and restart backend
docker compose up -d --build server_fichame

# View backend logs
docker logs server_fichame --tail 50

# Stop all services
docker compose down

# Rebuild everything from scratch
docker compose up -d --build
```

## Routes

| Path | Layout | Component | Description |
|---|---|---|---|
| `/` | Public | Login | Sign in page |
| `/login` | Public | Login | Sign in page |
| `/registro` | Public | Register | Create account |
| `/home` | Private | Home | Dashboard with timer |
| `/home/historial` | Private | Historial | Session history |
| `/home/profile` | Private | Profile | User settings |

## Author

**Joan Coll**

## License

ISC
