# Splitwise Clone (React Native + Next.js)

## Overview
This project is a simple Splitwise-like app to track and split expenses using React Native (Expo) and Next.js. It includes authentication, a transaction list, and a split feature.

## Features
- **Google Sign-In Authentication** via Supabase OAuth.
- **Transactions Page** fetching user transactions from the backend.
- **Split Transaction Modal** to split expenses with friends.
- **Database Setup** using Prisma with PostgreSQL.
- **Protected API Routes** ensuring only authenticated users can access them.

## Tech Stack
- **Frontend:** React Native (Expo)
- **Backend:** Next.js API (Node.js, Express.js)
- **Database:** PostgreSQL (Supabase hosted)
- **State Management:** React Context API

---

## Setup Instructions

### 1. Clone the Repository
```bash
  git clone <repo-url>
  cd splitwise-clone
```

### 2. Install Dependencies
```bash
  npm install  # or yarn install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add:
```env
SUPABASE_URL=<your_supabase_url>
SUPABASE_ANON_KEY=<your_supabase_anon_key>
DATABASE_URL=<your_postgresql_database_url>
```

### 4. Setup Database & Prisma
```bash
  npx prisma migrate dev --name init
  npx prisma generate
  node prisma/seed.js  # Using seed.js instead of seed.ts
```

### 5. Run the Development Servers
#### Backend (Next.js API)
```bash
  cd backend
  npm run dev
```
#### Frontend (React Native Expo)
```bash
  cd frontend
  npm start
```

---

## Assumptions Made

1. **Seed File Format**
   - The prompt specified `prisma/seed.ts`, but I used `seed.js` instead.
   - Assumption: Using JavaScript (`seed.js`) ensures better compatibility without requiring TypeScript compilation.

2. **Database Setup**
   - The requirement mentioned Supabase or local PostgreSQL.
   - Assumption: I chose Supabase for easy authentication integration and hosted PostgreSQL support.

3. **Authentication Handling**
   - Supabase + Google OAuth used as mandated.
   - Assumption: Used Supabase’s built-in OAuth flow without additional JWT management.

4. **State Management**
   - Not explicitly mentioned in the prompt.
   - Assumption: Used React Context API to manage state efficiently.

5. **API Endpoints**
   - Additional endpoints were required beyond the given ones.
   - Assumption: Added necessary endpoints for enhanced functionality.

6. **Right Swipe to Split (Bonus Feature)**
   - Optional enhancement.
   - Assumption: Implemented using `react-native-gesture-handler`.

7. **Offline Mode & Local Caching**
   - Suggested but not mandatory.
   - Assumption: Used `@react-native-async-storage/async-storage` for storing transactions locally but it doesnt work properly.

8. **Transaction Filtering**
   - Suggested as an extra feature.
   - Assumption: Implemented filtering on frontend state for performance.

9. **API Protection**
   - Required authentication for API routes.
   - Assumption: Used middleware in Next.js to verify Supabase authentication before processing requests.

10. **Deployment & Hosting**
   - No specific instructions provided.
   - Assumption: Frontend deployed on Expo Go, backend hosted on Vercel.

---

## AI
Used chatgpt for debugging and refactoring. Used rork to get design and functionalities ideas. Explored other models to understand the core functionalities

---

## Contact
For any queries, contact **Aaditya Salgaonkar** at aadityasalgaonkar@gmail.com.

---


