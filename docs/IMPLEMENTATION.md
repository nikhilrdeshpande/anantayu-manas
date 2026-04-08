# Anantayu Manas Prakriti — Technical Implementation Plan

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 18 + Vite + TypeScript | Fast dev, modern tooling, no SSR needed for assessment flow |
| **Styling** | Tailwind CSS | Utility-first, matches design tokens, fast iteration |
| **Routing** | React Router v6 | Client-side routing with locale prefix support |
| **State** | Zustand | Lightweight, perfect for wizard/assessment flow state |
| **i18n** | react-i18next | Mature, supports namespaced JSON translations |
| **Charts** | Recharts | React-native charting for guna visualization |
| **Share** | html2canvas | Generate shareable card images from DOM |
| **Backend** | Python FastAPI | Async, fast, great for API + AI integration |
| **ORM** | SQLAlchemy (async) | Mature, async support with asyncpg |
| **Migrations** | Alembic | Standard for SQLAlchemy projects |
| **Database** | PostgreSQL | Relational data, JSONB for flexible AI insights storage |
| **AI** | Anthropic Claude API | Haiku for quick insights, Sonnet for deep reports |
| **Auth** | JWT (PyJWT) | Stateless auth, anonymous session tokens |

---

## Project Structure

```
/Users/nikhil/Desktop/Code/manas/
│
├── docs/
│   ├── PRD.md                          # Product Requirements
│   ├── DESIGN.md                       # Design Specifications
│   └── IMPLEMENTATION.md               # This file
│
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── index.html
│   │
│   ├── public/
│   │   ├── locales/
│   │   │   ├── en/
│   │   │   │   ├── common.json         # Nav, buttons, generic labels
│   │   │   │   ├── assessment.json     # Questions, section names, instructions
│   │   │   │   └── results.json        # Prakriti names, descriptions, traits
│   │   │   ├── hi/
│   │   │   │   ├── common.json
│   │   │   │   ├── assessment.json
│   │   │   │   └── results.json
│   │   │   └── mr/
│   │   │       ├── common.json
│   │   │       ├── assessment.json
│   │   │       └── results.json
│   │   └── images/
│   │       └── logo.svg
│   │
│   └── src/
│       ├── main.tsx                     # App entry, i18n init
│       ├── App.tsx                      # Root with router
│       ├── router.tsx                   # React Router config with /:locale prefix
│       │
│       ├── components/
│       │   ├── ui/                      # Base design system
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── ProgressBar.tsx
│       │   │   ├── Badge.tsx
│       │   │   └── Spinner.tsx
│       │   │
│       │   ├── layout/
│       │   │   ├── Header.tsx           # Logo + language switcher
│       │   │   ├── Footer.tsx
│       │   │   ├── LanguageSwitcher.tsx  # EN | HI | MR pill toggle
│       │   │   └── PageLayout.tsx       # Max-width wrapper
│       │   │
│       │   ├── landing/
│       │   │   ├── Hero.tsx             # Dark bg hero with CTA
│       │   │   ├── HowItWorks.tsx       # 3-step cards
│       │   │   └── GunaPreview.tsx      # Sattva/Rajas/Tamas explainer
│       │   │
│       │   ├── assessment/
│       │   │   ├── QuestionCard.tsx      # Single question display
│       │   │   ├── AnswerSelector.tsx    # YES / NO / SOMETIMES buttons
│       │   │   ├── SectionProgress.tsx   # 3-segment progress bar
│       │   │   ├── SectionTransition.tsx # Interstitial between sections
│       │   │   ├── AssessmentTopBar.tsx  # Back, section label, counter
│       │   │   └── ProcessingScreen.tsx  # Breathing animation loader
│       │   │
│       │   └── results/
│       │       ├── PrakritiCard.tsx      # THE shareable dark card
│       │       ├── GunaChart.tsx         # Radial/donut chart
│       │       ├── GunaBar.tsx           # Single horizontal percentage bar
│       │       ├── ShareButtons.tsx      # WhatsApp, Instagram, X, Copy
│       │       ├── DetailedReport.tsx    # Full scrollable report
│       │       ├── StrengthsSection.tsx  # Top 3 strengths
│       │       ├── GrowthSection.tsx     # Areas for growth
│       │       ├── PracticesSection.tsx  # Daily Ayurvedic practices
│       │       ├── AIInsights.tsx        # Streamed AI text
│       │       └── DeepAssessmentCTA.tsx # Unlock deep assessment
│       │
│       ├── pages/
│       │   ├── Landing.tsx
│       │   ├── AssessmentIntro.tsx
│       │   ├── Assessment.tsx           # Main assessment flow
│       │   ├── Results.tsx              # Card + detailed report
│       │   └── DeepAssessment.tsx       # 80-question flow
│       │
│       ├── stores/
│       │   └── assessment-store.ts      # Zustand store
│       │
│       ├── lib/
│       │   ├── api.ts                   # Typed API client (fetch wrapper)
│       │   ├── i18n.ts                  # react-i18next config
│       │   ├── share.ts                 # Social sharing utilities
│       │   └── constants.ts             # Guna colors, section config
│       │
│       ├── hooks/
│       │   ├── useAssessment.ts         # Assessment flow logic
│       │   ├── useStreamingInsights.ts  # SSE/streaming AI response
│       │   └── useLocale.ts             # Current locale helper
│       │
│       └── types/
│           ├── assessment.ts            # Question, Answer, Assessment types
│           └── results.ts               # Result, PrakritiType, GunaScore types
│
├── backend/
│   ├── pyproject.toml                   # uv/poetry project config
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/                    # Migration files
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                      # FastAPI app, CORS, lifespan
│   │   ├── config.py                    # pydantic-settings config
│   │   ├── database.py                  # async SQLAlchemy engine + session
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py                  # User model
│   │   │   ├── question.py              # Question model
│   │   │   ├── assessment.py            # Assessment + Answer models
│   │   │   └── result.py                # Result model
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py                  # Register/Login request/response
│   │   │   ├── assessment.py            # Create assessment, submit answers
│   │   │   └── result.py                # Result response
│   │   │
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py                  # get_db, get_current_user dependencies
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── router.py            # Main API router
│   │   │       ├── auth.py              # register, login, anonymous-session
│   │   │       ├── questions.py         # GET questions
│   │   │       ├── assessments.py       # CRUD + submit
│   │   │       └── results.py           # GET result + AI insights stream
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── scoring_engine.py        # Core scoring algorithm
│   │   │   ├── prakriti_classifier.py   # 7 types + 16 sub-types
│   │   │   ├── ai_insights.py           # Claude API integration
│   │   │   └── auth_service.py          # JWT, password hashing
│   │   │
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── security.py              # JWT encode/decode, password utils
│   │   │   └── exceptions.py            # Custom HTTP exceptions
│   │   │
│   │   └── data/
│   │       ├── questions_quick_en.json  # 25 curated questions (English)
│   │       ├── questions_full_en.json   # 80 questions (English)
│   │       ├── questions_quick_hi.json  # 25 curated questions (Hindi)
│   │       ├── questions_quick_mr.json  # 25 curated questions (Marathi)
│   │       ├── questions_full_hi.json   # 80 questions (Hindi)
│   │       ├── questions_full_mr.json   # 80 questions (Marathi)
│   │       ├── prakriti_types.json      # 7 type descriptions (3 languages)
│   │       └── svabhava_profiles.json   # 16 sub-type profiles + anuka data
│   │
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py                  # Test DB setup, fixtures
│       ├── test_scoring_engine.py       # Scoring algorithm unit tests
│       ├── test_prakriti_classifier.py  # Classification unit tests
│       └── test_api.py                  # API endpoint integration tests
│
├── docker-compose.yml                   # PostgreSQL service
├── .env.example                         # All config vars documented
├── .gitignore
└── README.md
```

