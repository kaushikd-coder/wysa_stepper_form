# AI Usage

## 1. AI tools used

- VS Code Copilot

## 2. Prompts I gave

- scaffold `completeSubmission` in `submission.service.ts` — validate all required fields, update status, mark steps complete
- with `saveDraft` — merge answers, track `currentStepIndex` and `completedStepIds`, validate without requiring all fields
- write config-driven field validation in `fieldValidation.service.ts` for text, select, and radio fields
- map edge cases to HTTP status codes (400, 404, 409, 422) and set up `AppError` classes
- with nested Mongoose sub-schemas for form config (steps, fields, options)

## 3. What I modified from AI output

- `completeSubmission`: added check for already-completed submissions (409), wired to my validation service instead of inline checks
- `saveDraft`: changed validation so only sent fields are checked on draft save, not all required fields
- `fieldValidation.service.ts`: removed duplicate loops, fixed import paths, added `fieldId` to error messages
- Error handling: skipped extra suggestions like concurrency locks; kept only what the assignment needs
- Mongoose schemas: defined final shape and indexes myself, fixed duplicate `slug` index warning

## 4. What AI got wrong

- First `saveDraft` suggestion validated all required fields on draft save, which broke partial progress
- Some validation suggestions used inline checks instead of the shared validation service
- Error handling suggestions were more complex than needed for this assignment
- Copilot did not catch the duplicate `slug` index until I saw the warning at runtime

## 5. How I verified correctness

- `npm run build` — TypeScript compiles without errors
- `npm run dev` — connects to MongoDB Atlas and seeds on startup
- Postman happy path: create submission → save draft → complete → list
- Postman negative tests: invalid IDs, bad field values, incomplete submit, edit completed submission
