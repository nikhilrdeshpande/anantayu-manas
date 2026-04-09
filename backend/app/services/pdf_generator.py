"""Visual PDF report generator for Manas Prakriti assessment results."""

import io
import json
from pathlib import Path

from fpdf import FPDF

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# Brand colors (RGB)
GOLD = (212, 160, 23)
GOLD_DARK = (139, 105, 20)
DARK = (26, 26, 26)
GREEN = (123, 160, 91)
GREEN_DARK = (70, 103, 41)
GRAY_BLUE = (91, 107, 122)
RED = (204, 68, 68)
TEXT_DARK = (28, 27, 27)
TEXT_MID = (79, 70, 52)
TEXT_LIGHT = (129, 118, 98)
WHITE = (255, 255, 255)
BG_LIGHT = (252, 249, 248)
BG_CARD = (246, 243, 242)
BG_GOLD_TINT = (253, 246, 227)
BG_GREEN_TINT = (239, 245, 235)
BG_GRAY_TINT = (240, 242, 244)

GUNA_COLORS = {"sattva": GREEN, "rajas": GOLD, "tamas": GRAY_BLUE}


def sanitize(text: str) -> str:
    """Replace Unicode characters that Helvetica can't render."""
    if not text:
        return ""
    replacements = {
        "\u2018": "'", "\u2019": "'",
        "\u201c": '"', "\u201d": '"',
        "\u2013": "-", "\u2014": "-",
        "\u2026": "...", "\u00a0": " ",
        "\u2022": "-", "\u00b7": "-",
        "\u2012": "-", "\u2015": "-", "\u200b": "",
    }
    for char, rep in replacements.items():
        text = text.replace(char, rep)
    return text.encode("latin-1", errors="replace").decode("latin-1")


