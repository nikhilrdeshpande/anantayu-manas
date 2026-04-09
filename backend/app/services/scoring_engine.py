from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP

from app.services.prakriti_classifier import PrakritiClassifier


@dataclass
class ScoringResult:
    sattva_yes: int
    sattva_no: int
    sattva_sometimes: int
    rajas_yes: int
    rajas_no: int
    rajas_sometimes: int
    tamas_yes: int
    tamas_no: int
    tamas_sometimes: int

    sattva_primary_pct: Decimal
    rajas_primary_pct: Decimal
    tamas_primary_pct: Decimal

    sattva_secondary_pct: Decimal
    rajas_secondary_pct: Decimal
    tamas_secondary_pct: Decimal

    primary_dominant_guna: str
    secondary_dominant_guna: str | None
    prakriti_type: str
    prakriti_subtype: str | None
    archetype_title: str | None
    subtype_key: str | None
    subtype_archetype: str | None
    subtype_animal: str | None
    bhava_scores: dict[str, int] | None
    sattva_bala: str


class ScoringEngine:
    """Implements the Manas Prakriti scoring algorithm.

    SOMETIMES conversion ratios:
    - Sattva & Tamas (dormant gunas): 33% -> YES, 67% -> NO
    - Rajas (active guna): 67% -> YES, 33% -> NO
    """

    DORMANT_YES_RATIO = Decimal("0.33")  # Sattva & Tamas
    DORMANT_NO_RATIO = Decimal("0.67")
    ACTIVE_YES_RATIO = Decimal("0.67")   # Rajas
    ACTIVE_NO_RATIO = Decimal("0.33")

    # Total questions per section by assessment type
    SECTION_TOTALS = {
        "quick": {"sattva": 10, "rajas": 10, "tamas": 5},
        "full": {"sattva": 30, "rajas": 30, "tamas": 20},
        "deep": {"sattva": 30, "rajas": 30, "tamas": 20},
    }

    def score(self, answers: list[dict], assessment_type: str = "quick") -> ScoringResult:
        """Score a list of answers and return a complete ScoringResult.

        Args:
            answers: List of dicts with 'section' and 'answer' keys.
                     section: 'sattva', 'rajas', or 'tamas'
                     answer: 'YES', 'NO', or 'SOMETIMES'
                     bhava_tag: (optional) bhava tag for sub-type classification
            assessment_type: 'quick' or 'full'

        Returns:
            ScoringResult with all computed fields.
        """
        totals = self.SECTION_TOTALS[assessment_type]

        # Step 1: Count raw answers per section
        counts = {
            "sattva": {"YES": 0, "NO": 0, "SOMETIMES": 0},
            "rajas": {"YES": 0, "NO": 0, "SOMETIMES": 0},
            "tamas": {"YES": 0, "NO": 0, "SOMETIMES": 0},
        }
        # Track per-bhava YES scores for sub-type classification
        bhava_scores: dict[str, int] = {}
        for ans in answers:
            section = ans["section"].lower()
            answer = ans["answer"].upper()
            if section in counts and answer in counts[section]:
                counts[section][answer] += 1
            # Track bhava-level scores (YES=1, SOMETIMES=0.5 rounded, NO=0)
            bhava_tag = ans.get("bhava_tag")
            if bhava_tag and answer == "YES":
                bhava_scores[bhava_tag] = bhava_scores.get(bhava_tag, 0) + 1
            elif bhava_tag and answer == "SOMETIMES":
                bhava_scores[bhava_tag] = bhava_scores.get(bhava_tag, 0) + 1

        sattva_yes = counts["sattva"]["YES"]
        sattva_no = counts["sattva"]["NO"]
        sattva_sometimes = counts["sattva"]["SOMETIMES"]
        rajas_yes = counts["rajas"]["YES"]
        rajas_no = counts["rajas"]["NO"]
        rajas_sometimes = counts["rajas"]["SOMETIMES"]
        tamas_yes = counts["tamas"]["YES"]
        tamas_no = counts["tamas"]["NO"]
        tamas_sometimes = counts["tamas"]["SOMETIMES"]

        # Step 2: Calculate primary percentages (YES count / total * 100)
        sattva_primary_pct = self._pct(sattva_yes, totals["sattva"])
        rajas_primary_pct = self._pct(rajas_yes, totals["rajas"])
        tamas_primary_pct = self._pct(tamas_yes, totals["tamas"])

        # Step 3: Convert SOMETIMES answers
        # Sattva (dormant): 33% -> YES, 67% -> NO
        sattva_adj_yes = Decimal(sattva_yes) + Decimal(sattva_sometimes) * self.DORMANT_YES_RATIO
        sattva_adj_no = Decimal(sattva_no) + Decimal(sattva_sometimes) * self.DORMANT_NO_RATIO

        # Rajas (active): 67% -> YES, 33% -> NO
        rajas_adj_yes = Decimal(rajas_yes) + Decimal(rajas_sometimes) * self.ACTIVE_YES_RATIO
        rajas_adj_no = Decimal(rajas_no) + Decimal(rajas_sometimes) * self.ACTIVE_NO_RATIO

        # Tamas (dormant): 33% -> YES, 67% -> NO
        tamas_adj_yes = Decimal(tamas_yes) + Decimal(tamas_sometimes) * self.DORMANT_YES_RATIO
        tamas_adj_no = Decimal(tamas_no) + Decimal(tamas_sometimes) * self.DORMANT_NO_RATIO

        # Step 4: Recalculate secondary percentages with adjusted YES counts
        sattva_secondary_pct = self._pct(sattva_adj_yes, totals["sattva"])
        rajas_secondary_pct = self._pct(rajas_adj_yes, totals["rajas"])
        tamas_secondary_pct = self._pct(tamas_adj_yes, totals["tamas"])

        # Step 5: Find dominant gunas
        guna_scores = {
            "sattva": sattva_secondary_pct,
            "rajas": rajas_secondary_pct,
            "tamas": tamas_secondary_pct,
        }
        sorted_gunas = sorted(guna_scores.items(), key=lambda x: x[1], reverse=True)
        primary_dominant_guna = sorted_gunas[0][0]

        # Second highest is secondary if it differs from primary
        secondary_dominant_guna: str | None = None
        if len(sorted_gunas) > 1:
            # Only set secondary if it's meaningfully different (not zero)
            if sorted_gunas[1][1] > 0:
                secondary_dominant_guna = sorted_gunas[1][0]

        # Step 6: Classify prakriti type
        classifier = PrakritiClassifier()
        classification = classifier.classify(
            primary_dominant_guna, secondary_dominant_guna, guna_scores
        )

        # Step 6b: Classify sub-type for full assessments
        if assessment_type in ("full", "deep") and bhava_scores:
            subtype_result = classifier.classify_subtype(
                primary_dominant_guna, bhava_scores
            )
            if subtype_result:
                classification["prakriti_subtype"] = subtype_result["subtype_name"]
                classification["subtype_key"] = subtype_result["subtype_key"]
                classification["subtype_archetype"] = subtype_result["subtype_archetype"]
                classification["subtype_animal"] = subtype_result["subtype_animal"]

        # Step 7: Calculate sattva bala
        sattva_bala = self._sattva_bala(sattva_secondary_pct)

        return ScoringResult(
            sattva_yes=sattva_yes,
            sattva_no=sattva_no,
            sattva_sometimes=sattva_sometimes,
            rajas_yes=rajas_yes,
            rajas_no=rajas_no,
            rajas_sometimes=rajas_sometimes,
            tamas_yes=tamas_yes,
            tamas_no=tamas_no,
            tamas_sometimes=tamas_sometimes,
            sattva_primary_pct=sattva_primary_pct,
            rajas_primary_pct=rajas_primary_pct,
            tamas_primary_pct=tamas_primary_pct,
            sattva_secondary_pct=sattva_secondary_pct,
            rajas_secondary_pct=rajas_secondary_pct,
            tamas_secondary_pct=tamas_secondary_pct,
            primary_dominant_guna=primary_dominant_guna,
            secondary_dominant_guna=secondary_dominant_guna,
            prakriti_type=classification["prakriti_type"],
            prakriti_subtype=classification.get("prakriti_subtype"),
            archetype_title=classification.get("archetype_title"),
            subtype_key=classification.get("subtype_key"),
            subtype_archetype=classification.get("subtype_archetype"),
            subtype_animal=classification.get("subtype_animal"),
            bhava_scores=bhava_scores if bhava_scores else None,
            sattva_bala=sattva_bala,
        )

    @staticmethod
    def _pct(count, total: int) -> Decimal:
        """Calculate percentage rounded to 2 decimal places."""
        if total == 0:
            return Decimal("0.00")
        return (Decimal(str(count)) / Decimal(str(total)) * Decimal("100")).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )

    @staticmethod
    def _sattva_bala(sattva_pct: Decimal) -> str:
        """Determine sattva bala level.

        >= 66% -> Pravara (superior)
        >= 33% -> Madhya (moderate)
        < 33%  -> Avara (inferior)
        """
        if sattva_pct >= Decimal("66"):
            return "pravara"
        elif sattva_pct >= Decimal("33"):
            return "madhya"
        else:
            return "avara"
