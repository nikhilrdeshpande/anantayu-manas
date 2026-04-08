# Anantayu Manas Prakriti — Product Requirements Document

## Product Vision

**Anantayu Manas Prakriti** is a modern wellness assessment platform that reveals your Ayurvedic mental constitution. Users take a beautifully designed 3-minute quiz to discover their mind's Sattva/Rajas/Tamas balance, receive a shareable Prakriti profile card, and get personalized Ayurvedic wellness guidance.

**One-liner**: "Discover Your Mind's True Nature" — the 16Personalities of Ayurveda.

---

## Problem Statement

1. **Inaccessible knowledge**: Ayurvedic mental constitution (Manas Prakriti) assessment is traditionally done only by practitioners in clinical settings. The average person has no way to understand their Ayurvedic mental type.

2. **Poor digital experiences**: Existing Prakriti quizzes online are clinical-looking, text-heavy, desktop-only, and not designed for sharing or engagement.

3. **No shareability**: Modern personality tools (MBTI, Enneagram, 16Personalities) go viral because results are shareable. No Ayurvedic tool has cracked this.

4. **80-question fatigue**: Academic Prakriti assessments use 60-80 questions. Research shows 85%+ completion at 20-30 questions but only ~60% at 80. A curated approach is needed.

---

## Scientific Foundation

Based on the PhD thesis **"Manasa Vijnana: Ayurvedic concept of mind and its science"** by Dr. Akolkar Prasad Pramod (University of Mumbai, 2019), with reference to the classical text Ashtanga Hridayam of Vagbhata.

### Core Framework

Every mind contains three gunas (qualities) in unique proportions:

| Guna | Nature | Body Dosha | Characteristics |
|------|--------|------------|-----------------|
| **Sattva** | Purity, calm, wisdom | Kapha | Patience, truthfulness, compassion, devotion, good memory, piety |
| **Rajas** | Activity, passion, drive | Pitta | Ambition, pride, impatience, anger, desire, competitiveness |
| **Tamas** | Inertia, grounding, stillness | Vata | Laziness, forgetfulness, fear, ignorance, resistance to change |

### 7 Prakriti Types (from guna combinations)

| # | Type | Dominant | Secondary | Archetype Title |
|---|------|----------|-----------|-----------------|
| 1 | Sattvika | Sattva | — | The Sage |
| 2 | Rajasika | Rajas | — | The Warrior |
| 3 | Tamasika | Tamas | — | The Grounded |
| 4 | Sattvika-Rajasika | Sattva | Rajas | The Wise Leader |
| 5 | Sattvika-Tamasika | Sattva | Tamas | The Steady Sage |
| 6 | Rajasika-Tamasika | Rajas | Tamas | The Relentless Force |
| 7 | Sannipatika | All three | All three | The Balanced One |

### 16 Sub-types (Deep Assessment only)

**7 Sattvika**: Brahma, Mahendra, Varuna, Kaubera, Gandharva, Yamya, Rishi kaya
**6 Rajasika**: Asura, Sarpa, Shakuna, Rakshasa, Paishaca, Preta kaya
**3 Tamasika**: Pashu, Matsya, Vanaspatya kaya

Each sub-type has detailed behavioral patterns (svabhava) mapped to animal and mythological archetypes from the Ayurvedic texts.

---

## Target Users

| Persona | Description | Motivation |
|---------|-------------|------------|
| **Wellness Explorer** | 25-35, urban, health-conscious | Curious about Ayurveda, likes personality quizzes |
| **Yoga/Ayurveda Enthusiast** | 30-50, regular practitioner | Wants deeper self-understanding through Ayurvedic lens |
| **Self-Improvement Seeker** | 25-45, reads psychology/wellness content | Loves MBTI/Enneagram, open to Eastern frameworks |
| **Social Sharer** | 20-35, active on Instagram/WhatsApp | Takes quizzes to share results with friends |

**Primary language**: English
**Secondary languages**: Hindi, Marathi

---

## Core Features — Phase 1 (Assessment MVP)

### F1: Quick Prakriti Assessment (~3 min, 25 questions)

**The entry point. Zero friction, maximum engagement.**

- 25 curated questions (10 Sattva + 10 Rajas + 5 Tamas)
- Selected from the thesis's 80 questions for maximum discriminating power
- One question at a time, full-screen, mobile-first
- Answer options: **YES / NO / SOMETIMES** — large, thumb-friendly buttons
- No account required — fully anonymous via session token
- Calming section transitions between Sattva → Rajas → Tamas blocks
- Progress bar colored per section (sage green → gold → slate)
- Back navigation allowed, can change answers