---

## Database Schema

### Table: `users`
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,              -- nullable for anonymous
    name VARCHAR(255),                       -- nullable
    password_hash VARCHAR(255),              -- nullable (anonymous users)
    preferred_locale VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: `questions`
```sql
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    assessment_type VARCHAR(10) NOT NULL,    -- 'quick' or 'deep'
    section VARCHAR(10) NOT NULL,            -- 'sattva', 'rajas', 'tamas'
    question_number INT NOT NULL,            -- order within section
    text_en TEXT NOT NULL,
    text_hi TEXT,
    text_mr TEXT,
    bhava_tag VARCHAR(100) NOT NULL,         -- e.g., 'satya', 'krodha', 'nidra'
    bhava_description_en VARCHAR(255),       -- e.g., 'truthfulness'
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (assessment_type, section, question_number)
);
```

### Table: `assessments`
```sql
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),       -- nullable for anonymous
    session_token VARCHAR(255) NOT NULL,      -- anonymous tracking
    assessment_type VARCHAR(10) NOT NULL,     -- 'quick' or 'deep'
    locale VARCHAR(5) DEFAULT 'en',
    status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, completed, expired
    started_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_assessments_session ON assessments(session_token);
CREATE INDEX idx_assessments_user ON assessments(user_id);
```

