# Design System Specification: Editorial Wellness & Ayurvedic Modernism

## 1. Overview & Creative North Star: "The Modern Sanctuary"
This design system is built upon the **Creative North Star: The Modern Sanctuary.** We are moving away from the clinical, grid-locked aesthetic of traditional health apps. Instead, we are creating a digital environment that feels like a premium, high-end wellness retreat—where ancient Ayurvedic wisdom meets contemporary editorial precision.

The experience is defined by **intentional breathability**. We prioritize whitespace as a functional element, not just a gap. By utilizing "The Layering Principle" instead of rigid borders, the UI feels organic, fluid, and premium. Layouts should favor centered, mobile-first compositions that guide the user's focus toward a singular path of self-discovery.

---

## 2. Color & Tonal Architecture
The palette is rooted in the earth (Parchment, Charcoal) and elevated by the divine (Ayurvedic Gold).

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections or containers. Boundary definition must be achieved through:
1.  **Background Shifts:** Placing a `surface-container-low` card against a `surface` background.
2.  **Tonal Transitions:** Moving from `surface-container-lowest` to `surface-container-high` to denote importance.

### Surface Hierarchy
Utilize the surface-container tiers to create physical depth:
*   **Surface (`#fcf9f8`):** The canvas. Used for the overall page background.
*   **Surface-Container-Low (`#f6f3f2`):** Subtle secondary sections or "well" areas.
*   **Surface-Container-Highest (`#e5e2e1`):** Active, elevated interaction states.

### The "Glass & Soul" Rule
To avoid a flat "template" look, utilize **Glassmorphism** for floating elements (like the pill-shaped language switcher).
*   **Implementation:** Use `surface-container-lowest` at 80% opacity with a `backdrop-blur` of 12px.
*   **Signature Textures:** For primary CTAs, apply a subtle linear gradient from `primary` (`#795900`) to `primary-container` (`#d4a017`) to add "visual soul" and a metallic sheen that flat hex codes cannot replicate.

---

## 3. Color Tokens

| Token | Hex |
|-------|-----|
| background | #fcf9f8 |
| surface | #fcf9f8 |
| surface-container-low | #f6f3f2 |
| surface-container | #f0eded |
| surface-container-high | #eae7e7 |
| surface-container-highest | #e5e2e1 |
| surface-container-lowest | #ffffff |
| primary | #795900 |
| primary-container | #d4a017 |
| on-primary | #ffffff |
| on-primary-container | #503a00 |
| secondary | #466729 |
| secondary-container | #c6efa1 |
| on-secondary | #ffffff |
| on-secondary-container | #4c6e2f |
| tertiary | #50606f |
| tertiary-container | #9aaabb |
| on-tertiary | #ffffff |
| on-tertiary-container | #2f3f4d |
| on-background | #1c1b1b |
| on-surface | #1c1b1b |
| on-surface-variant | #4f4634 |
| outline | #817662 |
| outline-variant | #d3c5ae |
| inverse-surface | #313030 |
| inverse-on-surface | #f3f0ef |
| inverse-primary | #f6be39 |
| error | #ba1a1a |
| error-container | #ffdad6 |

### Guna Colors
| Guna | Token | Hex |
|------|-------|-----|
| **Sattva** | secondary | #7BA05B |
| **Rajas** | primary-container | #D4A017 |
| **Tamas** | tertiary | #5B6B7A |

---

## 4. Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display Large | Plus Jakarta Sans | 700 | 3.5rem (56px) |
| Headline Large | Plus Jakarta Sans | 700 | 2rem (32px) |
| Headline Medium | Plus Jakarta Sans | 600 | 1.75rem (28px) |
| Headline Small | Plus Jakarta Sans | 600 | 1.5rem (24px) |
| Body Large | Inter | 400 | 1rem (16px) |
| Body Medium | Inter | 400 | 0.875rem (14px) |
| Label Large | Inter | 500 | 0.875rem (14px) |
| Label Medium | Inter | 500 | 0.75rem (12px) |

---

## 5. Spacing Scale

| Token | Value |
|-------|-------|
| spacing-1 | 0.25rem (4px) |
| spacing-2 | 0.5rem (8px) |
| spacing-3 | 0.75rem (12px) |
| spacing-4 | 1.4rem (22px) |
| spacing-5 | 1.7rem (27px) |
| spacing-6 | 2rem (32px) |
| spacing-8 | 2.75rem (44px) |
| spacing-10 | 3.5rem (56px) |
| spacing-16 | 5.5rem (88px) |
| spacing-20 | 7rem (112px) |

---

## 6. Border Radius

| Token | Value |
|-------|-------|
| radius-sm | 0.5rem (8px) |
| radius-md | 0.75rem (12px) |
| radius-lg | 2rem (32px) |
| radius-xl | 3rem (48px) |
| radius-full | 9999px |

---

## 7. Signature Components

### The Guna Radial Donut
- Sattva: `#7BA05B`, Rajas: `#D4A017`, Tamas: `#5B6B7A`
- Thickness: 12px, center shows dominant Guna name in headline-sm

### High-Contrast Answer Buttons
- radius-lg (2rem), surface-container-low default
- Selected: inverse-surface (#313030) with on-primary text
- Spacing-5 (1.7rem) internal padding

### Pill-Shaped Language Switcher
- radius-full, glassmorphism background
- Active language on surface-container-lowest pill with 300ms spring animation

---

## 8. Screen Inventory

### Desktop (13 screens)
| # | File | Screen |
|---|------|--------|
| 1 | 01-landing-page.html | Full landing page with hero, how it works, guna explainer |
| 2 | 02-assessment-intro.html | Assessment introduction before quiz |
| 3 | 03-question-screen.html | Single question with YES/NO/SOMETIMES |
| 4 | 04-section-transition.html | Transition between Sattva/Rajas/Tamas sections |
| 5 | 05-processing-result.html | Loading animation while computing results |
| 6 | 06-result-profile-card.html | Shareable Prakriti profile card |
| 7 | 07-detailed-report.html | Full detailed wellness report |
| 8 | 08-deep-assessment-unlock.html | CTA to unlock 80-question deep assessment |
| 9 | 09-deep-assessment-quiz.html | Deep assessment quiz interface |
| 10 | 10-subtype-report.html | Sub-type report (e.g., Brahma Kaya) |
| 11 | 11-login.html | Login page |
| 12 | 12-signup.html | Sign up page |
| 13 | 13-user-profile.html | User profile / dashboard |

### Mobile (8 screens)
| # | File | Screen |
|---|------|--------|
| 1 | 01-landing-page.html | Mobile landing page |
| 2 | 02-assessment-intro.html | Mobile assessment intro |
| 3 | 03-question-screen.html | Mobile question screen |
| 4 | 04-result-card.html | Mobile result card |
| 5 | 05-detailed-report.html | Mobile detailed report |
| 6 | 06-login.html | Mobile login |
| 7 | 07-unlock-screen.html | Mobile deep assessment unlock |
| 8 | 08-user-profile.html | Mobile user profile |