**Questions are organized by bhava (mental characteristic):**

**Sattva Section (10 questions) — exploring calm, pure nature:**
1. Do you believe in the thought, 'live and let live'? *(ahimsa/compassion)*
2. Do you speak the truth often? *(satya/truthfulness)*
3. Do you perform your duties religiously? *(dharma)*
4. Do you believe in karma? *(astikya/belief)*
5. Can you wait patiently in a long queue? *(titiksha/patience)*
6. Do you follow traffic rules properly in heavy traffic? *(daily dharma)*
7. Would you avoid taking full credit for your team's work? *(tyaga/selflessness)*
8. Do you retain whatever you learn? *(smriti/memory)*
9. Would you continue humanitarian work without reward? *(nishkama karma)*
10. Do you think development shouldn't destroy nature? *(environmental consciousness)*

**Rajas Section (10 questions) — exploring active, passionate nature:**
1. Do you get impatient when work takes longer than expected? *(adhriti/impatience)*
2. Do you feel proud when you achieve your goal? *(mana/pride)*
3. Do you express your pride openly? *(ahankara/ego)*
4. Do you enjoy shopping? *(kama/desire)*
5. Are you angry when you fail to complete work in time? *(krodha/anger)*
6. Do you feel you can perform better than your colleagues? *(matsarya/competitiveness)*
7. Will you prefer shortcuts in achieving goals? *(anritikritva/expedience)*
8. Do you insist on functioning only your way? *(dambha/stubbornness)*
9. Do you exaggerate while describing experiences? *(bahubhashitva/exaggeration)*
10. Do you express frustration loudly? *(krodha expression)*

**Tamas Section (5 questions) — exploring grounded, still nature:**
1. Will you prefer sleeping over doing an activity in spare time? *(nidra/inertia)*
2. Do you often miss deadlines? *(akarmashilata/inaction)*
3. Do you avoid learning new subjects? *(ajnana/resistance to knowledge)*
4. Do you avoid responsibility that requires thinking out of the box? *(buddhinirodha/mental resistance)*
5. Do you have a forgetful nature? *(durmedhasatva/poor retention)*

### F2: Prakriti Result — Shareable Profile Card

**The viral moment. Designed for Instagram Stories and WhatsApp.**

Content on card:
- Anantayu logo + "Manas Prakriti" label
- Radial guna balance visualization (3-segment chart)
- Prakriti type name (e.g., "SATTVIKA-RAJASIKA")
- Archetype title (e.g., "The Wise Leader")
- 3-word trait summary (e.g., "Calm . Driven . Thoughtful")
- Percentage bars for Sattva / Rajas / Tamas
- Sattva Bala (mental strength): Pravara / Madhya / Avara
- URL: anantayu.com/prakriti

Share targets:
- WhatsApp (primary for Indian market)
- Instagram Stories (card designed at 1080x1920)
- X/Twitter
- Copy link

### F3: Prakriti Result — Detailed Report

**Scrollable below the card for users who want depth.**

Sections:
1. **What is [Your Prakriti Type]?** — 2-3 paragraph explanation
2. **Your Top 3 Strengths** — Derived from dominant guna characteristics
3. **3 Areas for Growth** — Derived from secondary/tertiary guna patterns
4. **Daily Practices for Your Type** — 3 specific Ayurvedic recommendations (diet, routine, mental practice)
5. **Personalized Insight** — AI-generated paragraph (Claude API, streamed with typing animation)

### F4: Deep Assessment (Unlock)

**For engaged users who want the full picture.**

- CTA shown after Quick results: "Want Deeper Insights?"
- Full 80 questions from thesis (30 Sattva + 30 Rajas + 20 Tamas)
- Requires account creation to save results
- Unlocks:
  - 16 sub-type classification (e.g., "Brahma kaya", "Asura kaya")
  - Svabhava (inherent nature) profile with animal/mythological archetype
  - Detailed anuka table (behavioral patterns mapped to archetypes)
  - Comprehensive AI wellness report

### F5: Multi-language Support

- English, Hindi, Marathi
- Language switcher in header (EN | HI | MR)
- All questions, results, descriptions, and AI insights localized
- Sanskrit Ayurvedic terms preserved across all languages with explanations

### F6: Account & History

- Anonymous-first: no signup required for Quick Assessment
- Optional account creation after results (email + password or social auth)
- Account enables: save results, retake assessment, view history, track guna balance over time
- Dashboard for returning users

---

## User Journeys

### Journey 1: First-time anonymous user (primary flow)

