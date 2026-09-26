# Task Management App

A modern, production-style Task Management mobile application built with React Native (Expo) and a Node.js + Express + TypeScript backend, using MongoDB Atlas for persistence and passwordless email OTP authentication via Resend.

---

## Features

- **Passwordless Email OTP Authentication**: Secure 6-digit one-time password delivered via Resend.
- **Persistent Session**: Auto-login on app restart backed by AsyncStorage and JWT verification.
- **Multi-User Task Isolation**: Strict server-side user scoping — users can never read, modify, or delete another user's tasks.
- **Task Management (CRUD)**:
  - Create tasks with title, optional description, priority, due date, and initial status.
  - View task lists with real-time status filtering and search.
  - Open detailed view with creation/update timestamps.
  - Cycle or update task status directly from details view or forms.
  - Edit existing tasks with all fields pre-filled.
  - Delete tasks with a native confirmation modal.
- **Search & Filters**: Real-time debounced title/description search alongside status filter tabs (`All`, `Pending`, `In Progress`, `Completed`).
- **Priority & Due Dates**: Low, Medium, and High priority labels with subtle, restrained color badges and formatted calendar dates (`Sep 28, 2026`).
- **Profile & Logout**: View account details, email address, and securely terminate session.
- **Production UI/UX**: Clean, restrained design system compliant with professional mobile usability guidelines (safe areas, keyboard avoidance, touch targets, loading/empty/error states).

---

## Tech Stack

### Mobile
- **React Native** (Expo SDK 52+)
- **TypeScript**
- **React Navigation** (Bottom Tabs + Native Stack)
- **Axios** (Centralized API client with JWT & 401 interceptors)
- **AsyncStorage** (Token and session persistence)
- **@react-native-community/datetimepicker** (Cross-platform native date picker)
- **react-native-safe-area-context** & **react-native-screens**

### Backend
- **Node.js** & **Express.js** (TypeScript)
- **MongoDB Atlas** with **Mongoose** ODM
- **JWT** (`jsonwebtoken`) for stateless session authorization
- **bcryptjs** for cryptographically secure OTP hashing
- **Resend** SDK for transactional email delivery
- **Helmet** & **CORS** for HTTP header security
- **express-validator** for schema and input sanitation

---

## Project Structure

```
task/
├── server/                        # Backend REST API
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts        # MongoDB Atlas connection
│   │   │   └── env.ts             # Typed environment configuration
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts # Handlers for send-otp & verify-otp
│   │   │   └── task.controller.ts # Handlers for task CRUD & status
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts # JWT verification & user scoping
│   │   │   └── error.middleware.ts# Centralized error handler & AppError
│   │   ├── models/
│   │   │   ├── User.ts            # User schema with hashed OTP fields
│   │   │   └── Task.ts            # Task schema with user index
│   │   ├── routes/
│   │   │   ├── auth.routes.ts     # /api/auth routing
│   │   │   └── task.routes.ts     # /api/tasks routing
│   │   ├── services/
│   │   │   ├── auth.service.ts    # Auth business logic
│   │   │   ├── email.service.ts   # Resend email dispatch
│   │   │   └── otp.service.ts     # OTP lifecycle & attempt control
│   │   ├── utils/
│   │   │   ├── jwt.ts             # JWT token sign & verify
│   │   │   └── otp.ts             # Secure OTP generation & hashing
│   │   ├── validators/
│   │   │   ├── auth.validator.ts  # Email & OTP validation rules
│   │   │   └── task.validator.ts  # Task field validation rules
│   │   ├── app.ts                 # Express application configuration
│   │   └── server.ts              # Server bootstrap entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .gitignore
│
├── mobile/                        # Expo Mobile Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.tsx         # Reusable primary/secondary/danger button
│   │   │   ├── ConfirmDialog.tsx  # Native-style delete confirmation modal
│   │   │   ├── DateField.tsx      # Platform-aware date picker input
│   │   │   ├── EmptyState.tsx     # Generic empty/search/error state card
│   │   │   ├── Input.tsx          # Styled input with inline validation
│   │   │   ├── LoadingView.tsx    # Centered activity indicator view
│   │   │   ├── PriorityBadge.tsx  # Low / Medium / High badge
│   │   │   ├── StatusBadge.tsx    # Pending / In Progress / Completed badge
│   │   │   └── TaskCard.tsx       # Compact task list card
│   │   ├── constants/
│   │   │   ├── colors.ts          # Design system color palette
│   │   │   └── spacing.ts         # Typography and spacing scale
│   │   ├── context/
│   │   │   └── AuthContext.tsx    # Global authentication provider
│   │   ├── hooks/
│   │   │   └── useAuth.ts         # Authentication context consumer
│   │   ├── navigation/
│   │   │   ├── AppNavigator.tsx   # Authenticated bottom tabs & stack
│   │   │   ├── AuthNavigator.tsx  # Unauthenticated auth stack
│   │   │   └── RootNavigator.tsx  # Conditional auth gate
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   ├── SplashScreen.tsx
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── OtpScreen.tsx
│   │   │   ├── tasks/
│   │   │   │   ├── TasksScreen.tsx
│   │   │   │   ├── TaskDetailsScreen.tsx
│   │   │   │   ├── CreateTaskScreen.tsx
│   │   │   │   └── EditTaskScreen.tsx
│   │   │   └── profile/
│   │   │       └── ProfileScreen.tsx
│   │   ├── services/
│   │   │   ├── api.ts             # Axios client with interceptors
│   │   │   ├── auth.service.ts    # Auth endpoints API client
│   │   │   └── task.service.ts    # Tasks endpoints API client
│   │   ├── types/
│   │   │   ├── auth.ts            # Auth & User interfaces
│   │   │   └── task.ts            # Task, Priority, and Status models
│   │   └── utils/
│   │       ├── date.ts            # Human-readable date formatting
│   │       └── validation.ts      # Email format regex
│   ├── App.tsx                    # Root application component
│   ├── app.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .gitignore
│
├── .gitignore
└── README.md
```

