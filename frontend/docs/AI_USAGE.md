# AI Usage

## 1. AI tools used

- VS Code Copilot

## 2. Prompts I gave

- scaffold state and handlers in `StepperForm.tsx` for draft save, save and next, and submit
- write `isStepTabEnabled` logic for step tab navigation
- with unsaved changes — `beforeunload` warning and confirm dialog
- draft `validateField` and `validateStep` in `formUtils.ts` to match backend rules
- with Tailwind responsive classes for footer buttons and skeleton loader structure

## 3. What I modified from AI output

- `StepperForm.tsx`: added `maxStepReached` for tab locking, `savedAnswers` vs `answers` for dirty state, and `discardUnsavedChanges()` on leave without saving
- Step tabs: replaced click-to-validate-forward with `maxStepReached` — forward tabs stay disabled until Save and Next
- Unsaved changes: `savedAnswers` updates only on successful save; reset `answers` from snapshot on discard
- `formUtils.ts`: validate all steps on final submit, only current step on Save and Next; matched error messages to field labels
- UI: added shared `PAGE_CONTAINER` and `CONTENT_INSET` in `layout.ts`; changed card accent from left stripe to top bar

## 4. What AI got wrong

- First step tab logic used click-to-validate-forward instead of tracking max step reached
- Unsaved changes flow did not revert answers when user chose "Leave without saving"
- Validation draft only checked the current step on final submit instead of all steps
- Responsive footer layout needed manual fixes for mobile stacking

## 5. How I verified correctness

- `npm run build` — production build passes
- Manual test: create submission → fill steps → save draft → complete → list
- Tested step tab locking, unsaved changes discard, and delete flow
- Checked mobile layout in browser dev tools
- Confirmed skeleton loaders show during API fetch
