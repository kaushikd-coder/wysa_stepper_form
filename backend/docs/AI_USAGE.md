# AI Usage

This document explains how VS Code Copilot was used during the assignment.

**Overall split: roughly 70% my work, 30% Copilot-assisted.** I handled the design, API structure, and most of the implementation. Copilot helped more on the harder logic parts where there were many edge cases to think through.

## Tools Used

- **VS Code Copilot**

---

## How I Worked

I started by reading the assignment and sketching the API endpoints and folder layout myself. From there I built models, routes, controllers, and services step by step. For straightforward parts (basic CRUD, seed data, Express setup) I mostly wrote on my own. Where the logic got tricky — especially around validation and submission state — I used Copilot to get a starting point, then reviewed and changed a lot of it before keeping anything.

---

## Harder Parts Where I Used Copilot (30%)

### 1. Complete submission logic (`submission.service.ts`)

**Why this was hard:** Finishing a form means validating every required field across all 3 steps, updating status, marking all steps complete, and blocking edits after. Getting the flow right took some back and forth.

**Copilot's role:** Helped scaffold the `completeSubmission` function — merging final answers, running full validation, and setting status to `completed`.

**What I changed:** Added the check for already-completed submissions (409). Wired it to my validation service instead of inline checks. Tested missing required fields and invalid values in Postman until it behaved correctly.

---

### 2. Draft save vs complete — business rules

**Why this was hard:** Drafts need to allow partial answers but still reject bad data (wrong radio value, age out of range). Complete submit must be strict. Two different validation modes in one system.

**Copilot's role:** Helped with the `saveDraft` flow — merging answers instead of replacing, tracking `currentStepIndex` and `completedStepIds`, and calling validation with a `requireAllRequired: false` flag.

**What I changed:** The first suggestion validated all fields on draft save, which broke partial progress. I fixed that so only sent fields get validated on draft, all required fields on complete.

---

### 3. Config-driven field validation (`fieldValidation.service.ts`)

**Why this was hard:** Validation rules come from the database config, not hardcoded. Text fields can have length or numeric rules. Select/radio must match allowed options. Unknown field IDs need to be rejected.

**Copilot's role:** Helped draft the per-type validation branching and the `validateProvidedAnswers` function.

**What I changed:** Removed duplicate loops, fixed import paths, and adjusted error messages to include `fieldId` for the frontend.

---

### 4. Edge cases & error handling

**Why this was hard:** The assignment asks for defensive handling — invalid IDs, broken form config, editing a completed submission, unknown steps.

**Copilot's role:** Helped list edge cases and map them to status codes (400, 404, 409, 422). Also helped with the custom `AppError` classes and the global error handler.

**What I changed:** Skipped over-engineered suggestions (like concurrency locks). Kept only what the assignment actually needs.

---

### 5. Nested Mongoose schemas

**Why this was hard:** Form config is deeply nested (steps → fields → options → validation).

**Copilot's role:** Suggested sub-schema patterns like `{ _id: false }` for nested documents.

**What I did:** Defined the final shape and indexes myself. Fixed a duplicate `slug` index warning.

---

## What Was Mostly My Work (70%)

- Reading the assignment and deciding the API design
- Project setup (Express, TypeScript, Mongoose, Zod)
- Routes, controllers, and wiring the service layer
- Wellness Intake seed data (from the assignment mock)
- Submission listing with progress (`completedSteps / totalSteps`)
- MongoDB Atlas setup in the UI
- README, API docs, and all Postman testing

---

## How I Verified Everything

1. `npm run build` — clean TypeScript compile
2. `npm run dev` — Atlas connection + seed on startup
3. Postman happy path: create → draft → complete → list
4. Postman negative tests: bad IDs, invalid values, incomplete submit, edit completed submission

---

## Summary

Most of the backend (~70%) I wrote and structured myself. Copilot (~30%) helped most on the harder business logic — complete submission flow, draft vs complete validation rules, config-driven field validation, and edge case handling. I always reviewed, tested, and fixed Copilot's output before using it.
