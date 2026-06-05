# WYSA Stepper Form

A full-stack stepper form system where users can fill multi-step forms, save drafts, and complete submissions later. Form structure (steps and fields) is driven by the backend so new forms can be added without hardcoding the UI.

This repo currently includes the **backend** (Node.js + Express + TypeScript + MongoDB). Frontend is planned as the next step.

---

## Features

- Configurable multi-step forms managed in the database
- Dynamic field types: text, select, radio
- Draft saving with partial progress
- Submission listing with status and step progress
- Server-side validation for field values and required fields
- Seeded **Wellness Intake** form (3 steps) matching the assignment mock

---

## Tech Stack

| Layer    | Tools                          |
|----------|--------------------------------|
| Runtime  | Node.js                        |
| Framework| Express 5                      |
| Language | TypeScript                     |
| Database | MongoDB (Atlas)                |
| ODM      | Mongoose                       |
| Validation | Zod                          |

---

## Project Structure

```
wysa/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── constants/     # Shared enums
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Errors, validation, async wrapper
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── seeds/         # Wellness Intake seed data
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Helpers
│   │   ├── validations/   # Zod schemas
│   │   ├── app.ts
│   │   └── server.ts
│   ├── API_DOCS.txt       # Postman-friendly API reference
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster

### Backend setup

```bash
cd backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Update `.env` with your MongoDB connection string:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/wysa-stepper?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development
```

> Replace `<username>` and `<password>` with your Atlas database user credentials. URL-encode special characters in the password if needed.

### Run the server

```bash
npm run dev
```

Server starts at **http://localhost:5000**

On startup it connects to MongoDB and seeds the Wellness Intake form config if it does not exist.

### Other commands

```bash
npm run seed    # Manually seed form config
npm run build   # Compile TypeScript to dist/
npm start       # Run production build
```

---

## API Overview

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/form-configs` | List form configs |
| GET | `/form-configs/:id` | Get full form config |
| GET | `/submissions` | List user submissions |
| POST | `/submissions` | Create new draft |
| GET | `/submissions/:id` | Get submission details |
| PATCH | `/submissions/:id/draft` | Save draft progress |
| POST | `/submissions/:id/complete` | Complete submission |

For request bodies, sample payloads, and Postman flow, see **[backend/API_DOCS.txt](backend/API_DOCS.txt)**.

### User identity

Authentication is out of scope for this assignment. A default user is assumed:

- Default user ID: `demo-user`
- Override via header: `X-User-Id: your-user-id`
- Or query param: `?userId=your-user-id`

### Form config ID

The `:id` in `/api/form-configs/:id` is the MongoDB document ID returned from `GET /api/form-configs` — not the slug (`wellness-intake`).

---

## Testing with Postman

1. Start the server (`npm run dev`)
2. `GET /api/form-configs` — copy the form `id`
3. `GET /api/form-configs/:id` — inspect steps and fields
4. `POST /api/submissions` with `{ "formConfigId": "<id>" }`
5. `PATCH /api/submissions/:id/draft` to save progress
6. `POST /api/submissions/:id/complete` to finish
7. `GET /api/submissions` to verify status and progress

---

## Wellness Intake Form

Default seeded form with 3 steps:

1. **Personal Details** — full name, age
2. **Wellness Preferences** — primary goals, support type, notes
3. **Availability** — preferred time, contact method, additional details

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `NODE_ENV` | `development` or `production` |

Never commit `.env` to version control.

---

## License

ISC
