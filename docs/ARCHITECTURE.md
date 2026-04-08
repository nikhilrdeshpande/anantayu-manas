# Manas Prakriti -- Technical Architecture

## System Overview

Manas Prakriti is an Ayurvedic mental constitution assessment platform. The system is composed of three layers:

```
React + Vite SPA  <-->  FastAPI Backend  <-->  PostgreSQL
     |                       |
     |                  Multi-LLM Layer
     |              (Anthropic / Gemini / OpenAI)
     |
Client-side fallback scoring
```

- **Frontend**: React 19 with Vite 8, TailwindCSS 4, Zustand for state, react-router-dom v7, react-i18next for localization (EN/HI/MR).
- **Backend**: FastAPI (async), SQLAlchemy 2.0 with asyncpg, Alembic for migrations, Pydantic v2 for validation.
- **Database**: PostgreSQL (async via asyncpg).
- **Multi-LLM Layer**: Anthropic Claude Haiku 4.5, Google Gemini 2.0 Flash, OpenAI GPT-4o Mini -- selectable via env var with automatic fallback.
- **Client-side fallback**: The frontend contains an identical copy of the scoring algorithm so that if the backend is unreachable, users still receive their results.

---

## Data Flow

### End-to-End Journey

1. **User lands on the app** at `/` or `/:locale`. The landing page introduces Manas Prakriti.

2. **Optional signup/login**: Users can register (`POST /api/v1/auth/register`) or log in (`POST /api/v1/auth/login`). Authentication uses JWT tokens (HS256, 7-day expiry) stored in localStorage. Anonymous users can still take the assessment.

3. **Pre-quiz demographics**: Before the quiz begins, the user is prompted for demographics -- age, gender, diet, work nature, and sleep quality. These are stored in the Zustand assessment store.

4. **25-question assessment flow**: Questions are loaded from a static JSON file (frontend) or fetched from `GET /api/v1/questions?type=quick&locale=en`. The quiz has three sections: Sattva (10 questions), Rajas (10 questions), Tamas (5 questions). Answers are auto-saved to localStorage on every answer and to the backend every 5 answers (for logged-in users via `POST /api/v1/assessments/save-progress`).

5. **On completion**: All answers plus demographics are sent to the backend via `POST /api/v1/assessments/submit`. The backend creates an Assessment record, saves all Answer records, runs the scoring engine, classifies the prakriti type, and stores the Result in PostgreSQL. If the backend is unreachable, the identical client-side scoring algorithm computes results locally.

6. **Result display**: The Results page shows the Guna chart (bar/radar visualization via Recharts), the PrakritiCard (type, archetype title, sattva bala grade), and a DetailedReport with raw counts and percentage breakdowns.

7. **AI insights**: Streamed from the selected LLM provider via `GET /api/v1/results/{assessment_id}/insights?locale=en`. The response is a `StreamingResponse` with `text/plain` media type. The frontend reads the stream and displays text as it arrives.

8. **History and resume**: For authenticated users, results are linked to their `user_id`. They can view history (`GET /api/v1/assessments/history/{user_id}`) and resume incomplete assessments (`GET /api/v1/assessments/resume/{user_id}`).

---

## Database Schema

### Entity-Relationship Description

```
users 1---* assessments 1---* answers
                |
                1---1 results
                |
questions *---* answers (via question_id FK)
```

### Table: `users`

| Column           | Type         | Constraints                    |
|------------------|--------------|--------------------------------|
| id               | UUID         | PK, default uuid4              |
| email            | VARCHAR(255) | UNIQUE, indexed                |
| name             | VARCHAR(255) | NOT NULL                       |
| password_hash    | VARCHAR(255) | NOT NULL                       |
| preferred_locale | VARCHAR(10)  | default 'en'                   |
| created_at       | TIMESTAMP    | server_default now()           |
| updated_at       | TIMESTAMP    | server_default now(), on update |

### Table: `questions`

