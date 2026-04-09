# Anantayu Manas Prakriti — Platform Plan

## Vision

Build the **definitive Ayurvedic mental health profiling and solutions platform** — a product where users discover their Manas Prakriti (mental constitution) and receive a comprehensive, personalized wellness report so valuable they pay for it and return monthly.

**Positioning**: The "23andMe of Ayurvedic mental wellness" — science-backed profiling meets personalized action plans.

---

## What We Have (Current State — 85% of Phase 1)

### Working End-to-End
- Landing page with Anantayu branding + Stitch-designed UI
- Auth system (JWT, register/login/profile/history)
- Demographics collection (age, gender, diet, work nature, sleep quality)
- 25-question Quick Assessment with section transitions + breathing animations
- Scoring engine (client + server, thesis-accurate, 19 unit tests)
- Results page: Prakriti card, guna donut chart, percentage bars, detailed report
- AI insights streaming (multi-LLM: Anthropic/Gemini/OpenAI with fallback)
- Quiz resume for logged-in users
- Shareable profile card with social buttons
- 80-question dataset ready (not yet wired to UI)

### Tech Stack
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS v4
- **Backend**: Python FastAPI + SQLAlchemy async + Alembic + PostgreSQL
- **Database**: Local PostgreSQL 16 (user: nikhil, db: manas)
- **AI**: Multi-LLM service (Anthropic Claude Haiku, Google Gemini Flash, OpenAI GPT-4o Mini)
- **Repo**: github.com/nikhilrdeshpande/anantayu-manas (private)

### Known Bugs (30 min to fix)
1. Demographics not skipped for returning users (backend endpoint exists, frontend not wired)
2. AI insights not cached to DB after streaming (re-calls LLM every page view)
3. i18n locale config has `'sa'` instead of `'mr'` for Marathi

---

## Scientific Foundation

Based on PhD thesis **"Manasa Vijnana"** by Dr. Akolkar Prasad Pramod (University of Mumbai, 2019), referencing the classical Ayurvedic text **Ashtanga Hridayam of Vagbhata**.

### Core Concepts

**Three Gunas** (mental qualities present in every mind):
| Guna | Nature | Dosha | Key Traits |
|------|--------|-------|------------|
| **Sattva** | Purity, clarity | Kapha | Patient, truthful, compassionate, good memory |
| **Rajas** | Activity, passion | Pitta | Ambitious, impatient, proud, competitive |
| **Tamas** | Inertia, grounding | Vata | Inert, forgetful, fearful, resistant to change |

**7 Prakriti Types** (from guna combinations):
1. Sattvika — The Sage
2. Rajasika — The Warrior
3. Tamasika — The Grounded
4. Sattvika-Rajasika — The Wise Leader
5. Sattvika-Tamasika — The Steady Sage
6. Rajasika-Tamasika — The Relentless Force
7. Trigunatmaka — The Balanced One

**16 Sub-types** (from Deep Assessment):
- 7 Sattvika: Brahma, Mahendra, Varuna, Kaubera, Gandharva, Yamya, Rishi kaya
- 6 Rajasika: Asura, Sarpa, Shakuna, Rakshasa, Paishaca, Preta kaya
- 3 Tamasika: Pashu, Matsya, Vanaspatya kaya

Each sub-type maps to animal/mythological archetypes with detailed behavioral patterns (svabhava/anuka) from the thesis.

### Scoring Algorithm (Thesis-Defined)
1. Count YES/NO/SOMETIMES per section
2. Primary % = yes_count / section_total * 100
3. Convert SOMETIMES: Sattva & Tamas 33%→YES, Rajas 67%→YES (rajas is hyperactive)
4. Recalculate secondary percentages
5. Classify into 7 types based on dominant guna combination
6. Sattva Bala (mental strength): >=66% Pravara, 33-66% Madhya, <33% Avara

---

## Monetization Strategy

### Tier Structure

