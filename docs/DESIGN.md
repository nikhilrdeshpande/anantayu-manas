# Anantayu Manas Prakriti — Design Specifications

## Design System

### Brand Foundation

**Parent Brand**: Anantayu
**Sub-brand**: Manas Prakriti
**Aesthetic**: Modern wellness — clean, calming, premium. Think Headspace meets Ayurveda.

---

### Color System

#### Core Brand Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Ayurvedic Gold** | `#D4A017` | Primary CTAs, buttons, premium accents, highlights |
| **Deep Charcoal** | `#1A1A1A` | Hero backgrounds, primary text, premium surfaces |

#### Guna Colors (Manas Prakriti specific)
| Guna | Hex | Meaning | Usage |
|------|-----|---------|-------|
| **Sattva** | `#7BA05B` | Calm, purity, wisdom | Sattva section progress, charts, badges |
| **Rajas** | `#D4A017` | Energy, passion, drive | Rajas section progress, charts, badges (shares with Gold) |
| **Tamas** | `#5B6B7A` | Grounding, stillness, depth | Tamas section progress, charts, badges |

#### UI Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Background** | `#FAFAF5` | Page background (warm parchment) |
| **Surface** | `#FFFFFF` | Cards, modals, input backgrounds |
| **Dark Surface** | `#1A1A1A` | Hero sections, dark cards, result card option |
| **Text Primary** | `#1A1A1A` | Headings, body text on light bg |
| **Text Secondary** | `#4A4A4A` | Subheadings, descriptions |
| **Text Muted** | `#7A7A7A` | Captions, helper text, timestamps |
| **Text on Dark** | `#FAFAF5` | Text on dark backgrounds |
| **Text Gold on Dark** | `#D4A017` | Accent text on dark backgrounds |
| **Border** | `#E5E2DB` | Dividers, card borders, input borders |
| **CTA Hover** | `#B8891A` | Gold button hover state |

#### Tint Colors (Section Backgrounds)
| Name | Hex | Usage |
|------|-----|-------|
| **Gold Tint** | `#FDF6E3` | Light gold wash for highlighted sections |
| **Sattva Tint** | `#EFF5EB` | Sattva section background |
| **Rajas Tint** | `#FDF6E3` | Rajas section background |
| **Tamas Tint** | `#F0F2F4` | Tamas section background |

---

### Typography

| Role | Font | Weight | Size | Line Height |
|------|------|--------|------|-------------|
| **Display** | Plus Jakarta Sans | 700 (Bold) | 36px / 2.25rem | 1.2 |
| **H1** | Plus Jakarta Sans | 700 | 30px / 1.875rem | 1.25 |
| **H2** | Plus Jakarta Sans | 600 (SemiBold) | 24px / 1.5rem | 1.3 |
| **H3** | Plus Jakarta Sans | 600 | 20px / 1.25rem | 1.35 |
| **Body** | Inter | 400 (Regular) | 16px / 1rem | 1.6 |
| **Body Small** | Inter | 400 | 14px / 0.875rem | 1.5 |
| **Caption** | Inter | 500 (Medium) | 12px / 0.75rem | 1.4 |
| **Button** | Plus Jakarta Sans | 600 | 16px / 1rem | 1 |
| **Sanskrit/Devanagari** | Tiro Devanagari | 400 | Context-dependent | 1.5 |

---

### Spacing & Layout

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Inline spacing, icon gaps |
| `space-sm` | 8px | Tight padding, small gaps |
| `space-md` | 16px | Card padding, section gaps |
| `space-lg` | 24px | Between sections |
| `space-xl` | 32px | Major section padding |
| `space-2xl` | 48px | Page section spacing |
| `space-3xl` | 64px | Hero padding |
| `radius-sm` | 8px | Inputs, small buttons |
| `radius-md` | 12px | Cards, buttons |
| `radius-lg` | 16px | Answer buttons, modals |
| `radius-xl` | 24px | Result card, hero cards |
| `radius-full` | 9999px | Pill buttons, badges, avatars |

**Max content width**: 480px (quiz flow), 768px (results page), 1200px (landing page)

---

### Shadows

