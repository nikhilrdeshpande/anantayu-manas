"""PDF report generator for Manas Prakriti assessment results."""

import io
import json
from pathlib import Path

from fpdf import FPDF

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# Brand colors (RGB)
GOLD = (212, 160, 23)
DARK = (26, 26, 26)
GREEN = (123, 160, 91)
GRAY_BLUE = (91, 107, 122)
TEXT_DARK = (28, 27, 27)
TEXT_MID = (79, 70, 52)
TEXT_LIGHT = (129, 118, 98)
WHITE = (255, 255, 255)
BG_LIGHT = (252, 249, 248)
BG_CARD = (246, 243, 242)

GUNA_COLORS = {
    "sattva": GREEN,
    "rajas": GOLD,
    "tamas": GRAY_BLUE,
}


def sanitize_text(text: str) -> str:
    """Replace Unicode characters that Helvetica can't render."""
    replacements = {
        "\u2018": "'", "\u2019": "'",  # curly single quotes
        "\u201c": '"', "\u201d": '"',  # curly double quotes
        "\u2013": "-", "\u2014": "-",  # en-dash, em-dash
        "\u2026": "...",               # ellipsis
        "\u00a0": " ",                 # non-breaking space
        "\u2022": "*",                 # bullet
        "\u00b7": "*",                 # middle dot
        "\u2012": "-",                 # figure dash
        "\u2015": "-",                 # horizontal bar
        "\u200b": "",                  # zero-width space
    }
    for char, replacement in replacements.items():
        text = text.replace(char, replacement)
    # Strip any remaining non-latin1 characters
    return text.encode("latin-1", errors="replace").decode("latin-1")


class ManasReportPDF(FPDF):
    """Custom PDF with Anantayu branding."""

    def header(self):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(*GOLD)
        self.cell(0, 8, "ANANTAYU", align="L")
        self.set_text_color(*TEXT_LIGHT)
        self.set_font("Helvetica", "", 7)
        self.cell(0, 8, "manasprakriti.anantayu.com", align="R")
        self.ln(10)
        self.set_draw_color(*GOLD)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 7)
        self.set_text_color(*TEXT_LIGHT)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")

    def section_title(self, title: str, color: tuple = GOLD):
        self.ln(4)
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(*color)
        self.cell(0, 8, sanitize_text(title), new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*color)
        self.line(10, self.get_y(), 80, self.get_y())
        self.ln(4)

    def body_text(self, text: str):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(*TEXT_DARK)
        self.multi_cell(0, 5.5, sanitize_text(text))
        self.ln(2)

    def label_value(self, label: str, value: str, label_color=TEXT_LIGHT, value_color=TEXT_DARK):
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*label_color)
        self.cell(45, 5, sanitize_text(label))
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(*value_color)
        self.cell(0, 5, sanitize_text(value), new_x="LMARGIN", new_y="NEXT")

    def guna_bar(self, label: str, percent: float, color: tuple):
        y = self.get_y()
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(*color)
        self.cell(25, 6, label.upper())
        # Bar background
        self.set_fill_color(230, 230, 230)
        self.rect(35, y + 1, 120, 4, "F")
        # Bar fill
        self.set_fill_color(*color)
        bar_width = max(1, (percent / 100) * 120)
        self.rect(35, y + 1, bar_width, 4, "F")
        # Percentage
        self.set_x(158)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*TEXT_MID)
        self.cell(20, 6, f"{percent:.1f}%")
        self.ln(7)

    def bullet_item(self, text: str, bullet_color=GOLD):
        x = self.get_x()
        self.set_fill_color(*bullet_color)
        self.circle(x + 2, self.get_y() + 2.5, 1.2, "F")
        self.set_x(x + 6)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(*TEXT_DARK)
        self.multi_cell(0, 5, sanitize_text(text))
        self.ln(1)

    def check_item(self, text: str, positive: bool = True):
        self.set_font("Helvetica", "B", 9)
        color = GREEN if positive else (204, 68, 68)
        symbol = "+" if positive else "-"
        self.set_text_color(*color)
        self.cell(6, 5, symbol)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(*TEXT_DARK)
        self.multi_cell(0, 5, sanitize_text(text))
        self.ln(1)


