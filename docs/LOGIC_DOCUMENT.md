# Manas Prakriti - Complete Logic Document

## 1. Overview

Manas Prakriti is an Ayurvedic mental constitution assessment platform based on the PhD thesis "Manasa Vijnana" by Dr. Akolkar Prasad Pramod (University of Mumbai, 2019), referencing the classical text Ashtanga Hridayam of Vagbhata.

The platform classifies users into mental constitution types based on three Gunas (mental qualities): Sattva (purity), Rajas (activity), and Tamas (inertia).

---

## 2. Assessment Types

| | Quick | Deep |
|---|---|---|
| Questions | 25 | 80 |
| Sections | 10 Sattva, 10 Rajas, 5 Tamas | 30 Sattva, 30 Rajas, 20 Tamas |
| Price | Free | ₹399 one-time |
| Classification | 7 prakriti types | 7 types + 16 sub-types |
| Report | ~150 word AI insight | 1500+ word structured JSON report |
| LLM used | Claude Haiku / Gemini Flash | Claude Sonnet / Gemini Flash |
| Sub-type | No | Yes (bhava pattern matching) |
| PDF | Basic report | Full visual report |

The 80-question deep assessment contains all 25 quick questions plus 55 additional ones. When a user who completed the quick assessment starts the deep assessment, their 25 answers carry over automatically.

---

## 3. Scoring Algorithm

### 3.1 Step-by-Step Process

**Step 1: Count raw answers per section**
Each answer is YES, NO, or SOMETIMES. Count per guna section.

**Step 2: Calculate Primary Percentages**
```
primary_pct = (YES_count / section_total) * 100
```

**Step 3: Convert SOMETIMES answers**
The thesis defines different conversion ratios based on guna activity level:

| Guna | Type | SOMETIMES -> YES | SOMETIMES -> NO |
|------|------|-----------------|-----------------|
| Sattva | Dormant | 33% | 67% |
| Rajas | Active | 67% | 33% |
| Tamas | Dormant | 33% | 67% |

Rajas gets a higher YES conversion because it is the "active" guna - people with Rajasic tendencies are more likely to act on ambiguous impulses.

Formula:
```
adjusted_yes = yes_count + (sometimes_count * ratio)
  Sattva: adjusted_yes = yes + (sometimes * 0.33)
  Rajas:  adjusted_yes = yes + (sometimes * 0.67)
  Tamas:  adjusted_yes = yes + (sometimes * 0.33)
```

**Step 4: Calculate Secondary Percentages**
```
secondary_pct = (adjusted_yes / section_total) * 100
```
All percentages use Decimal arithmetic with ROUND_HALF_UP to 2 decimal places.

**Step 5: Rank dominant gunas**
Sort gunas by secondary percentage, descending.

**Step 6: Classify prakriti type**
See Section 4.

**Step 7: Calculate Sattva Bala (Mental Strength)**

| Sattva Secondary % | Grade | Meaning |
|----|----|----|
| >= 66% | Pravara | Superior mental strength |
| >= 33% | Madhya | Moderate mental strength |
| < 33% | Avara | Developing mental strength |

### 3.2 Bhava Score Tracking (Deep Assessment Only)

For deep/full assessments, the engine also tracks per-bhava YES scores:
- Each question has a `bhava_tag` (e.g., "ahimsa", "krodha", "nidra")
- YES answer: +1 to that bhava's score
- SOMETIMES answer: +1 to that bhava's score
- NO answer: no change

These bhava scores are used for sub-type classification and stored in the result for the AI report prompt.

---

## 4. Prakriti Type Classification

### 4.1 Dual Type Threshold

If the gap between the top two guna secondary percentages is <= 10%, the person is classified as a dual type. If > 10%, single type.

```
gap = top_guna_pct - runner_up_pct
is_dual = (gap <= 10) AND (runner_up_pct > 0)
```

### 4.2 Seven Prakriti Types

**Single Types (gap > 10%):**