---

## Requirements

- **Node.js**: v18+ (tested on Node.js v24 LTS)
- **npm**: v9+
- **MongoDB Atlas** account & connection URI
- **Resend** account & API key for email OTP delivery
- **Expo Go** app on iOS / Android or a simulator/emulator

---

## Installation

### 1. Clone repository
```bash
git clone <repository-url>
cd task
```

### 2. Configure Backend
```bash
cd server
npm install
cp .env.example .env
```
Edit `server/.env` with your real credentials:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your-secure-jwt-secret-string-here
JWT_EXPIRES_IN=7d
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
OTP_EXPIRY_MINUTES=5
OTP_MAX_ATTEMPTS=5
OTP_RESEND_COOLDOWN_SECONDS=60
```

### 3. Configure Mobile
```bash
cd ../mobile
npm install
cp .env.example .env
```
Edit `mobile/.env`:
```env
# For local physical device testing, use your machine's LAN IP (e.g., http://192.168.1.15:5000/api)
# For Android emulator: http://10.0.2.2:5000/api
# For iOS simulator: http://localhost:5000/api
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Running the Application

### Start Backend
```bash
cd server
npm run dev
```
The server will connect to MongoDB Atlas and listen on port `5000`.

### Start Mobile App
```bash
cd mobile
npx expo start
```
- Press `w` to open in web browser.
- Press `a` to open in Android emulator.
- Press `i` to open in iOS simulator.
- Scan QR code with the **Expo Go** app on a physical device connected to the same Wi-Fi.

---

## API Endpoints

### Health Check
- `GET /api/health` — Checks API server operational status.

### Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/send-otp` | Generate & send 6-digit OTP to email | No |
| `POST` | `/api/auth/verify-otp` | Verify OTP, return JWT and user info | No |

#### `POST /api/auth/send-otp` Request
```json
{
  "email": "user@example.com"
}
```
Response:
```json
{
  "success": true,
  "message": "Verification code sent to your email"
}
```

