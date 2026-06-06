# WYSA Stepper Form

Full-stack multi-step form app. Users can fill the Wellness Intake form, save drafts, and submit later. Form steps and fields come from the backend, so the UI stays dynamic.

## Tech stack

| Part | Stack |
|------|--------|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript, MongoDB |
| Database | MongoDB Atlas |

## Project structure

```
wysa_stepper_form/
├── backend/     # REST API
├── frontend/    # Next.js app
```

More details:
- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)

## Run locally

**1. Backend**

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/wysa-stepper?retryWrites=true&w=majority
NODE_ENV=development
```

```bash
npm run dev
```

Runs at `http://localhost:5000`

**2. Frontend**

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_USER_ID=demo-user
```

```bash
npm run dev
```

Runs at `http://localhost:3000`

## Deployment

| Service | URL |
|---------|-----|
| Backend (Render) | https://wysa-stepper-form.onrender.com |
| Health check | https://wysa-stepper-form.onrender.com/health |

For production, set the frontend env to:

```env
NEXT_PUBLIC_API_URL=https://wysa-stepper-form.onrender.com
```

## Docs

- [backend/API_DOCS.txt](backend/API_DOCS.txt) — API endpoints
- [frontend/APP_DOCS.txt](frontend/APP_DOCS.txt) — app flows
- [backend/docs/AI_USAGE.md](backend/docs/AI_USAGE.md) — AI usage (backend)
- [frontend/docs/AI_USAGE.md](frontend/docs/AI_USAGE.md) — AI usage (frontend)

## License

ISC