| Dominant Guna | Type Name | Archetype |
|---|---|---|
| Sattva | Sattvika | The Harmoniser |
| Rajas | Rajasika | The Dynamo |
| Tamas | Tamasika | The Anchor |

**Dual Types (gap <= 10%):**

| Top + Runner-up | Type Name | Archetype |
|---|---|---|
| Sattva + Rajas | Sattva-Rajasika | The Enlightened Leader |
| Sattva + Tamas | Sattva-Tamasika | The Reflective Sage |
| Rajas + Sattva | Rajo-Sattvika | The Passionate Visionary |
| Rajas + Tamas | Rajo-Tamasika | The Restless Warrior |

Note: The order matters. Sattva-Rajasika (Sattva dominant) is different from Rajo-Sattvika (Rajas dominant). The first guna is always the higher scoring one.

---

## 5. Sixteen Sub-Type Classification

Sub-types are only classified for deep/full assessments (80 questions). They provide a more specific personality classification within the dominant guna.

### 5.1 Classification Algorithm

1. Filter sub-type clusters to those matching the dominant guna
2. For each candidate sub-type, sum the user's bhava scores for its 5 key bhavas
3. Select the candidate with the highest total score
4. If the best score is 0, return no sub-type

### 5.2 Sattvika Sub-Types (7)

| Key | Name | Archetype | Animal | Key Bhavas (triggers) |
|---|---|---|---|---|
| brahma | Brahma Kaya | The Creator | Swan (Hamsa) | satya, dharma, medha, jnana, viveka |
| mahendra | Mahendra Kaya | The Sovereign | Lion (Simha) | dhairya, achara, tapas, guru_bhakti, pratigya_palana |
| varuna | Varuna Kaya | The Protector | Elephant (Gaja) | kshama, shaucha, akrodha, santosha, titiksha |
| kaubera | Kaubera Kaya | The Generous One | Cow (Dhenu) | tyaga, dana, aparigraha, kritajna, samata |
| gandharva | Gandharva Kaya | The Artist | Peacock (Mayura) | shaucha, shaucha_shareera, anukulata, lakshya, prayatna |
| yamya | Yamya Kaya | The Just One | Bull (Vrishabha) | dharma, achara, astikya, satya, anahamkara |
| rishi | Rishi Kaya | The Sage | Deer (Mriga) | upasana, anasūyā, jnana, medha, santosha |

### 5.3 Rajasika Sub-Types (6)

| Key | Name | Archetype | Animal | Key Bhavas (triggers) |
|---|---|---|---|---|
| asura | Asura Kaya | The Titan | Tiger (Vyaghra) | ahamkara, mana, aishwarya, niyantrana, ahamkara_pradhana |
| sarpa | Sarpa Kaya | The Serpent | Cobra (Naga) | krodha, krodha_bahya, krodha_vahana, vaira, dvesha |
| shakuna | Shakuna Kaya | The Hunter | Hawk (Shyena) | chanchala, asthirata, sahasa, spardhā, bahya_prerana |
| rakshasa | Rakshasa Kaya | The Fierce One | Wolf (Vrka) | krodha, amarsha, asahishnuta, mada, niyantrana |
| paishaca | Paishaca Kaya | The Indulgent | Jackal (Srigala) | atibhojana, pradarshana, vitatha, shathya, apavarjana |
| preta | Preta Kaya | The Seeker | Crow (Kaka) | irshya, asantosha, tulana, pratyasha, atmashlāghā |

### 5.4 Tamasika Sub-Types (3)

| Key | Name | Archetype | Animal | Key Bhavas (triggers) |
|---|---|---|---|---|
| pashu | Pashu Kaya | The Steady One | Buffalo (Mahisha) | nidra, alasya, tandra, sthaulya, dirghsutrata |
| matsya | Matsya Kaya | The Hidden One | Fish (Matsya) | bhaya, bheerata, paradheenata, nirasha, udaseenata |
| vanaspatya | Vanaspatya Kaya | The Rooted One | Tortoise (Kurma) | amedha, buddhi_nasha, smriti_nasha, asanga, ashaucha |