| Column               | Type         | Constraints       |
|----------------------|--------------|-------------------|
| id                   | INTEGER      | PK, autoincrement |
| assessment_type      | VARCHAR(20)  | 'quick' or 'full' |
| section              | VARCHAR(20)  | 'sattva', 'rajas', 'tamas' |
| question_number      | INTEGER      | NOT NULL          |
| text_en              | TEXT         | NOT NULL          |
| text_hi              | TEXT         | nullable          |
| text_mr              | TEXT         | nullable          |
| bhava_tag            | VARCHAR(50)  | NOT NULL          |
| bhava_description_en | VARCHAR(255) | nullable          |

### Table: `assessments`

| Column          | Type         | Constraints                    |
|-----------------|--------------|--------------------------------|
| id              | UUID         | PK, default uuid4              |
| user_id         | UUID         | FK -> users.id, nullable       |
| session_token   | VARCHAR(255) | indexed, NOT NULL              |
| assessment_type | VARCHAR(20)  | 'quick' or 'full'             |
| locale          | VARCHAR(10)  | default 'en'                   |
| status          | VARCHAR(20)  | default 'in_progress'          |
| demographics    | JSONB        | nullable                       |
| started_at      | TIMESTAMP    | server_default now()           |
| completed_at    | TIMESTAMP    | nullable                       |

The `demographics` JSONB column stores:
```json
{
  "age": 28,
  "gender": "male",
  "diet": "vegetarian",
  "work_nature": "desk",
  "sleep_quality": "good"
}
```

### Table: `answers`

| Column        | Type    | Constraints               |
|---------------|---------|---------------------------|
| id            | INTEGER | PK, autoincrement         |
| assessment_id | UUID    | FK -> assessments.id      |
| question_id   | INTEGER | FK -> questions.id        |
| answer        | VARCHAR(20) | 'YES', 'NO', 'SOMETIMES' |
| answered_at   | TIMESTAMP   | server_default now()      |

### Table: `results`

| Column                 | Type          | Constraints                    |
|------------------------|---------------|--------------------------------|
| id                     | UUID          | PK, default uuid4              |
| assessment_id          | UUID          | FK -> assessments.id, UNIQUE   |
| sattva_yes             | INTEGER       | raw YES count for sattva       |
| sattva_no              | INTEGER       | raw NO count for sattva        |
| sattva_sometimes       | INTEGER       | raw SOMETIMES count            |
| rajas_yes              | INTEGER       | raw YES count for rajas        |
| rajas_no               | INTEGER       | raw NO count for rajas         |
| rajas_sometimes        | INTEGER       | raw SOMETIMES count            |
| tamas_yes              | INTEGER       | raw YES count for tamas        |
| tamas_no               | INTEGER       | raw NO count for tamas         |
| tamas_sometimes        | INTEGER       | raw SOMETIMES count            |
| sattva_primary_pct     | NUMERIC(5,2)  | YES/total before conversion    |
| rajas_primary_pct      | NUMERIC(5,2)  | YES/total before conversion    |
| tamas_primary_pct      | NUMERIC(5,2)  | YES/total before conversion    |
| sattva_secondary_pct   | NUMERIC(5,2)  | adjusted YES/total after SOMETIMES conversion |
| rajas_secondary_pct    | NUMERIC(5,2)  | adjusted YES/total after SOMETIMES conversion |
| tamas_secondary_pct    | NUMERIC(5,2)  | adjusted YES/total after SOMETIMES conversion |
| primary_dominant_guna  | VARCHAR(20)   | highest guna                   |
| secondary_dominant_guna| VARCHAR(20)   | nullable, second-highest       |
| prakriti_type          | VARCHAR(50)   | e.g. 'Sattvika', 'Sattva-Rajasika' |
| prakriti_subtype        | VARCHAR(50)   | nullable, for deep assessment  |
| archetype_title        | VARCHAR(100)  | e.g. 'The Harmoniser'         |
| sattva_bala            | VARCHAR(20)   | 'pravara', 'madhya', 'avara'  |
| ai_insights            | JSONB         | nullable, cached AI text keyed by locale |
| created_at             | TIMESTAMP     | server_default now()           |

---

## API Architecture

All endpoints are under `/api/v1`.

### Auth (`/api/v1/auth`)

| Method | Endpoint    | Description                     | Auth Required |
|--------|-------------|---------------------------------|---------------|
| POST   | /register   | Create account, return JWT+user | No            |
| POST   | /login      | Authenticate, return JWT+user   | No            |
| GET    | /me         | Get current user from JWT       | Yes (Bearer)  |