| Name | Value | Usage |
|------|-------|-------|
| **Shadow SM** | `0 1px 3px rgba(0,0,0,0.06)` | Subtle elevation (inputs) |
| **Shadow MD** | `0 4px 12px rgba(0,0,0,0.08)` | Cards, dropdowns |
| **Shadow LG** | `0 8px 24px rgba(0,0,0,0.10)` | Result card, modals |
| **Shadow XL** | `0 16px 48px rgba(0,0,0,0.12)` | Hero card, floating elements |

---

### Animation

| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| **Fade in** | 300ms | ease-out | Question transitions, page loads |
| **Slide up** | 400ms | cubic-bezier(0.16, 1, 0.3, 1) | Cards appearing, results reveal |
| **Scale tap** | 150ms | ease-in-out | Button press feedback |
| **Breathing pulse** | 3000ms | ease-in-out (infinite) | Loading animation, section transitions |
| **Chart animate** | 800ms | ease-out | Guna chart segments filling |
| **Progress fill** | 300ms | ease-out | Progress bar advancing |

---

## Screen Specifications

### Screen 1: Landing Page

**Layout**: Full-width, centered content, mobile-first

**Hero Section** (above fold):
- Background: `#1A1A1A` (Deep Charcoal)
- Anantayu logo top-left (white/gold variant)
- Language switcher top-right: `EN | HI | MR` (pill toggle, gold active state)
- Headline: "Discover Your Mind's True Nature" — Display size, `#FAFAF5`
- Subtext: "A 3-minute Ayurvedic assessment to understand your mental constitution" — Body, `#7A7A7A` on dark
- CTA Button: "Take the Quiz" — Gold bg (`#D4A017`), Charcoal text, radius-md, 56px height, 200px min-width
- Optional: Abstract organic shape illustration (lotus/mandala motif, subtle gold outline on dark)

**How It Works Section**:
- Background: `#FAFAF5`
- 3 cards in a row (stack on mobile):
  1. Icon: question mark in circle | "Answer" | "25 questions about your natural tendencies"
  2. Icon: compass/discover | "Discover" | "Your unique Sattva-Rajas-Tamas balance"
  3. Icon: lotus/transform | "Transform" | "Personalized Ayurvedic wellness guidance"
- Cards: white surface, Shadow MD, radius-lg, gold icon accent

**Guna Preview Section**:
- Background: `#FFFFFF`
- Three columns showing Sattva / Rajas / Tamas with their colors
- Each: colored circle icon, name, one-line description
- Sattva (`#7BA05B`): "Calm, wisdom, purity"
- Rajas (`#D4A017`): "Energy, passion, drive"
- Tamas (`#5B6B7A`): "Grounding, stillness, depth"

**Footer**:
- Anantayu branding
- Links: About, Privacy, Terms
- "Based on Ayurvedic research from Ashtanga Hridayam"

---

### Screen 2: Assessment Intro

**Layout**: Centered card (max 480px), `#FAFAF5` background

**Card content**:
- Background: white, Shadow LG, radius-xl, padding 32px
- Title: "About This Assessment" — H2
- Body text: "You'll answer 25 questions about your natural tendencies and reactions. There are no right or wrong answers — just be honest with yourself."
- Three small guna indicators:
  - Green dot + "Part 1: Your calm nature (10 questions)"
  - Gold dot + "Part 2: Your active nature (10 questions)"
  - Slate dot + "Part 3: Your steady nature (5 questions)"
- Divider line
- "Estimated time: 3 minutes"
- Language selector: `EN | HI | MR` (pill toggle)
- CTA: "Begin" — Gold bg, full-width, radius-md, 56px

---

### Screen 3: Question Screen

**Layout**: Full-screen, centered, max 480px content width

**Top bar** (fixed):
- Back arrow (left) — `#7A7A7A`
- Section indicator (center): colored dot + "Part 1 of 3" — Caption size
- Question counter (right): "7 of 25" — Caption size, `#7A7A7A`

**Progress bar** (below top bar):
- Full width, 4px height, radius-full
- Track: `#E5E2DB`
- Fill: section color (Sattva `#7BA05B` / Rajas `#D4A017` / Tamas `#5B6B7A`)
- 3 segments with 2px gap separators
- Smooth fill animation on advance

**Question area** (centered vertically):
- Question text: H3 (20px), `#1A1A1A`, centered, max 2 lines
- Below question: Sanskrit bhava term in small text, `#7A7A7A`, italic (e.g., "satya — truthfulness")