---

## 6. Bhavas (Behavioral Traits)

Each question maps to a specific bhava. The bhavas are organized by guna:

### 6.1 Sattva Bhavas

| Tag | Name | Description |
|---|---|---|
| ahimsa | Non-violence | Compassion and respect for all living beings |
| satya | Truthfulness | Commitment to speaking and living the truth |
| asteya | Non-stealing | Respect for what belongs to others |
| dharma | Righteousness | Faithful performance of one's duties |
| astikya | Faith | Belief in karma and cosmic order |
| kshama | Forgiveness | Ability to remain calm and forgiving |
| dhairya | Patience | Endurance and steadfastness |
| achara | Good conduct | Discipline and adherence to ethical behaviour |
| anahamkara | Egolessness | Humility and absence of pride |
| medha | Intellect | Strong retention, memory, and learning |
| tyaga | Selfless service | Generosity without expectation of return |
| shaucha | Purity | Cleanliness of mind, body, and environment |

Additional bhavas in the 80-question assessment:
prayatna (effort), kritajna (gratitude), guru_bhakti (respect for elders), samata (equanimity), dana (charity), jnana (love for knowledge), santosha (contentment), titiksha (endurance), tapas (austerity), shaucha_shareera (personal hygiene), akrodha (non-anger), viveka (discrimination), anasūyā (non-envy), aparigraha (non-possessiveness), pratigya_palana (commitment), upasana (spiritual practice), anukulata (adaptability), lakshya (purposefulness)

### 6.2 Rajas Bhavas

| Tag | Name | Description |
|---|---|---|
| amarsha | Impatience | Restlessness when results are delayed |
| mana | Pride | Attachment to personal achievements |
| ahamkara | Ego | Strong sense of self-importance |
| aishwarya | Materialism | Desire for possessions and luxury |
| krodha | Anger | Frustration and irritability |
| spardhā | Competitiveness | Constant comparison and desire to outperform |
| shathya | Cunning | Preference for shortcuts and manipulation |
| mada | Stubbornness | Insistence on having things one's own way |
| vitatha | Exaggeration | Tendency to overstate experiences |
| krodha_bahya | Outward aggression | Loud expression of frustration and anger |

Additional: chanchala, irshya, niyantrana, tulana, pradarshana, vaira, ahamkara_pradhana, atibhojana, asthirata, chinta, krodha_vahana, pratyasha, apavarjana, vakpradhana, asantosha, dvesha, asahishnuta, atmashlāghā, bahya_prerana, sahasa

### 6.3 Tamas Bhavas

| Tag | Name | Description |
|---|---|---|
| nidra | Excess sleep | Preference for sleeping over productive activity |
| alasya | Laziness | Habitual missing of commitments and deadlines |
| amedha | Lack of intellect | Avoidance of learning and intellectual growth |
| buddhi_nasha | Mental avoidance | Avoidance of creative or effortful thinking |
| smriti_nasha | Forgetfulness | Chronic forgetfulness and poor memory |

Additional: tandra, paradheenata, nirasha, sthaulya, atibhojana_tamas, dirghsutrata, asanga, ashaucha, udaseenata, bhaya, nirutsaha, bheerata, madya_sevana, pramada, vishada

---

## 7. Question Structure

### 7.1 Quick Assessment (25 questions)

Database IDs: 1-25

| Section | Questions | ID Range |
|---|---|---|
| Sattva | 10 | 1-10 |
| Rajas | 10 | 11-20 |
| Tamas | 5 | 21-25 |

Each question has: id, section, question_number, text_en, bhava_tag, bhava_description_en

Example: ID 1, sattva, "Do you believe in the thought, 'live and let live'?", bhava_tag: ahimsa

### 7.2 Full/Deep Assessment (80 questions)

Database IDs: 1001-1080

| Section | Questions | ID Range |
|---|---|---|
| Sattva | 30 | 1001-1030 |
| Rajas | 30 | 1031-1060 |
| Tamas | 20 | 1061-1080 |

