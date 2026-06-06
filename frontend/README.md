# WYSA Stepper Form — Frontend

Next.js frontend for the multi-step Wellness Intake form. Users can create submissions, fill forms step-by-step, save drafts, and track progress.

---

## Features

- Submission list with status, progress bar, and delete
- Dynamic stepper form driven by backend config (text, select, radio)
- Save draft, Save and Next, and Submit flows
- Client-side validation before moving forward
- Step tab locking — cannot skip ahead without completing prior steps
- Unsaved changes warning with discard on leave
- Skeleton loaders while data loads
- Responsive layout for mobile and desktop

---

## Tech Stack

| Layer      | Tools              |
|------------|--------------------|
| Framework  | Next.js 16 (App Router) |
| Language   | TypeScript         |
| Styling    | Tailwind CSS v4    |
| HTTP       | Axios              |
| Icons      | Lucide React       |

---

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home — submission list
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── form/[id]/page.tsx    # Stepper form page
│   ├── components/
│   │   ├── form/                 # StepperForm, StepTabs, DynamicField
│   │   ├── submissions/          # List, Card, Create button
│   │   └── ui/                   # Button, Badge, Dialog, Skeleton
│   ├── services/
│   │   ├── api.ts                # Axios instance
│   │   └── submissions.ts        # API calls
│   ├── lib/                      # Utils, layout, env
│   ├── types/
│   └── constants/
├── docs/
│   └── AI_USAGE.md
├── APP_DOCS.txt                    # App flow & feature reference
├── .env.example
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Backend running at `http://localhost:5000` (see `../backend/README.md`)

### Setup

```bash
cd frontend
npm install
```

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

Default values:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_USER_ID=demo-user
```

### Run

```bash
npm run dev
```

App runs at **http://localhost:3000**

### Other commands

```bash
npm run build   # Production build
npm start       # Run production build
npm run lint    # ESLint
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | List submissions, create new Wellness Intake |
| `/form/[id]` | Multi-step form for a submission |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend base URL (default: `http://localhost:5000`) |
| `NEXT_PUBLIC_USER_ID` | User ID sent as `X-User-Id` header (default: `demo-user`) |

Never commit `.env.local` to version control.

---

## Backend API

The frontend talks to the backend REST API. Full endpoint details are in `../backend/API_DOCS.txt`.

Key calls used:
- `GET /api/submissions` — list
- `POST /api/submissions` — create
- `GET /api/submissions/:id` — load form
- `GET /api/form-configs/:id` — load steps/fields
- `PATCH /api/submissions/:id/draft` — save progress
- `POST /api/submissions/:id/complete` — submit
- `DELETE /api/submissions/:id` — delete

For user flows and UI behaviour, see **[APP_DOCS.txt](APP_DOCS.txt)**.

---

## License

ISC