### Table: `answers`
```sql
CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_id INT NOT NULL REFERENCES questions(id),
    answer VARCHAR(10) NOT NULL,              -- 'yes', 'no', 'sometimes'
    answered_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (assessment_id, question_id)
);
```

### Table: `results`
```sql
CREATE TABLE results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL UNIQUE REFERENCES assessments(id),

    -- Raw counts
    sattva_yes INT NOT NULL,
    sattva_no INT NOT NULL,
    sattva_sometimes INT NOT NULL,
    rajas_yes INT NOT NULL,
    rajas_no INT NOT NULL,
    rajas_sometimes INT NOT NULL,
    tamas_yes INT NOT NULL,
    tamas_no INT NOT NULL,
    tamas_sometimes INT NOT NULL,

    -- Primary percentages (before SOMETIMES conversion)
    sattva_primary_pct DECIMAL(5,2) NOT NULL,
    rajas_primary_pct DECIMAL(5,2) NOT NULL,
    tamas_primary_pct DECIMAL(5,2) NOT NULL,

    -- Secondary percentages (after SOMETIMES conversion)
    sattva_secondary_pct DECIMAL(5,2) NOT NULL,
    rajas_secondary_pct DECIMAL(5,2) NOT NULL,
    tamas_secondary_pct DECIMAL(5,2) NOT NULL,

    -- Classification
    primary_dominant_guna VARCHAR(20) NOT NULL,   -- 'sattva', 'rajas', 'tamas'
    secondary_dominant_guna VARCHAR(20),           -- nullable
    prakriti_type VARCHAR(50) NOT NULL,            -- e.g., 'sattvika-rajasika'
    prakriti_subtype VARCHAR(50),                  -- e.g., 'brahma_kaya' (deep only)
    archetype_title VARCHAR(100),                  -- e.g., 'The Wise Leader'
    sattva_bala VARCHAR(20) NOT NULL,             -- 'pravara', 'madhya', 'avara'

    -- AI insights (cached)
    ai_insights JSONB,                            -- {locale: {strengths, growth, practices, insight}}
    ai_generated_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: `svabhava_profiles` (reference/seed data)
```sql
CREATE TABLE svabhava_profiles (
    id SERIAL PRIMARY KEY,
    prakriti_type VARCHAR(50) NOT NULL,        -- e.g., 'sattvika-rajasika'
    prakriti_subtype VARCHAR(50),              -- e.g., 'brahma_kaya'
    archetype_title_en VARCHAR(100),
    archetype_title_hi VARCHAR(100),
    archetype_title_mr VARCHAR(100),
    description_en TEXT,
    description_hi TEXT,
    description_mr TEXT,
    strengths JSONB,                          -- [{title, description} x3]
    growth_areas JSONB,                       -- [{title, description} x3]
    daily_practices JSONB,                    -- [{title, description} x3]
    trait_summary VARCHAR(255),               -- 'Calm . Driven . Thoughtful'
    animal_archetype VARCHAR(100),            -- 'elephant', 'tiger', etc.
    anuka_data JSONB                          -- Full anuka table from thesis
);
```

---

## API Endpoints

### Authentication
```
POST   /api/v1/auth/anonymous-session
  → Creates session_token, returns { session_token }
  → No body required