```
┌─────────────────────────────────────────────────────────┐
│  FREE (The Hook)                                         │
│  Quick Assessment + Basic Result Card + 1 AI paragraph   │
│  Goal: Viral sharing, user acquisition                   │
├─────────────────────────────────────────────────────────┤
│  PREMIUM REPORT — One-time ₹799 / $9.99                 │
│  Comprehensive 6-section personalized wellness report    │
│  Goal: Primary revenue, high perceived value             │
├─────────────────────────────────────────────────────────┤
│  SUBSCRIPTION — ₹399/mo / $4.99/mo                      │
│  Dashboard + tracking + weekly guidance + deep assess    │
│  Goal: Recurring revenue, retention                      │
├─────────────────────────────────────────────────────────┤
│  CONSULTATION — ₹1999+ / $24.99+ per session (Future)   │
│  Expert Ayurvedic practitioner access                    │
│  Goal: High-value upsell, clinical credibility           │
└─────────────────────────────────────────────────────────┘
```

### Revenue Projections (Conservative)

| Metric | Month 1 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Free users | 1,000 | 10,000 | 50,000 |
| Premium reports (8% conversion) | 80 | 800 | 4,000 |
| Subscribers (3% of free) | 30 | 300 | 1,500 |
| Report revenue | ₹63,920 | ₹6,39,200 | ₹31,96,000 |
| Subscription revenue | ₹11,970/mo | ₹1,19,700/mo | ₹5,98,500/mo |
| **Monthly total** | **₹75,890** | **₹7,58,900** | **₹37,94,500** |

### Why Users Pay

The free result tells you WHAT you are. The premium report tells you WHAT TO DO about it:
- "You're Sattvika-Rajasika" (free) vs "Here's your personalized morning routine, diet plan for this week, specific pranayama sequence, and 30-day action plan" (premium)
- It's the difference between a blood test result and a doctor's prescription

---

## The Premium Report (Core Product)

This is the money-maker. A beautifully formatted, deeply personalized Ayurvedic wellness report.

### Report Sections

**1. Prakriti Analysis** (free preview available)
- Your specific guna balance explained in plain language
- What your dominant guna means for daily life
- How your age ({age}) and lifestyle ({work_nature}) affect your constitution
- Your Sattva Bala (mental strength) and what it means
- Historical context from Ashtanga Hridayam

**2. Personalized Dinacharya (Daily Routine)** (premium)
- **Morning** (5:30-8:00 AM): Wake time based on prakriti, specific pranayama (e.g., Nadi Shodhana for Sattvika, Sheetali for Rajasika, Bhastrika for Tamasika), meditation type and duration, morning beverage
- **Midday** (12:00-2:00 PM): Lunch timing, work break practices, energy management for their guna type
- **Evening** (5:00-8:00 PM): Wind-down activities, light exercise, evening routine
- **Night** (9:00-10:30 PM): Sleep preparation, specific recommendations based on sleep quality demographic
- Adapted for their work type (desk vs physical vs creative)

**3. Ahara — Diet Plan** (premium)
- **Sattvic foods to increase**: specific items that boost Sattva for their type
- **Rajasic foods to moderate**: foods that aggravate their Rajas
- **Tamasic foods to reduce**: foods that increase Tamas
- **Sample weekly meal plan** with breakfast, lunch, dinner
- **Seasonal adjustments** (Ritucharya): different recommendations for summer/winter/monsoon
- Specific to their diet preference (vegetarian/non-veg/vegan from demographics)

**4. Yoga and Meditation Prescription** (premium)
- **Asana sequence**: 5-7 poses suited to their prakriti type (calming for Rajasika, energizing for Tamasika, deepening for Sattvika)
- **Pranayama**: Specific techniques with duration (e.g., "10 minutes Anulom Vilom, followed by 5 minutes Bhramari")
- **Meditation style**: Mindfulness for Rajasika, Mantra for Tamasika, Vipassana for Sattvika
- **Frequency and duration**: Realistic schedule based on their work type

