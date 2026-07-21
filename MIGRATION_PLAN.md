# FemCare.AI — Migration Plan
## Base44 → Standalone Node/TypeScript + PostgreSQL Backend

---

## Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Detach from Base44 (frontend) | ✅ Complete |
| Phase 2 | Backend scaffold + data model + REST APIs | ⏳ Next |
| Phase 3 | AI integration endpoints | ⏳ Pending |
| Phase 4 | Cleanup + TypeScript + React Query | ⏳ Pending |

---

## Codebase Summary

FemCare.AI is a mobile-first React PWA for women tracking PCOS/PCOD symptoms. It logs daily
symptoms (cycle, acne, mood, sleep, pelvic pain, etc.), computes cycle phase, generates
AI-powered "awareness summaries" (not diagnoses), and produces a printable doctor-visit report.

The entire backend — auth, database, and LLM calls — was originally delegated to Base44.
Phase 1 has removed all Base44 dependencies from the frontend. The frontend now expects a
custom backend running at `http://localhost:3001/api` (configured in `.env.local`).

---

## Frontend Stack (unchanged)

- React 18 + Vite 6
- React Router v6
- TanStack React Query v5 (configured, not yet fully used)
- Tailwind CSS + shadcn/ui (Radix UI)
- Axios (new — replaces Base44 SDK HTTP layer)
- Framer Motion, Recharts, date-fns, react-hook-form, zod

---

## Phase 1 — Detach from Base44 ✅

### Files Created
- `src/api/client.js` — Axios client with JWT Bearer interceptor + global 401 handler
- `src/services/auth.js` — all auth operations (login, register, OTP, Google, forgot/reset password)
- `src/services/symptomLogs.js` — symptom log CRUD
- `src/services/userProfile.js` — profile get/create/update/delete
- `src/services/insights.js` — insight fetch + AI generate trigger
- `src/services/logTemplates.js` — log template CRUD
- `.env.local` — `VITE_API_BASE_URL=http://localhost:3001/api`

### Files Rewritten
- `src/lib/AuthContext.jsx` — uses `authService`, identical context shape
- `src/lib/insightEngine.js` — pure computation functions only; `generateInsight()` delegates to `insightService.generate()`
- `vite.config.js` — Base44 plugin removed, `@` path alias kept

### Files Updated (base44 imports replaced with service calls)
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/pages/ForgotPassword.jsx`
- `src/pages/ResetPassword.jsx`
- `src/pages/Onboarding.jsx`
- `src/pages/Home.jsx`
- `src/pages/Log.jsx`
- `src/pages/Insights.jsx`
- `src/pages/History.jsx`
- `src/pages/DoctorReport.jsx`
- `src/pages/Profile.jsx`
- `src/components/Layout.jsx`
- `src/components/LogTemplates.jsx`
- `src/components/ForYouArticles.jsx`
- `src/lib/PageNotFound.jsx`
- `src/App.jsx` — removed Base44-specific error handling

### Files Deleted
- `src/api/base44Client.js`
- `src/lib/app-params.js`
- `@base44/sdk` and `@base44/vite-plugin` npm packages

---

## Phase 2 — Backend Scaffold + Data Model + REST APIs

### 2.1 Backend Folder Structure

```
backend/
  src/
    routes/
      auth.ts
      symptomLogs.ts
      userProfile.ts
      insights.ts
      logTemplates.ts
      ai.ts
    middleware/
      auth.ts          ← JWT verification, attaches req.userId
      validate.ts      ← Zod request body validation helper
    services/
      insightCompute.ts  ← pure functions ported from src/lib/insightEngine.js
      llm.ts             ← LLM provider abstraction (AWS Bedrock / OpenAI)
    db/
      client.ts          ← Prisma client singleton
    index.ts             ← Express app entry point
  prisma/
    schema.prisma
  .env
  package.json
  tsconfig.json
