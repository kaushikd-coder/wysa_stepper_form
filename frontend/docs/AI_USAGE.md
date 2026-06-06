# AI Usage

This document explains how VS Code Copilot was used for the frontend part of the assignment.

**Overall split: roughly 70% my work, 30% Copilot-assisted.** I built the page structure, components, and API wiring myself. Copilot helped more on complex state logic and some UI polish.

## Tools Used

- **VS Code Copilot**

---

## How I Worked

I started from the assignment mock and backend API, then built pages and components one at a time. Simple parts like the API service, types, and basic components I wrote myself. Where state got tricky step navigation, unsaved changes, step tab rules..I used Copilot for a starting point and then adjusted after testing in the browser.

---

## Harder Parts Where I Used Copilot (30%)

### 1. StepperForm state management (`StepperForm.tsx`)

**Why this was hard:** One component handles loading, current step, answers, saved snapshot, draft save, complete submit, and tab navigation. Keeping it all in sync without bugs took careful planning.

**Copilot's role:** Helped scaffold the initial state variables and handler functions (save, save and next, submit).

**What I changed:** Added `maxStepReached` for tab locking, `savedAnswers` vs `answers` for unsaved detection, and `discardUnsavedChanges()` when user leaves without saving. Fixed cases where edits persisted after "Leave without saving".

---

### 2. Step tab navigation rules

**Why this was hard:** Assignment needs forward tabs disabled until user reaches that step, but previously visited steps should stay clickable when going back.

**Copilot's role:** Helped with the first version of `isStepTabEnabled` logic.

**What I changed:** Replaced click-to-validate-forward with `maxStepReached` tracking. Forward tabs stay disabled (grey) until Save and Next advances the user. Back tabs work once a step has been reached.

---

### 3. Unsaved changes flow

**Why this was hard:** Need to detect dirty state, show confirm dialog, handle browser `beforeunload`, and revert answers on discard — all without breaking normal navigation.

**Copilot's role:** Helped with the `beforeunload` effect and confirm dialog wiring.

**What I changed:** Added `savedAnswers` snapshot updated only on successful save. On "Leave without saving", reset `answers` from snapshot before navigating. Cleared stale success messages.

---

### 4. Client-side field validation (`formUtils.ts`)

**Why this was hard:** Validation rules mirror the backend — text length, numeric range for age, required fields, select/radio option matching — but run in the browser for instant feedback.

**Copilot's role:** Helped draft `validateField` and `validateStep` functions.

**What I changed:** Adjusted to validate all steps on final submit, only current step on Save and Next. Matched error messages to field labels.

---

### 5. UI polish (responsive + skeleton loaders)

**Copilot's role:** Helped with Tailwind responsive classes for footer button stacking and skeleton component structure.

**What I changed:** Added shared `PAGE_CONTAINER` and `CONTENT_INSET` in `layout.ts` for alignment. Switched card accent from left stripe to top bar so text edges line up with section heading.

---

## What Was Mostly My Work (~70%)

- Next.js project setup and folder structure
- API service layer (`api.ts`, `submissions.ts`)
- TypeScript types matching backend responses
- Home page layout and submission list
- DynamicField component (text, select, radio rendering)
- Delete submission with confirm dialog
- Teal wellness theme and card design
- README and app documentation

---

## How I Verified Everything

1. `npm run build` — clean production build
2. Manual testing: create → fill steps → save draft → complete → list
3. Tested step tab locking, unsaved changes discard, delete flow
4. Checked mobile responsive layout in browser dev tools
5. Confirmed skeleton loaders show during API fetch

---

## Summary

Most of the frontend (70%) I structured and built myself. Copilot (~30%) helped most on StepperForm state, step tab rules, unsaved changes handling, client validation, and responsive/skeleton UI. I always tested in the browser and fixed Copilot's output before keeping it.