POST   /api/v1/auth/register
  → Body: { email, password, name?, locale? }
  → Returns: { user_id, token }

POST   /api/v1/auth/login
  → Body: { email, password }
  → Returns: { user_id, token }
```

### Questions
```
GET    /api/v1/questions?type=quick&locale=en
  → Returns: [{ id, section, question_number, text, bhava_tag, bhava_description }]
  → Selects appropriate language column based on locale param
  → type: 'quick' (25 Qs) or 'deep' (80 Qs)
```

### Assessments
```
POST   /api/v1/assessments
  → Body: { type: 'quick'|'deep', session_token?, locale? }
  → Auth: JWT or session_token
  → Returns: { assessment_id, status: 'in_progress' }

GET    /api/v1/assessments/:id
  → Returns: { assessment, answers[] }

POST   /api/v1/assessments/:id/answers
  → Body: { answers: [{ question_id, answer: 'yes'|'no'|'sometimes' }] }
  → Batch submit (upsert — allows re-answering)
  → Returns: { saved_count }

POST   /api/v1/assessments/:id/submit
  → Validates all questions answered
  → Runs scoring engine + prakriti classifier
  → Stores result
  → Returns: { result_id, redirect_to: '/results/:id' }
```

### Results
```
GET    /api/v1/results/:assessment_id
  → Returns full result object (scores, percentages, classification, svabhava profile)

GET    /api/v1/results/:assessment_id/insights?locale=en
  → Streams AI-generated insights via SSE (Server-Sent Events)
  → If cached (ai_insights JSONB has entry for locale), returns cached
  → If not cached, generates via Claude API and streams
  → Content-Type: text/event-stream

GET    /api/v1/results/:assessment_id/share
  → Returns OG metadata for link previews
  → { title, description, image_url, url }
```

### User History
```
GET    /api/v1/users/me/assessments
  → Auth: JWT required
  → Returns: [{ assessment_id, type, status, prakriti_type, created_at }]
```

---

## Scoring Engine — Implementation Detail

File: `backend/app/services/scoring_engine.py`

```python
# Pseudocode for the core algorithm

class ScoringEngine:

    # SOMETIMES conversion ratios (from thesis)
    DORMANT_YES_RATIO = 0.33    # Sattva & Tamas
    DORMANT_NO_RATIO = 0.67
    ACTIVE_YES_RATIO = 0.67     # Rajas (hyperactive nature)
    ACTIVE_NO_RATIO = 0.33

    def score(self, answers: list[Answer], assessment_type: str) -> ScoringResult:
        # Step 1: Count raw answers per section
        counts = self._count_by_section(answers)

        # Step 2: Calculate primary percentages
        primary = self._calc_primary_percentages(counts, assessment_type)

        # Step 3: Convert SOMETIMES and recalculate
        secondary = self._convert_sometimes(counts, assessment_type)

        # Step 4: Determine dominant gunas
        dominant = self._find_dominant_gunas(secondary)

        # Step 5: Classify prakriti type
        prakriti = self._classify_prakriti(dominant)

        # Step 6: Determine sattva bala
        sattva_bala = self._calc_sattva_bala(secondary.sattva_pct)

        # Step 7: (Deep only) Sub-type classification
        subtype = None
        if assessment_type == 'deep':
            subtype = self._classify_subtype(answers, dominant)

        return ScoringResult(...)

    def _convert_sometimes(self, counts, assessment_type):
        section_totals = {'sattva': 10, 'rajas': 10, 'tamas': 5}
        if assessment_type == 'deep':
            section_totals = {'sattva': 30, 'rajas': 30, 'tamas': 20}

        for section in ['sattva', 'rajas', 'tamas']:
            sometimes = counts[section].sometimes
            if section == 'rajas':
                yes_add = floor(sometimes * ACTIVE_YES_RATIO)
                no_add = ceil(sometimes * ACTIVE_NO_RATIO)
            else:  # sattva, tamas
                yes_add = floor(sometimes * DORMANT_YES_RATIO)
                no_add = ceil(sometimes * DORMANT_NO_RATIO)

            converted_yes = counts[section].yes + yes_add
            converted_no = counts[section].no + no_add
            pct = (converted_yes / section_totals[section]) * 100

        # Return secondary percentages

    def _classify_prakriti(self, dominant):
        if only primary dominant:
            return 'sattvika' / 'rajasika' / 'tamasika'
        if two dominant:
            return '{primary}-{secondary}' (e.g., 'sattvika-rajasika')
        if all three:
            return 'sannipatika'

    def _calc_sattva_bala(self, sattva_pct):
        if sattva_pct >= 66: return 'pravara'
        if sattva_pct >= 33: return 'madhya'
        return 'avara'