### Questions (`/api/v1/questions`)

| Method | Endpoint | Query Params        | Description                           |
|--------|----------|---------------------|---------------------------------------|
| GET    | /        | type=quick, locale=en | Get questions by assessment type and locale |

Questions are loaded from static JSON files on disk (`app/data/questions_{type}_{locale}.json`), falling back to English if the requested locale is unavailable.

### Assessments (`/api/v1/assessments`)

| Method | Endpoint             | Description                                        |
|--------|----------------------|----------------------------------------------------|
| POST   | /                    | Create a new assessment (step-by-step flow)        |
| POST   | /submit              | One-shot: create assessment + save answers + compute result |
| POST   | /save-progress       | Save partial answers for resume (logged-in users)  |
| GET    | /resume/{user_id}    | Get latest in-progress assessment to resume        |
| GET    | /history/{user_id}   | Get all completed assessments for a user           |
| GET    | /{assessment_id}     | Get assessment by ID                               |
| POST   | /{assessment_id}/answers | Submit answers for an existing assessment       |

### Results (`/api/v1/results`)

| Method | Endpoint                    | Description                              |
|--------|-----------------------------|------------------------------------------|
| POST   | /{assessment_id}            | Compute and store result for an assessment |
| GET    | /{assessment_id}            | Get stored result                        |
| GET    | /{assessment_id}/insights   | Stream AI-generated insights (SSE-like)  |

---

## Frontend Architecture

### Routing

React Router v7 with locale prefix pattern `/:locale/*`:

```
/                         -> Landing
/:locale                  -> Landing
/:locale/assessment/intro -> AssessmentIntro (pre-quiz info + demographics)
/:locale/assessment       -> Assessment (quiz flow)
/:locale/results/:id      -> Results (score display + AI insights)
/:locale/deep-assessment  -> DeepAssessment
/:locale/login            -> Login
/:locale/signup           -> SignUp
/:locale/profile          -> Profile
```

All routes use lazy loading with `React.lazy()` and a `Suspense` wrapper.

### State Management (Zustand)

**assessment-store.ts** -- The primary store managing the quiz lifecycle:
- State: `assessmentId`, `assessmentType`, `questions`, `currentQuestionIndex`, `answers` (Record<id, value>), `phase` (idle/intro/quiz/transition/processing/complete), `scoringResult`, `serverResult`, `demographics`.
- Computed: `currentSection()`, `currentSectionIndex()`, `totalAnswered()`, `sectionProgress()`.
- Actions: `loadQuestions()`, `setAnswer()`, `nextQuestion()`, `previousQuestion()`, `computeResults()`, `submitToBackend()`, `saveProgress()`, `loadSavedProgress()`, `reset()`, `setDemographics()`.
- Auto-save: Every 5 answers, `saveProgress()` is called for logged-in users.
- localStorage persistence: Answers are saved/loaded from `manas_assessment_answers`. Results cached in `manas_scoring_result` and `manas_server_result`.

**auth-store.ts** -- Authentication state:
- State: `user`, `token`, `isAuthenticated`, `isLoading`.
- Actions: `login()`, `register()`, `logout()`, `loadFromStorage()`.
- Tokens stored in `manas_token`, user object in `manas_user` in localStorage.

### Component Hierarchy

```
Pages
  Landing
  AssessmentIntro -> DemographicsForm
  Assessment -> AssessmentTopBar, QuestionCard, SectionTransition, ProcessingScreen
  Results -> PrakritiCard, GunaChart, DetailedReport, AIInsights, ShareButtons
  Profile
  Login / SignUp

Components
  assessment/
    AnswerSelector     -- YES / NO / SOMETIMES pill buttons
    AssessmentTopBar   -- progress bar and section indicator
    ProcessingScreen   -- animated loading while scoring
    QuestionCard       -- displays current question with answer buttons
    SectionProgress    -- per-section completion indicator
    SectionTransition  -- full-screen transition between guna sections
    DemographicsForm   -- pre-quiz demographics collection form

  results/
    AIInsights         -- streams and displays AI text
    DetailedReport     -- breakdown of raw counts and percentages
    GunaBar            -- horizontal bar per guna
    GunaChart          -- Recharts-based visualization
    PrakritiCard       -- main result card with type, archetype, bala
    ShareButtons       -- social sharing

  ui/
    Button, Card, ProgressBar

  layout/
    PageLayout         -- common wrapper with header/footer
```