**Answer buttons** (below question, stacked):
- 3 buttons, full width (max 400px), centered
- Height: 56px
- Spacing: 12px between buttons
- Border-radius: radius-lg (16px)

**Button states**:
| State | Background | Border | Text |
|-------|-----------|--------|------|
| Default | `#FFFFFF` | 1.5px `#E5E2DB` | `#1A1A1A` |
| Hover | Section tint color | 1.5px section color | `#1A1A1A` |
| Selected: YES | Section color (full) | none | `#FFFFFF` |
| Selected: SOMETIMES | Section tint color | 1.5px section color | section color |
| Selected: NO | `#F0F2F4` | 1.5px `#E5E2DB` | `#4A4A4A` |

**Behavior**:
- On answer selection: 150ms scale-tap animation, then 300ms fade to next question
- Back arrow returns to previous question (answer preserved)
- Answers stored in local state (Zustand) + synced to server

---

### Screen 4: Section Transition

**Layout**: Full-screen interstitial

**Design**:
- Background: gradient from current section tint to next section tint
- Centered content:
  - Colored circle (next section color), 80px, with subtle breathing pulse animation
  - Text below: section-specific message — H3, `#1A1A1A`
    - Before Rajas: "Now, let's explore your active nature..."
    - Before Tamas: "Finally, let's understand your steady nature..."
  - Small text: "5 questions remaining" — Caption, `#7A7A7A`
- Auto-advances after 2.5 seconds, or tap anywhere to continue
- Fade-in/fade-out transition (400ms)

---

### Screen 5: Processing / Loading

**Layout**: Full-screen, centered

**Design**:
- Background: `#1A1A1A` (Deep Charcoal)
- Centered: Three concentric circles in Sattva/Rajas/Tamas colors, breathing pulse animation (3s loop)
- Below: "Analyzing your responses..." — Body, `#FAFAF5`, subtle opacity pulse
- Duration: 3-4 seconds (artificial delay for perceived computation)
- Transitions to result page with slide-up animation

---

### Screen 6: Result — Prakriti Profile Card

**THE most important screen. Designed for sharing.**

**Layout**: Card centered on page, max 420px width

**Card design**:
- Background: `#1A1A1A` (Deep Charcoal) — premium dark card
- Border-radius: radius-xl (24px)
- Shadow: Shadow XL
- Padding: 32px

**Card content** (top to bottom):
```
┌─────────────────────────────────────┐
│                                     │
│  [Anantayu logo — gold on dark]     │
│  MANAS PRAKRITI — Caption, #7A7A7A  │
│                                     │
│        ┌──────────────┐             │
│        │   Radial      │             │
│        │  Guna Chart   │             │
│        │  (3 segments) │             │
│        └──────────────┘             │
│                                     │
│     SATTVIKA-RAJASIKA               │
│     H2, #FAFAF5, centered           │
│                                     │
│     "The Wise Leader"               │
│     H3, #D4A017, centered           │
│                                     │
│     Calm · Driven · Thoughtful      │
│     Body, #7A7A7A, centered         │
│                                     │
│  Sattva  ████████░░  72%            │
│  Rajas   ██████░░░░  56%            │
│  Tamas   ██░░░░░░░░  18%            │
│  (Bars: section colors on dark bg)  │
│                                     │
│  Mental Strength: Pravara           │
│  Body Small, #D4A017                │
│                                     │
│  ─────────────────────              │
│  anantayu.com/prakriti              │
│  Caption, #7A7A7A                   │
│                                     │
└─────────────────────────────────────┘
```

**Guna Chart spec**:
- Donut/radial chart, 160px diameter
- 3 segments: Sattva `#7BA05B`, Rajas `#D4A017`, Tamas `#5B6B7A`
- Segment size proportional to percentages
- Center: empty or subtle dominant guna icon
- Animate: segments grow from 0 on mount (800ms ease-out)

**Percentage bars**:
- Height: 8px, radius-full
- Track: `rgba(255,255,255,0.1)` on dark
- Fill: respective guna color
- Label left: guna name (Caption, `#7A7A7A`)
- Label right: percentage (Caption, `#FAFAF5`)
- Animate: fill from 0 on mount (600ms ease-out, staggered 100ms)

**Below card — Share section**:
- Background: `#FAFAF5`
- "Share your Prakriti" — H3, centered
- 4 share buttons in a row: WhatsApp (green), Instagram (gradient), X (dark), Copy Link (outline)
  - Each: 48px circle, icon centered, Shadow SM