```

---

## AI Insights Integration

File: `backend/app/services/ai_insights.py`

**Model selection:**
- Quick Assessment insights: `claude-haiku-4-5` (fast, cheap)
- Deep Assessment report: `claude-sonnet-4-5` (more detailed)

**Prompt template:**
```
You are an Ayurvedic wellness counselor for the Anantayu platform.

Given this Manas Prakriti assessment result:
- Primary Guna: {dominant_guna}
- Prakriti Type: {prakriti_type} ({archetype_title})
- Sattva: {sattva_pct}%, Rajas: {rajas_pct}%, Tamas: {tamas_pct}%
- Sattva Bala (mental strength): {sattva_bala}
- Key characteristics observed: {top_bhavas}

Provide a personalized wellness insight in {locale} language:
1. A warm, 2-sentence explanation of what this means for the person
2. One specific daily practice recommendation
3. One encouraging thought about their natural strengths

Keep tone warm, non-judgmental, empowering. Use simple language.
Do not use Sanskrit terms unless explaining them.
Keep total response under 150 words.
```

**Streaming**: Use FastAPI `StreamingResponse` with `text/event-stream` content type. Frontend consumes via `EventSource` API.

**Caching**: Store generated insights in `results.ai_insights` JSONB, keyed by locale. Subsequent requests for same assessment + locale return cached version.

---

## Frontend State Management

File: `frontend/src/stores/assessment-store.ts`

```typescript
interface AssessmentState {
  // Assessment metadata
  assessmentId: string | null;
  assessmentType: 'quick' | 'deep';
  locale: string;

  // Progress tracking
  currentSection: 'sattva' | 'rajas' | 'tamas';
  currentQuestionIndex: number;  // 0-based within current section
  totalQuestionsAnswered: number;

  // Answers (persisted to localStorage)
  answers: Record<number, 'yes' | 'no' | 'sometimes'>;  // questionId -> answer