#### `POST /api/auth/verify-otp` Request
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "651b1f9e2b109c0012a4b881",
      "email": "user@example.com"
    }
  }
}
```

### Tasks (Protected by Bearer JWT)
| Method | Endpoint | Query / Body Params | Description |
|---|---|---|---|
| `GET` | `/api/tasks` | `?status=Pending&search=review` | List user's tasks with optional filter/search |
| `GET` | `/api/tasks/:id` | — | Retrieve single task details |
| `POST` | `/api/tasks` | `{ title, description?, priority?, dueDate?, status? }` | Create a new task |
| `PUT` | `/api/tasks/:id` | `{ title, description?, priority?, dueDate?, status? }` | Update task details |
| `PATCH`| `/api/tasks/:id/status`| `{ status: "Completed" }` | Update only status |
| `DELETE`| `/api/tasks/:id` | — | Delete task (requires ownership) |

---

## Authentication Flow

1. User enters their email address on the mobile login screen.
2. Mobile calls `POST /api/auth/send-otp`.
3. The server generates a cryptographically random 6-digit OTP using Node's `crypto.randomInt`.
4. The OTP is hashed via `bcryptjs` and stored in the User document with a 5-minute expiration and a 60-second resend cooldown.
5. The raw OTP is dispatched via Resend to the user's email address (never returned via API).
6. User enters the 6-digit code on the OTP screen.
7. Mobile calls `POST /api/auth/verify-otp`.
8. The server checks attempt counts, validates expiration, and compares the bcrypt hash.
9. Upon match, the OTP fields are cleared from the database, and a signed JWT is issued.
10. Mobile stores the JWT in `AsyncStorage` and sets the global authentication state.

---

## Database

### User Collection (`users`)
- `_id`: ObjectId
- `email`: String (unique, lowercase, indexed)
- `otpHash`: String (bcrypt hash)
- `otpExpiresAt`: Date
- `otpAttempts`: Number (default: 0)
- `otpLastSentAt`: Date
- `createdAt`, `updatedAt`: Timestamps

### Task Collection (`tasks`)
- `_id`: ObjectId
- `userId`: ObjectId (references `users._id`, indexed)
- `title`: String (required, max 200 chars)
- `description`: String (optional, max 2000 chars)
- `priority`: Enum [`Low`, `Medium`, `High`] (default: `Medium`)
- `dueDate`: Date (optional)
- `status`: Enum [`Pending`, `In Progress`, `Completed`] (default: `Pending`)
- `createdAt`, `updatedAt`: Timestamps
- Compound Index: `{ userId: 1, status: 1 }`

---

## Security

- **Bcrypt Hashed OTP**: Plain text OTPs are never stored in the database.
- **Crypto-secure Generation**: Uses `crypto.randomInt` rather than `Math.random`.
- **Brute-Force Protection**: Maximum 5 attempts allowed per OTP before requiring a new code.
- **Resend Cooldown**: 60-second cooldown prevents spamming the email service.
- **User Scoping Enforced**: Every query to `/api/tasks` strictly checks `userId: req.userId` extracted from the verified JWT.
- **Mass Assignment Protection**: Updates whitelist editable fields (`title`, `description`, `priority`, `dueDate`, `status`) and reject `userId` overrides.
- **Regex Injection Prevention**: Search queries sanitize regex special characters before running MongoDB queries.
- **Clean Error Handling**: Stack traces and database internals are never returned in client HTTP responses.

---

## Manual Testing Checklist

### Authentication Flow
- [x] Submit valid email: verifies OTP is delivered.
- [x] Submit invalid email format: client shows inline validation error.
- [x] Submit incorrect OTP: returns 400 Bad Request with error message.
- [x] Submit expired OTP: rejects verification.
- [x] Submit valid OTP: stores JWT, transitions into main application.
- [x] Relaunch app: user remains authenticated via stored JWT.
- [x] Tap Logout in Profile tab: clears AsyncStorage and redirects to Login.

### Task Management
- [x] Create task with title: task immediately appears at top of task list.
- [x] Create task without title: blocked with inline error.
- [x] Open task details: shows formatted title, status, priority, description, dates.
- [x] Tap status badge: cycles task status through `Pending` -> `In Progress` -> `Completed`.
- [x] Search tasks: filter updates in real time with debouncing.
- [x] Filter by status (`Pending`, `In Progress`, `Completed`): displays matching tasks.
- [x] Edit task: changes reflect immediately on task list and details.
- [x] Delete task: prompt modal appears; confirming deletes task and navigates back to list.