**5. Aushadhi — Herbal Recommendations** (premium)
- Herbs suited to their constitution (e.g., Brahmi for Rajasika mental calm, Ashwagandha for Tamasika energy, Shankhpushpi for Sattvika deepening)
- How to use them (tea, powder, supplement)
- Seasonal herbs
- Clear disclaimer: "Consult an Ayurvedic practitioner before starting any herbal regimen"

**6. Mental Wellness Action Plan** (premium)
- **This week**: 3 specific changes to implement immediately
- **30-day challenge**: Progressive daily practices building on each other
- **Monthly milestone**: What to expect after 30 days of following the plan
- **Reassessment reminder**: Retake the quiz in 30 days to track progress

**7. Deep Prakriti Profile** (premium + deep assessment)
- 16 sub-type classification with mythological archetype
- Svabhava (inherent nature) behavioral patterns
- Animal archetype from the thesis anuka tables
- Detailed comparison with other sub-types

---

## Implementation Sprints

### Sprint 1: Bug Fixes + Premium Report Engine

**Duration**: 1 session

**1.1 Fix 3 bugs**
| Bug | File | Fix |
|-----|------|-----|
| Demographics skip | `frontend/src/pages/AssessmentIntro.tsx` | Call `getUserDemographics(user.id)`, auto-set if exists, skip form |
| AI cache | `backend/app/api/v1/results.py` | After streaming completes, save to `result.ai_insights[locale]` |
| i18n locale | `frontend/src/lib/i18n.ts` | Change `'sa'` to `'mr'` |

**1.2 New backend: Report Generator**

Create `backend/app/services/report_generator.py`:
- Accepts Result + Demographics
- Builds comprehensive LLM prompt with all prakriti data + Ayurvedic protocols
- Uses higher-quality model (Sonnet/Gemini Pro) for premium reports
- Returns structured JSON with all 6 sections
- Multi-LLM support (same provider selection as ai_insights)

Create `backend/app/models/report.py`:
```python
class Report(Base):
    __tablename__ = "reports"
    id: UUID (PK)
    user_id: UUID (FK to users)
    result_id: UUID (FK to results)
    report_type: str  # 'basic' | 'premium'
    content: JSONB    # All sections as structured JSON
    locale: str
    model_used: str   # Which LLM generated this
    generated_at: datetime
```

Create `backend/app/api/v1/reports.py`:
- `POST /api/v1/reports/generate` — generate report (streams or returns cached)
- `GET /api/v1/reports/{result_id}` — get cached report
- `GET /api/v1/reports/{result_id}/pdf` — generate downloadable PDF (future)

**1.3 New frontend: Report Page**

Create `frontend/src/pages/Report.tsx`:
- Beautiful long-form scrollable report
- 6 sections, each as a well-designed card
- Section 1 (Analysis) visible to all — free preview
- Sections 2-6 blurred for free users with "Unlock Full Report" CTA
- PDF/print button
- Share button

Create `frontend/src/components/PaywallGate.tsx`:
- Wraps premium content
- Shows blurred preview + unlock CTA for free users
- Full content for premium users
- For now: `is_premium` flag on user (payment integration later)

**1.4 Database changes**
- Add `is_premium: boolean` to users table
- Create `reports` table
- Alembic migration

### Sprint 2: Wellness Dashboard + Practice Tracking

**Duration**: 1 session

**2.1 Personalized Dashboard** (`/:locale/dashboard`)
- Replaces landing page for authenticated users with completed assessment
- Prakriti summary card (compact version of result)
- "Today's Practices" checklist from their report
- Weekly focus theme
- Progress chart (if multiple assessments)
- Quick actions: Retake Assessment, View Full Report, Update Demographics

**2.2 Practice Tracking**

New table: `practice_logs`
```
id, user_id, date, practice_type, completed, notes, created_at
```

New components:
- `DailyChecklist.tsx` — checkable list of today's recommended practices
- `StreakCounter.tsx` — consecutive days of practice completion
- `WeeklySummary.tsx` — 7-day view of practice adherence