  // Actions
  startAssessment: (type: 'quick' | 'deep') => Promise<void>;
  setAnswer: (questionId: number, answer: Answer) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitAssessment: () => Promise<ResultId>;
  reset: () => void;
}
```

**Persistence**: Zustand `persist` middleware with localStorage. If user refreshes mid-quiz, they resume where they left off.

---

## i18n Architecture

**Frontend**: react-i18next with JSON translation files

```json
// public/locales/en/assessment.json
{
  "intro": {
    "title": "About This Assessment",
    "description": "You'll answer 25 questions about your natural tendencies...",
    "time_estimate": "Estimated time: 3 minutes",
    "begin": "Begin"
  },
  "sections": {
    "sattva": { "name": "Your Calm Nature", "transition": "Let's explore your calm, pure nature..." },
    "rajas": { "name": "Your Active Nature", "transition": "Now, let's explore your active nature..." },
    "tamas": { "name": "Your Steady Nature", "transition": "Finally, let's understand your steady nature..." }
  },
  "answers": {
    "yes": "Yes",
    "no": "No",
    "sometimes": "Sometimes"
  }
}
```

**Backend**: Questions stored with `text_en`, `text_hi`, `text_mr` columns. API selects correct column based on `locale` query param. AI insights prompt specifies target language.

---

## Implementation Order

### Sprint 1 (Week 1-2): Foundation

| # | Task | Output |
|---|------|--------|
| 1 | Initialize frontend: Vite + React + TS + Tailwind + React Router | Working dev server |
| 2 | Initialize backend: FastAPI + SQLAlchemy + Alembic | Working API server |
| 3 | Set up docker-compose.yml for PostgreSQL | Local DB running |
| 4 | Create all Alembic migrations | All tables created |
| 5 | Create seed data: 25 quick questions (English) | Questions in DB |
| 6 | Implement `scoring_engine.py` with unit tests | Tested algorithm |
| 7 | Implement `prakriti_classifier.py` with unit tests | Tested classification |

### Sprint 2 (Week 3-4): Assessment Flow

| # | Task | Output |
|---|------|--------|
| 8 | Build Questions API endpoint | GET /questions working |
| 9 | Build Assessment CRUD + Submit endpoints | Full assessment API |
| 10 | Build frontend: Landing page (Hero + HowItWorks) | Landing page live |
| 11 | Build frontend: AssessmentIntro page | Intro screen |
| 12 | Build frontend: QuestionCard + AnswerSelector + SectionProgress | Quiz flow working |
| 13 | Build frontend: SectionTransition + ProcessingScreen | Transitions |
| 14 | Wire Zustand store to API | End-to-end assessment |

### Sprint 3 (Week 5-6): Results & AI

| # | Task | Output |
|---|------|--------|
| 15 | Build Results API endpoint | GET /results working |
| 16 | Build frontend: PrakritiCard (the shareable dark card) | Card rendering |
| 17 | Build frontend: GunaChart (radial) + GunaBar components | Charts working |
| 18 | Build frontend: DetailedReport sections | Full report page |
| 19 | Implement AI insights service with Claude API | Streaming insights |
| 20 | Build frontend: AIInsights with streaming display | AI text rendering |
| 21 | Implement ShareButtons + html2canvas card generation | Sharing working |
| 22 | Seed svabhava_profiles table | Profile data ready |

### Sprint 4 (Week 7-8): i18n, Deep Assessment, Auth

| # | Task | Output |
|---|------|--------|
| 23 | Set up react-i18next + translation files | i18n framework ready |
| 24 | Translate 25 questions to Hindi + Marathi | Multilingual questions |
| 25 | Translate all UI strings to Hindi + Marathi | Full i18n |
| 26 | Translate prakriti descriptions + svabhava profiles | Multilingual results |
| 27 | Seed full 80 questions (English + Hindi + Marathi) | Deep questions ready |
| 28 | Build Deep Assessment flow (reuse components, longer) | 80-Q flow working |
| 29 | Implement sub-type classification | 16 sub-types working |
| 30 | Build auth (anonymous session + JWT register/login) | Auth working |

### Sprint 5 (Week 9-10): Polish & Deploy

| # | Task | Output |
|---|------|--------|
| 31 | Mobile responsive testing + fixes | Mobile-perfect |
| 32 | Animation polish (transitions, charts, loading) | Smooth UX |
| 33 | Error handling, loading states, edge cases | Robust app |
| 34 | OG meta tags + social share previews | Links look good |
| 35 | Deploy backend (Railway or Fly.io) | API live |
| 36 | Deploy frontend (Vercel) | App live |
| 37 | Set up monitoring (Sentry) + analytics (PostHog) | Observability |

---

## Environment Variables

```env
# Backend
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/manas
SECRET_KEY=your-jwt-secret
ANTHROPIC_API_KEY=sk-ant-...
CORS_ORIGINS=http://localhost:5173,https://prakriti.anantayu.com

# Frontend
VITE_API_URL=http://localhost:8000
VITE_APP_URL=http://localhost:5173
```

---

## Testing Strategy

| Type | Tool | Coverage |
|------|------|----------|
| **Scoring algorithm** | pytest | All 7 prakriti types, edge cases, SOMETIMES conversion |
| **API endpoints** | pytest + httpx | All CRUD operations, auth flows, validation |
| **Frontend components** | Vitest + React Testing Library | QuestionCard, AnswerSelector, result components |
| **E2E** | Playwright or Claude Preview tools | Full assessment flow, share card generation |

### Key test cases for scoring engine:
1. All YES in Sattva → Sattvika prakriti, Pravara sattva bala
2. All YES in Rajas → Rajasika prakriti
3. Mixed YES across Sattva + Rajas → Sattvika-Rajasika
4. All SOMETIMES → verify conversion produces expected percentages
5. Edge case: equal percentages across two sections
6. Deep assessment: verify sub-type classification for known bhava patterns
