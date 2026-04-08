from decimal import Decimal

from app.services.scoring_engine import ScoringEngine


def _make_answers(sattva_answers: list[str], rajas_answers: list[str], tamas_answers: list[str]) -> list[dict]:
    """Helper to build answer list from per-section answer lists."""
    answers = []
    for ans in sattva_answers:
        answers.append({"section": "sattva", "answer": ans})
    for ans in rajas_answers:
        answers.append({"section": "rajas", "answer": ans})
    for ans in tamas_answers:
        answers.append({"section": "tamas", "answer": ans})
    return answers


class TestScoringEngine:
    def setup_method(self):
        self.engine = ScoringEngine()

    def test_all_yes_sattva_gives_sattvika_pravara(self):
        """All YES in sattva, all NO elsewhere -> Sattvika prakriti, Pravara sattva bala."""
        answers = _make_answers(
            ["YES"] * 10,
            ["NO"] * 10,
            ["NO"] * 5,
        )
        result = self.engine.score(answers, "quick")

        assert result.sattva_yes == 10
        assert result.rajas_yes == 0
        assert result.tamas_yes == 0
        assert result.sattva_primary_pct == Decimal("100.00")
        assert result.rajas_primary_pct == Decimal("0.00")
        assert result.tamas_primary_pct == Decimal("0.00")
        assert result.sattva_secondary_pct == Decimal("100.00")
        assert result.primary_dominant_guna == "sattva"
        assert result.prakriti_type == "Sattvika"
        assert result.sattva_bala == "pravara"

    def test_all_yes_rajas_gives_rajasika(self):
        """All YES in rajas, all NO elsewhere -> Rajasika prakriti."""
        answers = _make_answers(
            ["NO"] * 10,
            ["YES"] * 10,
            ["NO"] * 5,
        )
        result = self.engine.score(answers, "quick")

        assert result.rajas_yes == 10
        assert result.rajas_primary_pct == Decimal("100.00")
        assert result.primary_dominant_guna == "rajas"
        assert result.prakriti_type == "Rajasika"
        assert result.sattva_bala == "avara"

    def test_all_yes_tamas_gives_tamasika(self):
        """All YES in tamas, all NO elsewhere -> Tamasika prakriti."""
        answers = _make_answers(
            ["NO"] * 10,
            ["NO"] * 10,
            ["YES"] * 5,
        )
        result = self.engine.score(answers, "quick")

        assert result.tamas_yes == 5
        assert result.tamas_primary_pct == Decimal("100.00")
        assert result.primary_dominant_guna == "tamas"
        assert result.prakriti_type == "Tamasika"

    def test_mixed_yes_dual_type(self):
        """High sattva and rajas, low tamas -> dual Sattva-Rajasika type."""
        # 9 YES sattva (90%), 8 YES rajas (80%), 0 YES tamas (0%)
        # Gap = 10%, which is within dual threshold
        answers = _make_answers(
            ["YES"] * 9 + ["NO"] * 1,
            ["YES"] * 8 + ["NO"] * 2,
            ["NO"] * 5,
        )
        result = self.engine.score(answers, "quick")

        assert result.sattva_primary_pct == Decimal("90.00")
        assert result.rajas_primary_pct == Decimal("80.00")
        assert result.primary_dominant_guna == "sattva"
        assert result.prakriti_type == "Sattva-Rajasika"
        assert result.archetype_title == "The Enlightened Leader"
        assert result.sattva_bala == "pravara"

    def test_sometimes_conversion_dormant_ratio(self):
        """Sattva SOMETIMES: 33% -> YES, 67% -> NO."""
        # 5 YES, 0 NO, 5 SOMETIMES for sattva. Total = 10.
        # Primary pct = 5/10 = 50%
        # After conversion: adjusted_yes = 5 + 5*0.33 = 6.65
        # Secondary pct = 6.65/10 * 100 = 66.50%
        answers = _make_answers(
            ["YES"] * 5 + ["SOMETIMES"] * 5,
            ["NO"] * 10,
            ["NO"] * 5,
        )
        result = self.engine.score(answers, "quick")

        assert result.sattva_yes == 5
        assert result.sattva_sometimes == 5
        assert result.sattva_primary_pct == Decimal("50.00")
        assert result.sattva_secondary_pct == Decimal("66.50")
        assert result.sattva_bala == "pravara"

    def test_sometimes_conversion_active_ratio(self):
        """Rajas SOMETIMES: 67% -> YES, 33% -> NO."""
        # 5 YES, 0 NO, 5 SOMETIMES for rajas. Total = 10.
        # Primary pct = 5/10 = 50%
        # After conversion: adjusted_yes = 5 + 5*0.67 = 8.35
        # Secondary pct = 8.35/10 * 100 = 83.50%
        answers = _make_answers(
            ["NO"] * 10,
            ["YES"] * 5 + ["SOMETIMES"] * 5,
            ["NO"] * 5,
        )
        result = self.engine.score(answers, "quick")

        assert result.rajas_yes == 5
        assert result.rajas_sometimes == 5
        assert result.rajas_primary_pct == Decimal("50.00")
        assert result.rajas_secondary_pct == Decimal("83.50")

    def test_equal_scores_picks_first_alphabetically_or_by_order(self):
        """When two gunas have equal secondary pct, the sorted order determines winner."""
        # 5 YES sattva (50%), 5 YES rajas (50%), 0 YES tamas
        # After conversion (no SOMETIMES), both remain 50%.
        # sorted() is stable, so first by descending value, then by insertion order.
        answers = _make_answers(
            ["YES"] * 5 + ["NO"] * 5,
            ["YES"] * 5 + ["NO"] * 5,
            ["NO"] * 5,
        )
        result = self.engine.score(answers, "quick")

        assert result.sattva_secondary_pct == Decimal("50.00")
        assert result.rajas_secondary_pct == Decimal("50.00")
        # Both are equal; dual type with gap=0 <= 10
        assert "Sattva" in result.prakriti_type or "Rajo" in result.prakriti_type
        assert result.sattva_bala == "madhya"

    def test_full_assessment_totals(self):
        """Full assessment uses totals of 30/30/20."""
        answers = _make_answers(
            ["YES"] * 30,
            ["NO"] * 30,
            ["NO"] * 20,
        )
        result = self.engine.score(answers, "full")

        assert result.sattva_primary_pct == Decimal("100.00")
        assert result.rajas_primary_pct == Decimal("0.00")
        assert result.tamas_primary_pct == Decimal("0.00")
        assert result.prakriti_type == "Sattvika"
        assert result.sattva_bala == "pravara"

    def test_sattva_bala_madhya(self):
        """Sattva between 33% and 66% -> madhya."""
        answers = _make_answers(
            ["YES"] * 5 + ["NO"] * 5,
            ["NO"] * 10,
            ["NO"] * 5,
        )
        result = self.engine.score(answers, "quick")
        assert result.sattva_secondary_pct == Decimal("50.00")
        assert result.sattva_bala == "madhya"

    def test_sattva_bala_avara(self):
        """Sattva below 33% -> avara."""
        answers = _make_answers(
            ["YES"] * 2 + ["NO"] * 8,
            ["NO"] * 10,
            ["NO"] * 5,
        )
        result = self.engine.score(answers, "quick")
        assert result.sattva_secondary_pct == Decimal("20.00")
        assert result.sattva_bala == "avara"

    def test_all_sometimes(self):
        """All SOMETIMES answers are correctly converted."""
        answers = _make_answers(
            ["SOMETIMES"] * 10,
            ["SOMETIMES"] * 10,
            ["SOMETIMES"] * 5,
        )
        result = self.engine.score(answers, "quick")

        # Sattva: 0 + 10*0.33 = 3.3 -> 33.00%
        assert result.sattva_secondary_pct == Decimal("33.00")
        # Rajas: 0 + 10*0.67 = 6.7 -> 67.00%
        assert result.rajas_secondary_pct == Decimal("67.00")
        # Tamas: 0 + 5*0.33 = 1.65 -> 33.00%
        assert result.tamas_secondary_pct == Decimal("33.00")
        assert result.primary_dominant_guna == "rajas"