- Below: "See Your Full Report ↓" — text link with down arrow

---

### Screen 7: Result — Detailed Report

**Layout**: Scrollable content below the card, max 640px, `#FAFAF5` background

**Section 1: "What is Sattvika-Rajasika Prakriti?"**
- White card, Shadow MD, radius-lg, padding 24px
- H3 title
- 2-3 paragraphs of explanation text (Body, `#4A4A4A`)
- Subtle Sattva tint left border (4px, `#7BA05B`)

**Section 2: "Your Strengths"**
- 3 items, each with:
  - Gold circle icon (checkmark or star)
  - Title (Body, bold, `#1A1A1A`)
  - Description (Body Small, `#4A4A4A`)
- Cards on white surface

**Section 3: "Areas for Growth"**
- Same layout as strengths
- Slate circle icon (arrow-up or seedling)

**Section 4: "Daily Practices for Your Type"**
- 3 Ayurvedic recommendations
- Each: icon + title + 1-2 line description
- Gold tint background card

**Section 5: "Personalized Insight"**
- Gold-tinted background card
- AI-generated text, streamed with typing cursor animation
- "Powered by Anantayu AI" — Caption, `#7A7A7A`
- Regenerate button (subtle, icon-only)

**CTA Section**:
- "Want Deeper Insights?" — H3
- Card explaining Deep Assessment benefits
- Button: "Take the Complete Assessment" — Gold CTA

---

### Screen 8: Deep Assessment Unlock

**Layout**: Centered card, max 480px

**Design**:
- Dark card (`#1A1A1A`) with gold accents
- Title: "Unlock Your Full Prakriti Profile" — H2, `#FAFAF5`
- Benefits list:
  - "Discover your specific sub-type (e.g., Brahma kaya, Asura kaya)"
  - "Get your Svabhava (inherent nature) profile"
  - "Detailed behavioral archetype analysis"
  - "Comprehensive AI wellness report"
- "80 questions | ~15 minutes" — Caption
- CTA: "Start Deep Assessment" — Gold button
- Below: "Requires free account" — Caption, `#7A7A7A`

---

### Screen 9: Language Switcher

**Component**: Pill toggle in header

**Design**:
- 3 options: `EN` | `HI` | `MR` (or `EN` | `हिं` | `मरा`)
- Active: Gold bg (`#D4A017`), Charcoal text
- Inactive: transparent bg, `#7A7A7A` text
- Border: 1px `#E5E2DB`, radius-full
- Height: 32px
- Smooth transition on switch (200ms)
- On dark backgrounds: border `rgba(255,255,255,0.2)`, inactive text `#FAFAF5` at 60% opacity

---

## Responsive Behavior

| Breakpoint | Layout Changes |
|------------|---------------|
| **Mobile** (< 640px) | Single column, full-width cards, stacked "How It Works", quiz takes full screen |
| **Tablet** (640-1024px) | Centered content with 32px side margins, 2-column "How It Works" |
| **Desktop** (> 1024px) | Max-width containers, 3-column "How It Works", result card centered with report beside it |

**Critical**: Quiz flow (Screens 3-6) is designed mobile-first. On desktop, it should still be centered in a max-480px column — don't stretch it wide.

---

## Iconography

- Style: Outlined, 1.5px stroke, rounded caps
- Size: 24px default, 20px small, 32px large
- Color: inherits from context (gold for accents, charcoal for general)
- Source: Lucide Icons or Phosphor Icons (consistent with modern wellness aesthetic)

---

## Accessibility

- All text: minimum 4.5:1 contrast ratio (WCAG AA)
- Gold on dark: `#D4A017` on `#1A1A1A` = 5.2:1 ratio (passes AA)
- Focus states: 2px gold outline on interactive elements
- Answer buttons: large tap targets (56px min height)
- Screen reader labels for chart, progress bar, share buttons
- Reduced motion: disable animations when `prefers-reduced-motion` is set

---

## Assets Needed

1. Anantayu logo (gold-on-dark variant + dark-on-light variant)
2. Abstract organic illustrations for landing page hero
3. Icons for "How It Works" steps
4. Guna icons (small symbolic icons for Sattva/Rajas/Tamas)
5. Social share card template (1080x1920 for Instagram Story)
6. OG image template for link previews (1200x630)