def generate_quick_report_pdf(result: dict, prakriti_data: dict | None = None) -> bytes:
    """Generate a PDF for the quick (free) assessment result."""
    pdf = ManasReportPDF()
    pdf.alias_nb_pages()
    pdf.add_page()

    # Title
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(*DARK)
    pdf.cell(0, 12, "Manas Prakriti Report", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(*TEXT_MID)
    pdf.cell(0, 6, "Your Ayurvedic Mental Constitution", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(8)

    # Prakriti type
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(*GOLD)
    prakriti_type = result.get("prakriti_type", "Unknown")
    archetype = result.get("archetype_title", "")
    pdf.cell(0, 10, prakriti_type, align="C", new_x="LMARGIN", new_y="NEXT")
    if archetype:
        pdf.set_font("Helvetica", "I", 11)
        pdf.set_text_color(*TEXT_MID)
        pdf.cell(0, 6, archetype, align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    # Guna bars
    sattva = float(result.get("sattva_secondary_pct", 0))
    rajas = float(result.get("rajas_secondary_pct", 0))
    tamas = float(result.get("tamas_secondary_pct", 0))

    pdf.guna_bar("Sattva", sattva, GREEN)
    pdf.guna_bar("Rajas", rajas, GOLD)
    pdf.guna_bar("Tamas", tamas, GRAY_BLUE)
    pdf.ln(2)

    # Sattva Bala
    bala = result.get("sattva_bala", "")
    bala_labels = {"pravara": "High (Pravara)", "madhya": "Moderate (Madhya)", "avara": "Developing (Avara)"}
    pdf.label_value("Mental Strength:", bala_labels.get(bala, bala), value_color=GREEN)
    pdf.ln(6)

    # Raw scores
    pdf.section_title("Score Breakdown")
    for guna in ["sattva", "rajas", "tamas"]:
        yes = result.get(f"{guna}_yes", 0)
        no = result.get(f"{guna}_no", 0)
        sometimes = result.get(f"{guna}_sometimes", 0)
        primary = float(result.get(f"{guna}_primary_pct", 0))
        secondary = float(result.get(f"{guna}_secondary_pct", 0))
        pdf.label_value(
            f"  {guna.capitalize()}:",
            f"Yes: {yes}  No: {no}  Sometimes: {sometimes}  |  Primary: {primary:.1f}%  Secondary: {secondary:.1f}%",
        )

    # Prakriti data sections
    if prakriti_data:
        # What is this type
        if prakriti_data.get("whatIs"):
            pdf.section_title(f"What is {prakriti_type}?")
            pdf.body_text(prakriti_data["whatIs"])

        # Strengths
        if prakriti_data.get("strengths"):
            pdf.section_title("Your Strengths", GREEN)
            for s in prakriti_data["strengths"]:
                pdf.set_font("Helvetica", "B", 10)
                pdf.set_text_color(*TEXT_DARK)
                pdf.cell(0, 6, s["title"], new_x="LMARGIN", new_y="NEXT")
                pdf.set_font("Helvetica", "", 9)
                pdf.set_text_color(*TEXT_MID)
                pdf.multi_cell(0, 5, s["description"])
                pdf.ln(2)

        # Growth areas
        if prakriti_data.get("growthAreas"):
            pdf.section_title("Growth Areas", GRAY_BLUE)
            for g in prakriti_data["growthAreas"]:
                pdf.set_font("Helvetica", "B", 10)
                pdf.set_text_color(*TEXT_DARK)
                pdf.cell(0, 6, g["title"], new_x="LMARGIN", new_y="NEXT")
                pdf.set_font("Helvetica", "", 9)
                pdf.set_text_color(*TEXT_MID)
                pdf.multi_cell(0, 5, g["description"])
                pdf.ln(2)

        # Daily practices
        if prakriti_data.get("dailyPractices"):
            pdf.section_title("Recommended Daily Practices", GOLD)
            for p in prakriti_data["dailyPractices"]:
                pdf.set_font("Helvetica", "B", 10)
                pdf.set_text_color(*TEXT_DARK)
                pdf.cell(0, 6, p["title"], new_x="LMARGIN", new_y="NEXT")
                pdf.set_font("Helvetica", "", 9)
                pdf.set_text_color(*TEXT_MID)
                pdf.multi_cell(0, 5, p["description"])
                pdf.ln(2)

    # Footer CTA
    pdf.ln(8)
    pdf.set_fill_color(*BG_CARD)
    pdf.rect(10, pdf.get_y(), 190, 20, "F")
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(*GOLD)
    pdf.cell(0, 10, "Want deeper insights? Take the Deep Assessment at manasprakriti.anantayu.com", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 8)
    pdf.set_text_color(*TEXT_LIGHT)
    pdf.cell(0, 6, "80-question deep assessment with 16 personality sub-types and personalized wellness report", align="C")

    buffer = io.BytesIO()
    pdf.output(buffer)
    return buffer.getvalue()


def generate_deep_report_pdf(result: dict, report_data: dict, demographics: dict | None = None) -> bytes:
    """Generate a PDF for the deep assessment with structured report data."""
    pdf = ManasReportPDF()
    pdf.alias_nb_pages()
    pdf.add_page()

    # Title
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(*DARK)
    pdf.cell(0, 12, "Deep Prakriti Report", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(*TEXT_MID)
    pdf.cell(0, 6, "Comprehensive Ayurvedic Mental Constitution Analysis", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(8)

    # Sub-type card
    subtype = result.get("prakriti_subtype") or result.get("prakriti_type", "Unknown")
    archetype = result.get("subtype_archetype") or result.get("archetype_title", "")
    animal = result.get("subtype_animal", "")

    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(*GOLD)
    pdf.cell(0, 10, subtype, align="C", new_x="LMARGIN", new_y="NEXT")
    if archetype:
        pdf.set_font("Helvetica", "I", 11)
        pdf.set_text_color(*TEXT_MID)
        label = f"{archetype}  |  {animal}" if animal else archetype
        pdf.cell(0, 6, label, align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    # Guna bars
    sattva = float(result.get("sattva_secondary_pct", 0))
    rajas = float(result.get("rajas_secondary_pct", 0))
    tamas = float(result.get("tamas_secondary_pct", 0))
    pdf.guna_bar("Sattva", sattva, GREEN)
    pdf.guna_bar("Rajas", rajas, GOLD)
    pdf.guna_bar("Tamas", tamas, GRAY_BLUE)

    bala = result.get("sattva_bala", "")
    bala_labels = {"pravara": "High (Pravara)", "madhya": "Moderate (Madhya)", "avara": "Developing (Avara)"}
    pdf.label_value("Mental Strength:", bala_labels.get(bala, bala), value_color=GREEN)
    pdf.ln(4)

    # ── Section 1: Who You Are ──
    who = report_data.get("who_you_are")
    if who:
        pdf.section_title("Who You Are")
        for para in who.get("paragraphs", []):
            pdf.body_text(para)

        conflict = who.get("inner_conflict")
        if conflict:
            pdf.set_fill_color(253, 246, 227)
            y = pdf.get_y()
            pdf.rect(10, y, 190, 12, "F")
            pdf.set_font("Helvetica", "B", 8)
            pdf.set_text_color(*GOLD)
            pdf.cell(0, 5, "YOUR CORE TENSION")
            pdf.ln(5)
            pdf.set_font("Helvetica", "I", 9)
            pdf.set_text_color(*TEXT_DARK)
            pdf.multi_cell(0, 5, conflict)
            pdf.ln(4)

        at_work = who.get("at_work")
        in_rel = who.get("in_relationships")
        if at_work:
            pdf.set_font("Helvetica", "B", 9)
            pdf.set_text_color(*GOLD)
            pdf.cell(0, 5, "AT WORK", new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Helvetica", "", 9)
            pdf.set_text_color(*TEXT_MID)
            pdf.multi_cell(0, 5, at_work)
            pdf.ln(2)
        if in_rel:
            pdf.set_font("Helvetica", "B", 9)
            pdf.set_text_color(*GOLD)
            pdf.cell(0, 5, "IN RELATIONSHIPS", new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Helvetica", "", 9)
            pdf.set_text_color(*TEXT_MID)
            pdf.multi_cell(0, 5, in_rel)
            pdf.ln(2)

    # ── Section 2: Strengths & Shadows ──
    ss = report_data.get("strengths_and_shadows")
    if ss:
        pdf.section_title("Your Strengths & Shadows")
        strengths = ss.get("strengths", [])
        shadows = ss.get("shadows", [])

        if strengths:
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(*GREEN)
            pdf.cell(0, 6, "STRENGTHS", new_x="LMARGIN", new_y="NEXT")
            for s in strengths:
                pdf.check_item(f"{s['title']} - {s['description']}", positive=True)

        if shadows:
            pdf.ln(2)
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(*GRAY_BLUE)
            pdf.cell(0, 6, "SHADOWS", new_x="LMARGIN", new_y="NEXT")
            for s in shadows:
                pdf.check_item(f"{s['title']} - {s['description']}", positive=False)

    # ── Section 3: Diet ──
    diet = report_data.get("diet")
    if diet:
        pdf.section_title("Personalized Diet (Ahara)", GREEN)

        increase = diet.get("increase", [])
        if increase:
            pdf.set_font("Helvetica", "B", 9)
            pdf.set_text_color(*GREEN)
            pdf.cell(0, 6, "FOODS TO INCREASE", new_x="LMARGIN", new_y="NEXT")
            for item in increase:
                pdf.check_item(f"{item['food']} - {item['reason']}", positive=True)

        reduce = diet.get("reduce", [])
        if reduce:
            pdf.ln(2)
            pdf.set_font("Helvetica", "B", 9)
            pdf.set_text_color(204, 68, 68)
            pdf.cell(0, 6, "FOODS TO REDUCE", new_x="LMARGIN", new_y="NEXT")
            for item in reduce:
                pdf.check_item(f"{item['food']} - {item['reason']}", positive=False)

        meals = diet.get("meals")
        if meals:
            pdf.ln(3)
            pdf.set_font("Helvetica", "B", 9)
            pdf.set_text_color(*GOLD)
            pdf.cell(0, 6, "SAMPLE MEALS", new_x="LMARGIN", new_y="NEXT")
            for meal_name in ["breakfast", "lunch", "dinner", "snack"]:
                val = meals.get(meal_name, "")
                if val:
                    pdf.label_value(f"  {meal_name.capitalize()}:", val)

        note = diet.get("note")
        if note:
            pdf.ln(2)
            pdf.set_font("Helvetica", "I", 8)
            pdf.set_text_color(*TEXT_LIGHT)
            pdf.multi_cell(0, 4.5, note)

    # ── Section 4: Daily Routine ──
    routine = report_data.get("routine")
    if routine:
        pdf.section_title("Daily Routine (Dinacharya)", GOLD)
        for slot_key, slot_label in [("morning", "Morning"), ("midday", "Midday"), ("evening", "Evening"), ("night", "Night")]:
            block = routine.get(slot_key)
            if not block:
                continue
            time_str = block.get("time", "")
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(*DARK)
            pdf.cell(50, 6, slot_label)
            pdf.set_font("Helvetica", "", 8)
            pdf.set_text_color(*TEXT_LIGHT)
            pdf.cell(0, 6, time_str, new_x="LMARGIN", new_y="NEXT")
            for practice in block.get("practices", []):
                pdf.bullet_item(practice)
            pdf.ln(2)

    # ── Section 5: Practices ──
    practices = report_data.get("practices")
    if practices:
        pdf.section_title("Mind & Body Practices", GREEN)

        pranayama = practices.get("pranayama")
        if pranayama:
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(*DARK)
            pdf.cell(0, 6, f"Pranayama: {pranayama['name']}  ({pranayama.get('duration', '')})", new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Helvetica", "", 9)
            pdf.set_text_color(*TEXT_MID)
            pdf.multi_cell(0, 5, pranayama.get("technique", ""))
            pdf.ln(3)

        meditation = practices.get("meditation")
        if meditation:
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(*DARK)
            pdf.cell(0, 6, f"Meditation: {meditation['name']}  ({meditation.get('duration', '')})", new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Helvetica", "", 9)
            pdf.set_text_color(*TEXT_MID)
            pdf.multi_cell(0, 5, meditation.get("technique", ""))
            pdf.ln(3)

        yoga = practices.get("yoga", [])
        if yoga:
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(*DARK)
            pdf.cell(0, 6, "Yoga Asanas", new_x="LMARGIN", new_y="NEXT")
            for asana in yoga:
                pdf.bullet_item(f"{asana['name']} - {asana.get('benefit', '')}", GREEN)

    # ── Section 6: 30-Day Plan ──
    plan = report_data.get("thirty_day_plan")
    if plan:
        pdf.section_title("Your 30-Day Transformation", GOLD)
        for week_key, week_label in [("week1", "Week 1"), ("week2", "Week 2"), ("week3", "Week 3"), ("week4", "Week 4")]:
            week = plan.get(week_key)
            if not week:
                continue
            focus = week.get("focus", "")
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(*DARK)
            pdf.cell(0, 6, f"{week_label}: {focus}", new_x="LMARGIN", new_y="NEXT")
            for action in week.get("actions", []):
                pdf.bullet_item(action)
            pdf.ln(1)

        outcome = plan.get("expected_outcome")
        if outcome:
            pdf.ln(2)
            pdf.set_fill_color(239, 245, 235)
            y = pdf.get_y()
            pdf.rect(10, y, 190, 14, "F")
            pdf.set_font("Helvetica", "B", 8)
            pdf.set_text_color(*GREEN)
            pdf.cell(0, 5, "AFTER 30 DAYS")
            pdf.ln(5)
            pdf.set_font("Helvetica", "", 9)
            pdf.set_text_color(*TEXT_DARK)
            pdf.multi_cell(0, 5, outcome)

    # Consultation CTA
    pdf.ln(10)
    pdf.set_fill_color(*DARK)
    pdf.rect(10, pdf.get_y(), 190, 22, "F")
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(*GOLD)
    y = pdf.get_y()
    pdf.set_xy(10, y + 3)
    pdf.cell(190, 6, "Consult Dr. Prasad Akolkar", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 8)
    pdf.set_text_color(*WHITE)
    pdf.cell(190, 6, "PhD, Ayurvedic Psychology - Book a personalized 1-on-1 session at manasprakriti.anantayu.com", align="C")

    buffer = io.BytesIO()
    pdf.output(buffer)
    return buffer.getvalue()