25 of these 80 questions have identical text to the quick assessment. When a user starts the deep assessment after completing the quick one, those 25 answers carry over automatically (mapped by text match).

---

## 8. Sub-Type Profile Data

Each of the 16 sub-types has a detailed behavioral profile stored in `svabhava_profiles.json`:

```
{
  "description": "1-2 paragraph personality overview",
  "behavioral_patterns": [
    "You're the kind of person who...",  // 5 specific patterns
    ...
  ],
  "strengths": ["Strength 1", "Strength 2", ...],  // 5 items
  "shadows": ["Shadow 1", "Shadow 2", ...],  // 4-5 items
  "relationship_style": "2-3 sentences about relational patterns",
  "work_style": "2-3 sentences about professional tendencies"
}
```

These profiles serve two purposes:
1. Fed into the AI prompt as context for generating the deep report
2. Displayed directly in the "Who You Are" section as behavioral pattern pills

---

## 9. AI Report Generation

### 9.1 Free Insight (Quick Assessment)

- **Trigger**: After quick assessment results are computed
- **LLM**: Claude Haiku (fallback: Gemini Flash, GPT-4o-mini)
- **Max tokens**: 300
- **Output**: Plain text, ~150 words
- **Content**: 2-sentence prakriti explanation + 1 daily practice + 1 encouraging thought
- **Personalization**: Uses guna percentages, sattva bala, and demographics if available
- **Caching**: Stored in `result.ai_insights[locale]` after first generation
- **Streaming**: Yes, streamed to frontend via SSE

### 9.2 Deep Report (Deep Assessment)

- **Trigger**: After deep assessment, on deep results page load
- **LLM**: Claude Sonnet (fallback: Gemini Flash, GPT-4o)
- **Max tokens**: 4000
- **Output**: Structured JSON with 6 sections
- **Purchase gate**: Requires completed purchase with `assessment_id IS NULL` (unused) or linked to this assessment
- **Caching**: Stored in `result.ai_insights["deep_{locale}"]`
- **Streaming**: Yes, streamed as text then parsed as JSON on frontend

### 9.3 Deep Report JSON Schema

```json
{
  "who_you_are": {
    "paragraphs": ["4 paragraphs, ~100 words each"],
    "inner_conflict": "Core tension between gunas",
    "at_work": "Professional style description",
    "in_relationships": "Relational pattern description"
  },
  "strengths_and_shadows": {
    "strengths": [{"title": "...", "description": "..."}],
    "shadows": [{"title": "...", "description": "..."}]
  },
  "diet": {
    "increase": [{"food": "...", "reason": "..."}],
    "reduce": [{"food": "...", "reason": "..."}],
    "meals": {"breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..."},
    "note": "Personalized diet insight"
  },
  "routine": {
    "morning": {"time": "5:30 - 8:00 AM", "practices": ["..."]},
    "midday": {"time": "12:00 - 2:00 PM", "practices": ["..."]},
    "evening": {"time": "5:00 - 7:00 PM", "practices": ["..."]},
    "night": {"time": "9:00 - 10:30 PM", "practices": ["..."]}
  },
  "practices": {
    "pranayama": {"name": "...", "duration": "...", "technique": "..."},
    "meditation": {"name": "...", "duration": "...", "technique": "..."},
    "yoga": [{"name": "...", "benefit": "..."}]
  },
  "thirty_day_plan": {
    "week1": {"focus": "...", "actions": ["..."]},
    "week2": {"focus": "...", "actions": ["..."]},
    "week3": {"focus": "...", "actions": ["..."]},
    "week4": {"focus": "...", "actions": ["..."]},
    "expected_outcome": "..."
  }
}
```

### 9.4 Personalization Inputs

The AI prompt receives:
- Prakriti type + sub-type + archetype + animal
- Guna percentages (Sattva/Rajas/Tamas)
- Sattva Bala grade
- Top 8 bhava scores (behavioral evidence)
- Sub-type profile data (behavioral patterns, strengths, shadows, relationship/work style)
- Demographics: age, gender, diet preference (vegetarian/non-veg/vegan), work type (desk/physical/creative/mixed), sleep quality (good/average/poor)

