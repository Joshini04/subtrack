# SubTrack

A personal subscription tracker that normalizes mixed billing cycles (monthly vs. yearly) into one comparable number, so you always know what you're actually spending — and get reminded before anything renews.

**Live app:** https://subtrack-seven-psi.vercel.app
**Backend API:** https://subtrack-z7ig.onrender.com

## Features

- **Auth** — signup/login with JWT, passwords hashed with bcrypt
- **Subscription CRUD** — add, edit, delete subscriptions with name, cost, billing cycle, renewal date, and a color tag
- **Cost normalization** — automatically converts yearly costs to monthly-equivalent (and vice versa) so Total Monthly Spend and Total Annual Spend are always accurate, no matter how each subscription bills
- **Renewing Soon** — a date-range query surfaces anything renewing within a window you choose (1 day / 3 days / 1 week / 2 weeks)
- **Browser notifications** — get a native OS popup when something's renewing soon, the moment you open the dashboard
- **Automatic email reminders** — a daily job (triggered by a free external scheduler) checks for subscriptions renewing in exactly 1, 3, or 7 days and emails a summary via Resend — fully automatic, no manual triggering needed
- **No real payment data** — subscriptions are user-entered only; nothing touches actual credit cards

## Tech Stack

**Frontend:** React (Vite), React Router, plain CSS
**Backend:** Node.js, Express
**Database:** PostgreSQL (hosted on Neon)
**Email:** Resend
**Deployment:** Vercel (frontend), Render (backend)
**Scheduling:** cron-job.org (free daily trigger for the reminder job)

## How the cost calculation works

Given:
- Netflix: $15/month
- Amazon Prime: $139/year

The backend converts Prime's yearly cost to its monthly equivalent: $139 ÷ 12 ≈ $11.58/month. Added to Netflix, **Total Monthly Spend ≈ $26.58**. For **Total Annual Spend**, it's the reverse: Netflix's $15 × 12 = $180, plus Prime's $139 = **$319/year**.

This logic lives entirely in the Express backend (`server/src/utils/calculations.js`) — the frontend just displays whatever number the backend sends.

## Database schema

**users**
| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| name | VARCHAR(100) |
| email | VARCHAR(255) UNIQUE |
| password_hash | VARCHAR(255) |

**subscriptions**
| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| user_id | INTEGER (FK → users.id, ON DELETE CASCADE) |
| name | VARCHAR(100) |
| cost | NUMERIC(10,2) |
| billing_cycle | VARCHAR(10) — 'monthly' or 'yearly' |
| next_renewal_date | DATE |
| color | VARCHAR(20) |

## Running locally

**Backend**
```bash
cd server
npm install
# Create a .env file with DATABASE_URL, JWT_SECRET, RESEND_API_KEY, CRON_SECRET
npm run dev
```

**Frontend**
```bash
cd client
npm install
npm run dev
```

The backend runs on `http://localhost:5000`, the frontend on `http://localhost:5173`.

## Project structure
subtrack/
├── server/ # Express API — auth, CRUD, calculation logic, email reminders
└── client/ # React (Vite) dashboard


## Author

Built by [Joshini](https://github.com/Joshini04)