### Internationalization

react-i18next with:
- `i18next-browser-languagedetector` for auto-detection
- `i18next-http-backend` for loading translations
- Supported locales: EN, HI, MR (Marathi)
- Questions available in all three languages via separate JSON files

---

## Auth Flow

### Anonymous Users
- Can take the full quiz without creating an account.
- Results are stored with a `session_token` (random UUID) instead of `user_id`.
- Client-side scoring works as fallback if backend is down.
- No history or resume capability.

### Registered Users
- JWT token (HS256) stored in localStorage.
- Token contains `sub` (user_id as string) and `exp` (7-day expiry, configured via `ACCESS_TOKEN_EXPIRE_MINUTES`).
- Results linked to `user_id` in the assessments table.
- Progress auto-saved every 5 answers to the backend.
- Can resume incomplete assessments.
- Assessment history available via profile page.

### Token Format
```json
{
  "sub": "uuid-of-user",
  "exp": 1234567890
}
```
Signed with `SECRET_KEY` using HS256. Sent as `Bearer <token>` in the `Authorization` header.

---

## Multi-LLM Architecture

### Provider Selection

The `LLM_PROVIDER` environment variable selects the preferred provider:
- `"anthropic"` -> Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- `"gemini"` -> Gemini 2.0 Flash (`gemini-2.0-flash`)
- `"openai"` -> GPT-4o Mini (`gpt-4o-mini`)

### Auto-Fallback Chain

If the selected provider's API key is not set, the system automatically tries:
1. Selected provider (if key exists)
2. Anthropic (if `ANTHROPIC_API_KEY` is set)
3. Gemini (if `GEMINI_API_KEY` is set)
4. OpenAI (if `OPENAI_API_KEY` is set)
5. Hardcoded generic fallback text (no API call)

### Prompt Template

All providers receive the same prompt, which includes:
- Prakriti type and archetype
- Primary and secondary dominant gunas
- Sattva/Rajas/Tamas percentages
- Sattva Bala grade
- Locale (determines response language)
- Demographics (age, gender, diet, work nature, sleep quality) for personalized recommendations

The prompt asks for:
1. A warm 2-sentence explanation of the prakriti
2. One specific daily practice recommendation
3. One encouraging thought about natural strengths

### Streaming

All providers stream their response. The backend wraps the provider's async generator in a FastAPI `StreamingResponse` with `media_type="text/plain"`. The frontend reads the response body as a stream and renders text progressively.

---

## Deployment Architecture

### Frontend
- **Platform**: Vercel (static SPA deployment)
- **Build**: `tsc -b && vite build` produces a static `dist/` directory
- **Environment**: `VITE_API_URL` points to the backend

### Backend
- **Platform**: Railway or Fly.io (containerized FastAPI)
- **Entry**: `uvicorn app.main:app`
- **Migrations**: Alembic with async PostgreSQL support
- **CORS**: Configured via `CORS_ORIGINS` env var

### Database
- **Platform**: Managed PostgreSQL (Railway, Supabase, or Neon)
- **Connection**: `DATABASE_URL` env var with `postgresql+asyncpg://` scheme

### Environment Variables

| Variable                   | Description                          | Required |
|----------------------------|--------------------------------------|----------|
| DATABASE_URL               | PostgreSQL connection string         | Yes      |
| SECRET_KEY                 | JWT signing secret                   | Yes      |
| CORS_ORIGINS               | Allowed frontend origins (JSON list) | Yes      |
| LLM_PROVIDER               | Preferred LLM: anthropic/gemini/openai | No (default: anthropic) |
| ANTHROPIC_API_KEY          | Anthropic API key                    | No       |
| GEMINI_API_KEY             | Google Gemini API key                | No       |
| OPENAI_API_KEY             | OpenAI API key                       | No       |
| ACCESS_TOKEN_EXPIRE_MINUTES | JWT expiry in minutes              | No (default: 10080 = 7 days) |
| VITE_API_URL               | Backend URL for frontend             | Yes (frontend) |