class ManasReportPDF(FPDF):

    def header(self):
        # Dark header bar
        self.set_fill_color(*DARK)
        self.rect(0, 0, 210, 14, "F")
        self.set_y(3)
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*GOLD)
        self.cell(0, 8, "    ANANTAYU", align="L")
        self.set_font("Helvetica", "", 7)
        self.set_text_color(200, 200, 200)
        self.cell(0, 8, "manasprakriti.anantayu.com    ", align="R")
        self.set_y(16)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "", 7)
        self.set_text_color(*TEXT_LIGHT)
        self.cell(0, 8, f"Page {self.page_no()}/{{nb}}", align="C")

    def dark_hero(self, title: str, subtitle: str = "", badge: str = ""):
        """Full-width dark hero section."""
        y = self.get_y()
        self.set_fill_color(*DARK)
        self.rect(0, y, 210, 40, "F")
        if badge:
            self.set_y(y + 4)
            self.set_font("Helvetica", "", 7)
            self.set_text_color(*GOLD)
            self.cell(0, 5, sanitize(badge), align="C")
        self.set_y(y + 10)
        self.set_font("Helvetica", "B", 20)
        self.set_text_color(*WHITE)
        self.cell(0, 10, sanitize(title), align="C", new_x="LMARGIN", new_y="NEXT")
        if subtitle:
            self.set_font("Helvetica", "I", 10)
            self.set_text_color(*GOLD)
            self.cell(0, 6, sanitize(subtitle), align="C")
        self.set_y(y + 42)

    def guna_bars_block(self, sattva: float, rajas: float, tamas: float):
        """Visual guna bars with colored fills."""
        y = self.get_y()
        self.set_fill_color(*BG_CARD)
        self.rect(15, y, 180, 28, "F")

        for i, (label, pct, color) in enumerate([
            ("SATTVA", sattva, GREEN),
            ("RAJAS", rajas, GOLD),
            ("TAMAS", tamas, GRAY_BLUE),
        ]):
            row_y = y + 3 + (i * 8)
            self.set_xy(20, row_y)
            self.set_font("Helvetica", "B", 7)
            self.set_text_color(*color)
            self.cell(22, 6, label)
            # Bar bg
            self.set_fill_color(220, 220, 220)
            self.rect(42, row_y + 1.5, 110, 3, "F")
            # Bar fill
            self.set_fill_color(*color)
            self.rect(42, row_y + 1.5, max(1, pct / 100 * 110), 3, "F")
            # Pct
            self.set_xy(155, row_y)
            self.set_font("Helvetica", "", 7)
            self.set_text_color(*TEXT_MID)
            self.cell(20, 6, f"{pct:.1f}%")

        self.set_y(y + 30)

    def section_card(self, title: str, icon_color: tuple, bg_color: tuple = WHITE):
        """Start a visually distinct section with colored header bar."""
        self.ln(4)
        y = self.get_y()
        # Check if we need a new page
        if y > 260:
            self.add_page()
            y = self.get_y()

        # Left color bar
        self.set_fill_color(*icon_color)
        self.rect(15, y, 3, 8, "F")
        # Title
        self.set_xy(21, y)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(*icon_color)
        self.cell(0, 8, sanitize(title))
        self.set_y(y + 10)

    def card_box(self, content_fn, bg: tuple = WHITE, padding: float = 4):
        """Render content inside a card with background."""
        y_start = self.get_y()
        x_start = 15
        width = 180
        # Draw content first to measure height
        self.set_x(x_start + padding)
        content_fn()
        y_end = self.get_y() + padding
        # Draw background behind content
        self.set_fill_color(*bg)
        # Can't draw behind already-rendered content in fpdf, so we use this for padding
        self.set_y(y_end + 2)

    def text_block(self, text: str, bold: bool = False, color: tuple = TEXT_DARK, size: int = 9):
        self.set_font("Helvetica", "B" if bold else "", size)
        self.set_text_color(*color)
        self.multi_cell(170, 5, sanitize(text), new_x="LMARGIN", new_y="NEXT")

    def mini_label(self, text: str, color: tuple = TEXT_LIGHT):
        self.set_font("Helvetica", "B", 7)
        self.set_text_color(*color)
        self.cell(0, 5, sanitize(text.upper()), new_x="LMARGIN", new_y="NEXT")

    def item_row(self, text: str, positive: bool = True, indent: float = 20):
        if self.get_y() > 275:
            self.add_page()
        self.set_x(indent)
        color = GREEN if positive else RED
        symbol = "+" if positive else "-"
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*color)
        self.cell(5, 5, symbol)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(*TEXT_DARK)
        self.multi_cell(160, 5, sanitize(text), new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def bullet(self, text: str, color: tuple = GOLD, indent: float = 20):
        if self.get_y() > 275:
            self.add_page()
        self.set_x(indent)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*color)
        self.cell(4, 5, "-")
        self.set_font("Helvetica", "", 9)
        self.set_text_color(*TEXT_DARK)
        self.multi_cell(156, 5, sanitize(text), new_x="LMARGIN", new_y="NEXT")
        self.ln(0.5)

    def callout_box(self, label: str, text: str, bg: tuple = BG_GOLD_TINT, label_color: tuple = GOLD):
        """Highlighted callout box."""
        if self.get_y() > 260:
            self.add_page()
        y = self.get_y()
        self.set_fill_color(*bg)
        # Estimate height
        self.set_font("Helvetica", "", 9)
        lines = max(1, len(text) // 80 + 1)
        h = 8 + lines * 5
        self.rect(15, y, 180, h, "F")
        self.set_xy(19, y + 2)
        self.set_font("Helvetica", "B", 7)
        self.set_text_color(*label_color)
        self.cell(0, 4, sanitize(label.upper()))
        self.set_xy(19, y + 7)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(*TEXT_DARK)
        self.multi_cell(172, 5, sanitize(text))
        self.set_y(y + h + 3)

    def two_col_label(self, left_label: str, left_text: str, right_label: str, right_text: str, label_color: tuple = GOLD):
        """Two-column layout for at_work / in_relationships."""
        if self.get_y() > 255:
            self.add_page()
        y = self.get_y()
        col_w = 87
        for i, (label, text) in enumerate([(left_label, left_text), (right_label, right_text)]):
            x = 15 + i * (col_w + 6)
            self.set_fill_color(*BG_CARD)
            self.rect(x, y, col_w, 5, "F")
            self.set_xy(x + 3, y)
            self.set_font("Helvetica", "B", 7)
            self.set_text_color(*label_color)
            self.cell(col_w - 6, 5, sanitize(label.upper()))
            self.set_xy(x + 3, y + 6)
            self.set_font("Helvetica", "", 8)
            self.set_text_color(*TEXT_MID)
            self.multi_cell(col_w - 6, 4.5, sanitize(text))
        # Find the taller column
        self.set_y(max(self.get_y(), y + 20))
        self.ln(2)

    def meal_grid(self, meals: dict):
        """2x2 grid for meal recommendations."""
        if self.get_y() > 250:
            self.add_page()
        y = self.get_y()
        grid = [("breakfast", "lunch"), ("dinner", "snack")]
        for row_idx, (m1, m2) in enumerate(grid):
            row_y = y + row_idx * 18
            for col_idx, meal in enumerate([m1, m2]):
                x = 15 + col_idx * 93
                val = meals.get(meal, "")
                self.set_fill_color(*BG_GOLD_TINT)
                self.rect(x, row_y, 87, 16, "F")
                self.set_xy(x + 3, row_y + 1)
                self.set_font("Helvetica", "B", 7)
                self.set_text_color(*GOLD_DARK)
                self.cell(0, 4, meal.upper())
                self.set_xy(x + 3, row_y + 6)
                self.set_font("Helvetica", "", 8)
                self.set_text_color(*TEXT_DARK)
                self.multi_cell(81, 4, sanitize(val))
        self.set_y(y + 38)

    def timeline_block(self, label: str, time: str, practices: list, is_last: bool = False):
        """Single timeline entry."""
        if self.get_y() > 260:
            self.add_page()
        y = self.get_y()
        # Timeline line
        self.set_draw_color(*GOLD)
        self.set_line_width(0.5)
        if not is_last:
            self.line(22, y + 5, 22, y + 5 + len(practices) * 6 + 8)
        # Dot
        self.set_fill_color(*GOLD)
        self.circle(22, y + 3, 2.5, "F")
        # Label + time
        self.set_xy(28, y)
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(*DARK)
        self.cell(40, 6, sanitize(label))
        self.set_font("Helvetica", "", 7)
        self.set_text_color(*TEXT_LIGHT)
        self.set_fill_color(*BG_CARD)
        self.cell(40, 6, sanitize(f"  {time}"))
        self.ln(7)
        for p in practices:
            self.set_x(30)
            self.bullet(p, GOLD, indent=30)
        self.ln(2)

    def week_card(self, week_num: int, focus: str, actions: list):
        """Single week card for 30-day plan."""
        if self.get_y() > 255:
            self.add_page()
        y = self.get_y()
        self.set_fill_color(*BG_CARD)
        h = 8 + len(actions) * 6 + 4
        self.rect(15, y, 180, h, "F")
        # Week badge
        self.set_fill_color(*GOLD)
        self.circle(22, y + 5, 4, "F")
        self.set_xy(19.5, y + 2)
        self.set_font("Helvetica", "B", 7)
        self.set_text_color(*WHITE)
        self.cell(5, 6, str(week_num), align="C")
        # Focus title
        self.set_xy(30, y + 2)
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(*DARK)
        self.cell(0, 6, sanitize(f"Week {week_num}: {focus}"))
        # Actions
        for i, action in enumerate(actions):
            self.set_xy(30, y + 9 + i * 6)
            self.set_font("Helvetica", "", 8)
            self.set_text_color(*TEXT_MID)
            self.cell(4, 5, "-")
            self.set_text_color(*TEXT_DARK)
            self.multi_cell(146, 5, sanitize(action))
        self.set_y(y + h + 3)


# ── Quick Report ──


def generate_quick_report_pdf(result: dict, prakriti_data: dict | None = None) -> bytes:
    pdf = ManasReportPDF()
    pdf.alias_nb_pages()
    pdf.add_page()

    prakriti_type = result.get("prakriti_type", "Unknown")
    archetype = result.get("archetype_title", "")
    pdf.dark_hero(prakriti_type, archetype, "MANAS PRAKRITI REPORT")

    # Guna bars
    sattva = float(result.get("sattva_secondary_pct", 0))
    rajas = float(result.get("rajas_secondary_pct", 0))
    tamas = float(result.get("tamas_secondary_pct", 0))
    pdf.guna_bars_block(sattva, rajas, tamas)

    # Sattva Bala
    bala = result.get("sattva_bala", "")
    bala_labels = {"pravara": "High (Pravara)", "madhya": "Moderate (Madhya)", "avara": "Developing (Avara)"}
    pdf.callout_box("Mental Strength", bala_labels.get(bala, bala), BG_GREEN_TINT, GREEN)

    if prakriti_data:
        if prakriti_data.get("whatIs"):
            pdf.section_card(f"What is {prakriti_type}?", GOLD)
            pdf.set_x(20)
            pdf.text_block(prakriti_data["whatIs"])

        if prakriti_data.get("strengths"):
            pdf.section_card("Your Strengths", GREEN)
            for s in prakriti_data["strengths"]:
                pdf.set_x(20)
                pdf.set_font("Helvetica", "B", 9)
                pdf.set_text_color(*GREEN_DARK)
                pdf.cell(0, 5, sanitize(s["title"]), new_x="LMARGIN", new_y="NEXT")
                pdf.set_x(20)
                pdf.text_block(s["description"], color=TEXT_MID, size=8)

        if prakriti_data.get("growthAreas"):
            pdf.section_card("Growth Areas", GRAY_BLUE)
            for g in prakriti_data["growthAreas"]:
                pdf.set_x(20)
                pdf.set_font("Helvetica", "B", 9)
                pdf.set_text_color(*GRAY_BLUE)
                pdf.cell(0, 5, sanitize(g["title"]), new_x="LMARGIN", new_y="NEXT")
                pdf.set_x(20)
                pdf.text_block(g["description"], color=TEXT_MID, size=8)

        if prakriti_data.get("dailyPractices"):
            pdf.section_card("Recommended Practices", GOLD)
            for p in prakriti_data["dailyPractices"]:
                pdf.set_x(20)
                pdf.set_font("Helvetica", "B", 9)
                pdf.set_text_color(*GOLD_DARK)
                pdf.cell(0, 5, sanitize(p["title"]), new_x="LMARGIN", new_y="NEXT")
                pdf.set_x(20)
                pdf.text_block(p["description"], color=TEXT_MID, size=8)

    # CTA
    pdf.ln(6)
    y = pdf.get_y()
    if y > 260:
        pdf.add_page()
        y = pdf.get_y()
    pdf.set_fill_color(*DARK)
    pdf.rect(15, y, 180, 18, "F")
    pdf.set_xy(15, y + 3)
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(*GOLD)
    pdf.cell(180, 5, "Want deeper insights? Take the Deep Assessment", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_x(15)
    pdf.set_font("Helvetica", "", 7)
    pdf.set_text_color(180, 180, 180)
    pdf.cell(180, 5, "80 questions | 16 sub-types | Personalized wellness report | manasprakriti.anantayu.com", align="C")

    buf = io.BytesIO()
    pdf.output(buf)
    return buf.getvalue()


# ── Deep Report ──


def generate_deep_report_pdf(result: dict, report_data: dict, demographics: dict | None = None) -> bytes:
    pdf = ManasReportPDF()
    pdf.alias_nb_pages()
    pdf.add_page()

    subtype = result.get("prakriti_subtype") or result.get("prakriti_type", "Unknown")
    archetype = result.get("subtype_archetype") or result.get("archetype_title", "")
    animal = result.get("subtype_animal", "")
    badge = f"DEEP PRAKRITI REPORT  |  {animal}" if animal else "DEEP PRAKRITI REPORT"
    pdf.dark_hero(subtype, archetype, badge)

    sattva = float(result.get("sattva_secondary_pct", 0))
    rajas = float(result.get("rajas_secondary_pct", 0))
    tamas = float(result.get("tamas_secondary_pct", 0))
    pdf.guna_bars_block(sattva, rajas, tamas)

    bala = result.get("sattva_bala", "")
    bala_labels = {"pravara": "High (Pravara)", "madhya": "Moderate (Madhya)", "avara": "Developing (Avara)"}
    pdf.callout_box("Mental Strength", bala_labels.get(bala, bala), BG_GREEN_TINT, GREEN)

    # ── Who You Are ──
    who = report_data.get("who_you_are")
    if who:
        pdf.section_card("Who You Are", GOLD)
        for para in who.get("paragraphs", []):
            pdf.set_x(20)
            pdf.text_block(para)
            pdf.ln(1)

        conflict = who.get("inner_conflict")
        if conflict:
            pdf.callout_box("Your Core Tension", conflict, BG_GOLD_TINT, GOLD)

        at_work = who.get("at_work", "")
        in_rel = who.get("in_relationships", "")
        if at_work and in_rel:
            pdf.two_col_label("At Work", at_work, "In Relationships", in_rel)
        elif at_work:
            pdf.callout_box("At Work", at_work, BG_CARD, GOLD)
        elif in_rel:
            pdf.callout_box("In Relationships", in_rel, BG_CARD, GOLD)

    # ── Strengths & Shadows ──
    ss = report_data.get("strengths_and_shadows")
    if ss:
        pdf.section_card("Strengths & Shadows", GREEN)
        strengths = ss.get("strengths", [])
        shadows = ss.get("shadows", [])

        if strengths:
            pdf.mini_label("Strengths", GREEN)
            for s in strengths:
                pdf.item_row(f"{s['title']} - {s['description']}", positive=True)

        if shadows:
            pdf.ln(2)
            pdf.mini_label("Shadows", GRAY_BLUE)
            for s in shadows:
                pdf.item_row(f"{s['title']} - {s['description']}", positive=False)

    # ── Diet ──
    diet = report_data.get("diet")
    if diet:
        pdf.section_card("Personalized Diet (Ahara)", GREEN)

        increase = diet.get("increase", [])
        if increase:
            pdf.mini_label("Foods to Increase", GREEN)
            for item in increase:
                pdf.item_row(f"{item['food']} - {item['reason']}", positive=True)

        reduce = diet.get("reduce", [])
        if reduce:
            pdf.ln(1)
            pdf.mini_label("Foods to Reduce", RED)
            for item in reduce:
                pdf.item_row(f"{item['food']} - {item['reason']}", positive=False)

        meals = diet.get("meals")
        if meals:
            pdf.ln(2)
            pdf.mini_label("Sample Meals", GOLD_DARK)
            pdf.meal_grid(meals)

        note = diet.get("note")
        if note:
            pdf.callout_box("Diet Insight", note, BG_GREEN_TINT, GREEN)

    # ── Routine ──
    routine = report_data.get("routine")
    if routine:
        pdf.section_card("Daily Routine (Dinacharya)", GOLD)
        slots = [("morning", "Morning"), ("midday", "Midday"), ("evening", "Evening"), ("night", "Night")]
        for i, (key, label) in enumerate(slots):
            block = routine.get(key)
            if block:
                pdf.timeline_block(label, block.get("time", ""), block.get("practices", []), is_last=(i == len(slots) - 1))

    # ── Practices ──
    practices = report_data.get("practices")
    if practices:
        pdf.section_card("Mind & Body Practices", GREEN)

        pranayama = practices.get("pranayama")
        if pranayama:
            pdf.callout_box(
                f"Pranayama: {pranayama['name']}  ({pranayama.get('duration', '')})",
                pranayama.get("technique", ""),
                BG_GREEN_TINT, GREEN,
            )

        meditation = practices.get("meditation")
        if meditation:
            pdf.callout_box(
                f"Meditation: {meditation['name']}  ({meditation.get('duration', '')})",
                meditation.get("technique", ""),
                BG_GOLD_TINT, GOLD,
            )

        yoga = practices.get("yoga", [])
        if yoga:
            pdf.mini_label("Yoga Asanas", GREEN_DARK)
            for asana in yoga:
                pdf.bullet(f"{asana['name']} - {asana.get('benefit', '')}", GREEN)

    # ── 30-Day Plan ──
    plan = report_data.get("thirty_day_plan")
    if plan:
        pdf.section_card("Your 30-Day Transformation", GOLD)
        for i, key in enumerate(["week1", "week2", "week3", "week4"]):
            week = plan.get(key)
            if week:
                pdf.week_card(i + 1, week.get("focus", ""), week.get("actions", []))

        outcome = plan.get("expected_outcome")
        if outcome:
            pdf.callout_box("After 30 Days", outcome, BG_GREEN_TINT, GREEN)

    # ── Consultation CTA ──
    pdf.ln(4)
    y = pdf.get_y()
    if y > 255:
        pdf.add_page()
        y = pdf.get_y()
    pdf.set_fill_color(*DARK)
    pdf.rect(15, y, 180, 24, "F")
    pdf.set_xy(15, y + 3)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(*GOLD)
    pdf.cell(180, 6, "Consult Dr. Prasad Akolkar", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_x(15)
    pdf.set_font("Helvetica", "", 8)
    pdf.set_text_color(180, 180, 180)
    pdf.cell(180, 5, "PhD, Ayurvedic Psychology - University of Mumbai", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_x(15)
    pdf.set_font("Helvetica", "", 7)
    pdf.set_text_color(150, 150, 150)
    pdf.cell(180, 5, "Book a personalized 1-on-1 session at manasprakriti.anantayu.com", align="C")

    buf = io.BytesIO()
    pdf.output(buf)
    return buf.getvalue()