```
Landing Page
  → "Take the 3-Minute Quiz" CTA
  → Assessment Intro screen (brief context, language selection)
  → Section 1: Sattva (10 questions, green progress bar)
  → Section transition (calming interstitial)
  → Section 2: Rajas (10 questions, gold progress bar)
  → Section transition
  → Section 3: Tamas (5 questions, slate progress bar)
  → Processing animation ("Analyzing your responses...")
  → Result: Prakriti Profile Card
  → Share (WhatsApp / Instagram / X)
  → Scroll down: Detailed Report with AI insights
  → CTA: "Save Your Results" (optional signup)
  → CTA: "Take the Deep Assessment" (unlock)
```

### Journey 2: Social discovery (viral loop)

```
See friend's Prakriti card on WhatsApp/Instagram
  → Tap shared link → Landing page
  → Intrigued by friend's result → "Take the Quiz"
  → Complete assessment → Get own result
  → Share own result → Loop continues
```

### Journey 3: Returning user (depth seeker)

```
Login → Dashboard (past results)
  → "Take Deep Assessment" CTA
  → 80 questions (with section breaks, gamification)
  → Detailed sub-type result (e.g., "Brahma kaya")
  → Full Svabhava profile + AI wellness report
  → Compare with Quick Assessment result
```

---

## Scoring Algorithm

### Quick Assessment (25 questions)

**Step 1 — Raw Count**
Count YES / NO / SOMETIMES answers for each section:
- Sattva: out of 10 questions
- Rajas: out of 10 questions
- Tamas: out of 5 questions

**Step 2 — Primary Percentage**
```
sattva_primary_pct = (sattva_yes / 10) * 100
rajas_primary_pct  = (rajas_yes / 10) * 100
tamas_primary_pct  = (tamas_yes / 5) * 100
```

**Step 3 — SOMETIMES Conversion** (thesis-defined ratios)
```
Sattva & Tamas sections (dormant by nature):
  33% of SOMETIMES count → added to YES
  67% of SOMETIMES count → added to NO

Rajas section (hyperactive by nature):
  67% of SOMETIMES count → added to YES
  33% of SOMETIMES count → added to NO
```

**Step 4 — Secondary Percentage** (post-conversion)
Recalculate percentages using converted counts.

**Step 5 — Dominant Guna Classification**
- Highest secondary percentage → Primary Dominant Guna
- Second highest → Secondary Dominant Guna
- Combine to determine Prakriti type (one of 7)

**Step 6 — Sattva Bala (Mental Strength)**
```
If sattva_secondary_pct >= 66%: Pravara (Superior)
If 33% <= sattva_secondary_pct < 66%: Madhya (Moderate)
If sattva_secondary_pct < 33%: Avara (Needs Strengthening)
```

### Deep Assessment (80 questions) — adds:

**Step 7 — Sub-type Classification**
Uses bhava tag analysis within dominant section to match one of 16 sub-types. Each question is tagged with a specific bhava (e.g., shauca, krodha, bhaya). Cluster patterns of YES answers on specific bhavas map to specific sub-types via lookup table.

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Quick Assessment completion rate | > 85% | Started vs completed |
| Time to complete Quick | < 4 minutes | Avg from start to result |
| Share rate | > 25% | Share button clicks / completions |
| Deep Assessment conversion | > 15% | Quick completers who start Deep |
| Account creation rate | > 20% | Signups after result |
| Return visit rate | > 30% | Users who come back within 30 days |
| Social referral rate | > 10% | New users from shared links |

---

## Phase 2 — Full Wellness Platform (Future)

- Personalized Ayurvedic diet recommendations per prakriti type
- Daily wellness routines (Dinacharya) aligned with constitution
- Longitudinal tracking: retake assessment monthly, track guna balance shifts
- Educational content hub about Manas Vijnana concepts
- Practitioner dashboard for Ayurvedic consultants
- Anantayu product recommendations aligned with prakriti type
- Community features: compare prakriti with friends/partner
- Push notifications for daily practices

---

## Technical Constraints

- Must work flawlessly on mobile (80%+ traffic expected)
- Assessment state must persist across page refreshes (local storage + server sync)
- AI insights must stream (not block for 5+ seconds)
- All 3 languages must be supported from day 1
- No account required for core experience
- Results must be deterministic (same answers = same result, always)
- Shareable card must render correctly as an image (not just a link preview)

---

## Out of Scope (Phase 1)

- Body Prakriti (Sharira Prakriti) assessment — only Manas Prakriti
- Video/audio content
- Practitioner portal
- Product recommendations/e-commerce
- Native mobile apps (web-first, responsive)
- Paid features or subscriptions