**2.3 Longitudinal Tracking**
- Chart showing guna balance over time (one data point per assessment)
- AI-generated trend commentary
- "Your Sattva increased 12% over 3 months"

### Sprint 3: Deep Assessment + 16 Sub-types

**Duration**: 1 session

**3.1 Complete 80-question flow**
- Reuse QuestionCard, AnswerSelector, SectionProgress components
- Section transitions for 30 Sattva + 30 Rajas + 20 Tamas
- Store type as 'full' in assessment
- Sub-type classification algorithm (bhava tag pattern matching)

**3.2 Sub-type Profile Page**
- Mythological archetype display (e.g., "Brahma Kaya — The Creator")
- Animal archetype visualization
- Svabhava behavioral patterns table
- Comparison with other sub-types in the same category

### Sprint 4: Payment + i18n + Polish

**Duration**: 1 session

**4.1 Payment Integration**
- Razorpay SDK for Indian payments (UPI, cards, wallets)
- Stripe for international
- Payment flow: Results page → "Unlock Report" → Payment → Report unlocked
- Webhook to update `is_premium` on user
- Subscription management page

**4.2 i18n (Hindi + Marathi)**
- Translate 25 quick questions + 80 full questions
- Translate all UI strings (common.json, assessment.json, results.json)
- AI generates reports in selected locale
- Professional translation review

**4.3 SEO + Growth**
- OG meta tags for shared result links (prakriti type + archetype as preview)
- Downloadable result card image (html2canvas)
- Landing page SEO (structured data, meta descriptions)
- Blog/content section for organic traffic

### Sprint 5: Consultation Platform (Future)

**5.1 Practitioner Portal**
- Practitioners register with credentials
- View patient profiles (with consent)
- Annotate assessments
- Prescribe treatments

**5.2 Booking System**
- Calendar integration
- Video consultation (Zoom/Meet embed)
- Payment per session
- Follow-up tracking

---

## Technical Architecture for New Features

### New Database Tables

```sql
-- Premium report storage
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    result_id UUID REFERENCES results(id),
    report_type VARCHAR(20) NOT NULL,     -- 'basic' | 'premium'
    content JSONB NOT NULL,               -- All sections as JSON
    locale VARCHAR(5) DEFAULT 'en',
    model_used VARCHAR(100),
    generated_at TIMESTAMPTZ DEFAULT now()
);

-- Practice tracking
CREATE TABLE practice_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    practice_date DATE NOT NULL,
    practice_type VARCHAR(50) NOT NULL,   -- 'pranayama' | 'meditation' | 'diet' | 'yoga' | 'sleep'
    completed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, practice_date, practice_type)
);

-- Add to users table
ALTER TABLE users ADD COLUMN is_premium BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN subscription_expires_at TIMESTAMPTZ;
```

### New API Endpoints

```
# Reports
POST   /api/v1/reports/generate          # Generate premium report
GET    /api/v1/reports/{result_id}       # Get cached report

# Practice Tracking
GET    /api/v1/practices/{user_id}/today       # Today's practices
POST   /api/v1/practices/{user_id}/log         # Log practice completion
GET    /api/v1/practices/{user_id}/streak      # Get streak data
GET    /api/v1/practices/{user_id}/weekly       # Weekly summary

# Dashboard
GET    /api/v1/dashboard/{user_id}             # Aggregated dashboard data

# Payments (Sprint 4)
POST   /api/v1/payments/create-order           # Razorpay order
POST   /api/v1/payments/verify                 # Verify payment
POST   /api/v1/payments/webhook                # Razorpay webhook
```

### New Frontend Routes

```
/:locale/dashboard          # Personalized wellness home
/:locale/report/:resultId   # Premium report view
/:locale/practices          # Practice tracking page
/:locale/deep-assessment    # 80-question flow (existing stub)
```

---

## Report Generation Prompt (Core IP)

The premium report quality is everything. Here's the prompt structure:

```
You are an expert Ayurvedic wellness counselor creating a comprehensive,
personalized Manas Prakriti wellness report for the Anantayu platform.

CLIENT PROFILE:
- Age: {age}, Gender: {gender}
- Diet: {diet}, Work: {work_nature}, Sleep Quality: {sleep_quality}

ASSESSMENT RESULTS:
- Prakriti Type: {prakriti_type} ({archetype_title})
- Sattva: {sattva_pct}%, Rajas: {rajas_pct}%, Tamas: {tamas_pct}%
- Sattva Bala: {sattva_bala} ({pravara|madhya|avara})
- Primary Guna: {primary}, Secondary: {secondary}

GENERATE A REPORT WITH THESE EXACT SECTIONS AS JSON:

{
  "analysis": {
    "overview": "2-3 paragraphs explaining their specific prakriti...",
    "age_context": "How their age affects their constitution...",
    "mental_strength": "What their Sattva Bala means practically..."
  },
  "dinacharya": {
    "morning": { "wake_time": "...", "practices": [...] },
    "midday": { "practices": [...] },
    "evening": { "practices": [...] },
    "night": { "sleep_time": "...", "practices": [...] }
  },
  "diet": {
    "increase": [{ "food": "...", "reason": "..." }],
    "moderate": [...],
    "reduce": [...],
    "sample_meals": { "breakfast": "...", "lunch": "...", "dinner": "..." },
    "seasonal_note": "..."
  },
  "yoga": {
    "asanas": [{ "name": "...", "duration": "...", "benefit": "..." }],
    "pranayama": [{ "name": "...", "duration": "...", "technique": "..." }],
    "meditation": { "style": "...", "duration": "...", "frequency": "..." }
  },
  "herbs": {
    "primary": [{ "name": "...", "form": "...", "usage": "...", "benefit": "..." }],
    "seasonal": [...],
    "disclaimer": "..."
  },
  "action_plan": {
    "this_week": ["...", "...", "..."],
    "thirty_day_challenge": { "week1": "...", "week2": "...", "week3": "...", "week4": "..." },
    "expected_outcomes": "...",
    "reassessment_note": "..."
  }
}

Use Claude Sonnet/Gemini Pro for premium quality.
Respond with ONLY valid JSON. Be specific, not generic.
Tailor everything to their exact age, diet, work type, and guna balance.
```

---

## Competitive Advantage

1. **Scientific backing**: Based on a real PhD thesis, not generic Ayurveda content
2. **Specificity**: Reports are personalized to age, gender, diet, work, sleep — not one-size-fits-all
3. **Scoring transparency**: Algorithm is documented, reproducible, and thesis-validated
4. **Multi-language**: Hindi + Marathi serve the Indian Ayurveda market directly
5. **AI-powered but grounded**: AI generates personalized text, but scoring is deterministic
6. **Shareability**: Prakriti cards designed for Instagram/WhatsApp virality
7. **Longitudinal value**: Monthly retakes show progress, creating retention

---

## Key Metrics to Track

| Metric | Target | Why |
|--------|--------|-----|
| Quiz completion rate | >85% | Validates 25-question approach |
| Share rate | >25% | Viral growth engine |
| Free → Premium conversion | >8% | Revenue |
| Premium report satisfaction | >4.5/5 | Retention, word-of-mouth |
| Monthly retake rate | >30% | Subscription value |
| Subscriber churn | <10%/mo | Recurring revenue health |
| Time-to-first-value | <4 min | Assessment completion speed |

---

## Immediate Next Steps

1. **Fix 3 bugs** (demographics skip, AI cache, locale) — 30 min
2. **Build report generator service** — backend + prompt engineering
3. **Build report frontend page** — scrollable, beautiful, paywalled
4. **Add `reports` table** + `is_premium` to users — migration
5. **Wire results page** → "Get Full Report" CTA → report page
6. **Test end-to-end**: take quiz → see free result → unlock premium report → view all 6 sections