```

### 2.2 Backend npm Packages

```json
{
  "dependencies": {
    "express": "^4.18",
    "cors": "^2.8",
    "helmet": "^7",
    "bcryptjs": "^2.4",
    "jsonwebtoken": "^9",
    "nodemailer": "^6",
    "@prisma/client": "^5",
    "zod": "^3",
    "@aws-sdk/client-bedrock-runtime": "^3"
  },
  "devDependencies": {
    "typescript": "^5",
    "ts-node-dev": "^2",
    "prisma": "^5",
    "@types/express": "^4",
    "@types/bcryptjs": "^2",
    "@types/jsonwebtoken": "^9",
    "@types/cors": "^2",
    "@types/nodemailer": "^6"
  }
}
```

### 2.3 Prisma Schema

```prisma
model User {
  id            String        @id @default(cuid())
  email         String        @unique
  passwordHash  String
  emailVerified Boolean       @default(false)
  createdAt     DateTime      @default(now())
  profile       UserProfile?
  symptomLogs   SymptomLog[]
  insights      Insight[]
  logTemplates  LogTemplate[]
}

model UserProfile {
  id                     String   @id @default(cuid())
  userId                 String   @unique
  user                   User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  displayName            String
  age                    Int?
  diagnosisStatus        String   @default("not_sure")
  cycleRegularity        String   @default("unknown")
  typicalCycleLength     Int?
  hasUltrasoundFinding   Boolean  @default(false)
  ultrasoundNotes        String?
  disclaimerAcknowledged Boolean  @default(false)
  onboardingCompleted    Boolean  @default(false)
  updatedAt              DateTime @updatedAt
}

model SymptomLog {
  id                 String   @id @default(cuid())
  userId             String
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  logDate            DateTime
  cycleStarted       Boolean  @default(false)
  cycleEnded         Boolean  @default(false)
  acneSeverity       Int      @default(0)
  facialHairGrowth   Boolean  @default(false)
  hairThinning       Boolean  @default(false)
  weightChange       String   @default("unknown")
  mood               Int      @default(3)
  sleepQuality       Int      @default(3)
  pelvicPain         Boolean  @default(false)
  pelvicPainSeverity Int      @default(0)
  cravingsIntensity  Int      @default(0)
  discomfortAreas    String[] @default([])
  notes              String?
  createdAt          DateTime @default(now())

  @@unique([userId, logDate])
}

model Insight {
  id                 String    @id @default(cuid())
  userId             String
  user               User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  awarenessLevel     String
  reasoningSummary   String
  symptomImpacts     Json
  correlations       String[]
  redFlags           String[]
  doctorNudge        Boolean   @default(false)
  doctorNudgeReason  String?
  weeklyTrendSummary String?
  logCountAnalyzed   Int
  dateRangeStart     DateTime?
  dateRangeEnd       DateTime?
  createdAt          DateTime  @default(now())
}

