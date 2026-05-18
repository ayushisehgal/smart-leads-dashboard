# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript.

## Live Demo
🚀 [https://smart-leads-dashboard-ashen.vercel.app](https://smart-leads-dashboard-ashen.vercel.app)

## GitHub Repository
📁 [https://github.com/ayushisehgal/smart-leads-dashboard](https://github.com/ayushisehgal/smart-leads-dashboard)

---

## Tech Stack

### Frontend
- React.js
- TypeScript
- TailwindCSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcrypt

---

## Features

- ✅ JWT Authentication (Register / Login / Protected Routes)
- ✅ Password hashing with bcrypt
- ✅ Role-Based Access Control (Admin / Sales User)
- ✅ Full Leads CRUD (Create, Read, Update, Delete)
- ✅ Single Lead Detail View
- ✅ Advanced Filtering (Status + Source + Search + Sort)
- ✅ Debounced Search (400ms delay)
- ✅ Backend Pagination (10 records per page with metadata)
- ✅ CSV Export
- ✅ Dark Mode
- ✅ Responsive Design
- ✅ Loading States
- ✅ Empty States
- ✅ Error Handling UI
- ✅ Form Validation
- ✅ Docker Setup
- ✅ Centralized Error Handling

---

## Project Structure

```
smart-leads/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   └── leadController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Lead.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── leadRoutes.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── app.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.ts
    │   ├── components/
    │   │   ├── leads/
    │   │   │   ├── LeadFilters.tsx
    │   │   │   ├── LeadModal.tsx
    │   │   │   ├── LeadsTable.tsx
    │   │   │   └── Pagination.tsx
    │   │   ├── ui/
    │   │   │   ├── Badge.tsx
    │   │   │   ├── EmptyState.tsx
    │   │   │   └── LoadingSpinner.tsx
    │   │   └── ProtectedRoute.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── hooks/
    │   │   ├── useDebounce.ts
    │   │   └── useLeads.ts
    │   ├── pages/
    │   │   ├── DashboardPage.tsx
    │   │   ├── LeadDetailPage.tsx
    │   │   ├── LoginPage.tsx
    │   │   └── RegisterPage.tsx
    │   ├── types/
    │   │   └── index.ts
    │   └── App.tsx
    ├── .env.example
    ├── package.json
    └── tailwind.config.js
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/ayushisehgal/smart-leads-dashboard.git
cd smart-leads-dashboard
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
```

Fill in your `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Then run:
```bash
npm install
npm run dev
```

Backend runs at: http://localhost:5000

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env
```

Fill in your `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Then run:
```bash
npm install
npm start
```

Frontend runs at: http://localhost:3000

---

## Docker Setup

Run the entire app with one command:

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /auth/register | No | Register new user |
| POST | /auth/login | No | Login user |
| GET | /auth/me | Yes | Get current user |

#### Register Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "admin"
}
```

#### Login Request Body
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

#### Auth Response
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  }
}
```

---

### Leads Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | /leads | Yes | Get all leads (with filters) |
| POST | /leads | Yes | Create new lead |
| GET | /leads/:id | Yes | Get single lead |
| PUT | /leads/:id | Yes | Update lead |
| DELETE | /leads/:id | Admin only | Delete lead |
| GET | /leads/export | Yes | Export leads as CSV |

#### Query Parameters for GET /leads

| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| status | string | New, Contacted, Qualified, Lost | Filter by status |
| source | string | Website, Instagram, Referral | Filter by source |
| search | string | any | Search by name or email |
| sort | string | latest, oldest | Sort order |
| page | number | any | Page number (default: 1) |
| limit | number | any | Records per page (default: 10) |

#### Example Request
```
GET /api/leads?status=Qualified&source=Instagram&search=John&sort=latest&page=1
```

#### Leads List Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "lead_id",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "createdBy": {
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2026-05-18T00:00:00.000Z",
      "updatedAt": "2026-05-18T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Create Lead Request Body
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "status": "New",
  "source": "Website"
}
```

---

## Role-Based Access Control

| Feature | Admin | Sales User |
|---------|-------|------------|
| View all leads | ✅ | ❌ (own leads only) |
| Create lead | ✅ | ✅ |
| Edit lead | ✅ | ✅ (own leads only) |
| Delete lead | ✅ | ❌ |
| Export CSV | ✅ | ✅ (own leads only) |

---

## Environment Variables

### Backend `.env.example`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend `.env.example`
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Deployment

- **Frontend**: Vercel — https://smart-leads-dashboard-ashen.vercel.app
- **Backend**: Railway
- **Database**: MongoDB Atlas

---