Diet recommendations are explicitly tailored to the user's diet preference. Routine is adapted to their work type and sleep quality.

---

## 10. Payment Logic

### 10.1 Purchase Flow

1. User clicks "Unlock Deep Assessment" on pricing page
2. Frontend calls `POST /api/v1/payments/create-order` with user_id
3. Backend creates Razorpay order (amount: 39900 paise = ₹399)
4. Backend saves Purchase record with status "pending"
5. Frontend opens Razorpay checkout modal
6. User completes payment
7. Razorpay returns order_id, payment_id, signature
8. Frontend calls `POST /api/v1/payments/verify`
9. Backend verifies HMAC-SHA256 signature
10. Purchase status updated to "completed"
11. User redirected to payment success page

### 10.2 One-Time Use Logic

- **Unused purchase**: status = "completed", assessment_id = NULL
- **Used purchase**: status = "completed", assessment_id = (linked UUID)
- After deep assessment submission, the purchase is linked to that assessment
- User can view their report forever (linked by assessment_id)
- User must pay again for another deep assessment
- `create-order` blocks if user already has an unused purchase

### 10.3 Access Verification

Two checks are used:
- `verify_deep_assessment_purchase(user_id)`: Checks for unused purchase (can start deep assessment)
- `verify_deep_report_access(user_id, assessment_id)`: Checks for purchase linked to specific assessment (can view report)

Deep insights endpoint allows access if EITHER check passes.

---

## 11. User Funnel

```
Landing Page
    |
    v
Free Quick Assessment (25 questions, no login required)
    |
    v
Results Page (prakriti type, guna chart, basic AI insight, share)
    |  "Unlock Deep Assessment - ₹399"
    v
Pricing Page (sample report preview, feature comparison, 16 sub-types preview)
    |  Razorpay payment
    v
Payment Success (receipt, CTA to start)
    |
    v
Deep Assessment (55 new questions, 25 carried from quick)
    |
    v
Deep Results (visual structured report, PDF download)
    |  "Book Expert Consultation"
    v
WhatsApp - Dr. Prasad Akolkar
```

---

## 12. Data Storage

### 12.1 Result Record

Stores all scoring data, classification, and cached AI reports:
- Raw counts (yes/no/sometimes per guna)
- Primary percentages (before SOMETIMES conversion)
- Secondary percentages (after SOMETIMES conversion)
- Classification (prakriti_type, subtype, archetype)
- Bhava scores (JSON dict of tag -> count)
- AI insights (JSON dict of cache keys -> generated text)
- Sattva bala grade

### 12.2 Purchase Record

Tracks payment lifecycle:
- Razorpay order_id, payment_id, signature
- Status progression: pending -> completed (or failed)
- Links to user and assessment (after use)
- Amount in paise, currency

---

## 13. Frontend Report Rendering

### 13.1 Quick Results (web)

Visual components: PrakritiCard (donut chart), GunaBar (animated bars), DetailedReport (icon cards for strengths/growth/practices), AIInsights (streamed text), ShareButtons

### 13.2 Deep Results (web)

The streamed JSON is parsed by `extractJSON()` which handles:
- Raw JSON
- JSON wrapped in markdown code fences
- JSON with leading/trailing text

Each section renders in a dedicated visual component:
- **Who You Are**: Dark card with gold border, behavioral pattern pills, core tension callout, work/relationships columns
- **Strengths & Shadows**: Two-column grid with green checks and gray dots
- **Diet**: Table card with increase/reduce items and 2x2 meal grid
- **Daily Routine**: Vertical timeline with dot connectors and time-of-day icons
- **Practices**: 3-card grid (pranayama, meditation, yoga)
- **30-Day Plan**: 2x2 week grid with numbered badges

During streaming, a progress checklist shows section names checking off as they appear in the raw text.