model LogTemplate {
  id                 String   @id @default(cuid())
  userId             String
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  templateName       String
  cycleStarted       Boolean  @default(false)
  cycleEnded         Boolean  @default(false)
  acneSeverity       Int      @default(0)
  facialHairGrowth   Boolean  @default(false)
  hairThinning       Boolean  @default(false)
  weightChange       String   @default("unknown")
  mood               Int      @default(3)
  sleepQuality       Int      @default(3)
  pelvicPain         Boolean  @default(false)
  pelvicPainSeverity Int      @default(0)
  cravingsIntensity  Int      @default(0)
  discomfortAreas    String[] @default([])
  createdAt          DateTime @default(now())
}
```

### 2.4 REST API Endpoints

All routes under `/api`. All except auth routes require a valid JWT (`Authorization: Bearer <token>`).

The frontend service layer in `src/services/` already calls these exact paths.

#### Auth — `/api/auth`
```
POST /api/auth/register           { email, password } → 201 { message }
POST /api/auth/verify-otp         { email, otpCode } → 200 { token }
POST /api/auth/resend-otp         { email } → 200 { message }
POST /api/auth/login              { email, password } → 200 { token, user }
POST /api/auth/forgot-password    { email } → 200 { message }
POST /api/auth/reset-password     { resetToken, newPassword } → 200 { message }
GET  /api/auth/me                 → 200 { id, email }
GET  /api/auth/google             → redirect to Google OAuth
GET  /api/auth/google/callback    → sets token, redirects to /
```

#### Symptom Logs — `/api/symptom-logs`
```
GET    /api/symptom-logs              ?limit=200&sort=-logDate → SymptomLog[]
GET    /api/symptom-logs/:date        → SymptomLog | 404
POST   /api/symptom-logs             { ...fields } → 201 SymptomLog
PUT    /api/symptom-logs/:id         { ...fields } → 200 SymptomLog
DELETE /api/symptom-logs/:id         → 204
DELETE /api/symptom-logs             → 204 (delete all for user)
```

#### User Profile — `/api/user-profile`
```
GET    /api/user-profile   → 200 UserProfile | 404
POST   /api/user-profile   { ...fields } → 201 UserProfile
PUT    /api/user-profile   { ...fields } → 200 UserProfile
DELETE /api/user-profile   → 204
```

#### Insights — `/api/insights`
```
GET    /api/insights   ?limit=1&sort=-createdAt → Insight[]
POST   /api/insights   { ...fields } → 201 Insight  (save pre-generated)
DELETE /api/insights   → 204 (delete all for user)
```

#### Log Templates — `/api/log-templates`
```
GET    /api/log-templates       → LogTemplate[]
POST   /api/log-templates       { ...fields } → 201 LogTemplate
PUT    /api/log-templates/:id   { ...fields } → 200 LogTemplate
DELETE /api/log-templates/:id   → 204
```

#### AI — `/api/ai`
```
POST /api/ai/insights                { } → 200 Insight  (generate + save)
POST /api/ai/summary/doctor-report   { period: 30|60|90 } → 200 { summary: string }
```

### 2.5 Tasks for Phase 2

1. `mkdir backend` and run `npm init -y` inside it
2. Install all backend dependencies listed above
3. Create `backend/tsconfig.json`
4. Create `backend/prisma/schema.prisma` with the schema above
5. Run `npx prisma migrate dev --name init`
6. Create `backend/src/db/client.ts` — Prisma client singleton
7. Create `backend/src/middleware/auth.ts` — JWT verification
8. Create `backend/src/middleware/validate.ts` — Zod validation helper
9. Create `backend/src/routes/auth.ts` — all auth endpoints
10. Create `backend/src/routes/symptomLogs.ts`
11. Create `backend/src/routes/userProfile.ts`
12. Create `backend/src/routes/insights.ts`
13. Create `backend/src/routes/logTemplates.ts`
14. Create `backend/src/index.ts` — Express entry point wiring all routes
15. Create `backend/.env` with `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`

---

## Phase 3 — AI Integration

### 3.1 Pure Computation (no LLM)

Port these three functions from `src/lib/insightEngine.js` to `backend/src/services/insightCompute.ts`:
- `computeIndicators(logs, profile)` — cycle stats, symptom averages
- `checkRedFlags(logs, profile)` — 3 rule-based red-flag checks
- `computeWeeklyComparison(logs)` — week-over-week trend text

These are already correct and well-tested. Just add TypeScript types.

### 3.2 LLM Service

Create `backend/src/services/llm.ts` — single function:
```ts
callLLM(prompt: string, schema: object): Promise<object>
```

Recommended provider: **AWS Bedrock (Claude 3 Haiku or Sonnet)** via `@aws-sdk/client-bedrock-runtime`.
Fallback option: OpenAI `gpt-4o-mini` via `openai` npm package.

### 3.3 POST /api/ai/insights

Server-side flow:
1. Fetch last 200 `SymptomLog` records for `req.userId`
2. Fetch `UserProfile` for `req.userId`
3. Run `computeIndicators(logs, profile)`
4. Run `checkRedFlags(logs, profile)`
5. Run `computeWeeklyComparison(logs)`
6. Build the existing prompt (copy verbatim from `src/lib/insightEngine.js` — it is well-designed)
7. Call `llm.ts` service
8. Post-process: enforce `reasoning_summary` prefix, apply red-flag override on `doctor_nudge`
9. Save result to `Insight` table
10. Return saved insight

Frontend consumer: `src/pages/Insights.jsx` → `insightService.generate()`

### 3.4 POST /api/ai/summary/doctor-report

Input: `{ period: 30 | 60 | 90 }`

Server-side flow:
1. Fetch logs for the period for `req.userId`
2. Compute the same stats as `DoctorReport.jsx` does client-side
3. Build a safe, non-diagnostic prompt summarising the data
4. Call LLM
5. Return `{ summary: string }`

Frontend consumer: `src/pages/DoctorReport.jsx` — add a "Generate AI Summary" button

### 3.5 AI Prompt Safety Rules (must be enforced in every prompt)

- Never use words: "diagnose", "diagnosis", "you have PCOS", or any clinical determination
- Always frame as: "patterns in your tracked data worth discussing with a doctor"
- Tone: warm, supportive, non-judgmental
- All text must use confidence-appropriate phrasing — observations, not definitive statements
- `reasoning_summary` must always start with "Based on patterns in your logs..." or "Your data suggests..."

### 3.6 Tasks for Phase 3

1. Create `backend/src/services/insightCompute.ts` — port pure functions with TS types
2. Create `backend/src/services/llm.ts` — Bedrock or OpenAI wrapper
3. Create `backend/src/routes/ai.ts` — `POST /api/ai/insights` and `POST /api/ai/summary/doctor-report`
4. Wire `ai.ts` into `backend/src/index.ts`
5. Update `src/pages/DoctorReport.jsx` to add the AI summary button calling `POST /api/ai/summary/doctor-report`

---

## Phase 4 — Cleanup + TypeScript + React Query

### 4.1 Remove Dead Dependencies (frontend)

Verify none are used, then remove from `package.json`:
- `@stripe/react-stripe-js`
- `@stripe/stripe-js`
- `react-leaflet`
- `react-quill`
- `three`

### 4.2 Convert to TypeScript

Convert progressively, starting with the service layer (already new files):
- `src/services/*.js` → `src/services/*.ts`
- `src/lib/AuthContext.jsx` → `.tsx`
- `src/lib/insightEngine.js` → `.ts`
- Pages and components last

### 4.3 Replace useEffect Data Fetching with React Query

TanStack Query is installed and configured but unused. Replace the raw `useEffect` + `await`
pattern in each page with `useQuery` hooks. Start with `Home.jsx` as the template pattern,
then apply to `Insights.jsx`, `History.jsx`, `DoctorReport.jsx`, `Log.jsx`.

Benefits: automatic caching, loading/error states, background refetch, no duplicate requests.

### 4.4 Replace window.location.href with navigate()

Files still using full-page redirects instead of React Router's `useNavigate()`:
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/pages/Onboarding.jsx`
- `src/lib/AuthContext.jsx`
- `src/pages/Profile.jsx`

### 4.5 Add Error Boundaries

Wrap the main route tree in a React `ErrorBoundary` component so unhandled errors show a
friendly UI instead of a blank screen.

### 4.6 Tasks for Phase 4

1. Remove dead dependencies from `package.json` and run `npm install`
2. Rename `src/services/*.js` to `.ts` and add types
3. Replace `useEffect` fetching in `Home.jsx` with `useQuery` — use as template
4. Apply same `useQuery` pattern to `Insights.jsx`, `History.jsx`, `DoctorReport.jsx`, `Log.jsx`
5. Replace `window.location.href` redirects with `useNavigate()` in all auth pages
6. Add a top-level `ErrorBoundary` component and wrap `<AuthenticatedApp />` in `App.jsx`
7. Convert remaining `.jsx`/`.js` files to `.tsx`/`.ts` progressively

---

## Environment Variables Reference

### Frontend (`/.env.local`)
```
VITE_API_BASE_URL=http://localhost:3001/api
```

### Backend (`/backend/.env`)
```
DATABASE_URL=postgresql://user:password@localhost:5432/femcare
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
PORT=3001

# Email (for OTP and password reset)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-smtp-password
EMAIL_FROM=noreply@femcare.ai

# LLM — choose one
# AWS Bedrock
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0

# OR OpenAI
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

---

## Key Design Decisions

- **Service layer pattern** — pages never call `apiClient` directly; they import from `src/services/`.
  This means swapping the backend in future is a one-file change per entity.
- **JWT in localStorage** — simple for a single-developer project. For production, consider
  httpOnly cookies to prevent XSS token theft.
- **AI on the backend only** — LLM calls never happen in the browser. The prompt, API key,
  and response post-processing all live server-side.
- **Non-diagnostic AI** — the prompt engineering enforces awareness framing. Red-flag detection
  is rule-based (no LLM) so it cannot be hallucinated away.
- **Prisma ORM** — chosen for type safety, migration management, and ease of use for a
  single developer. Can be swapped for raw SQL or another ORM later.
- **PostgreSQL** — matches the relational structure of the Base44 entities. Supports arrays
  natively (for `discomfortAreas`, `correlations`, etc.).
