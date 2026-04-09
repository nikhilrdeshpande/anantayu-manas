from decimal import Decimal

from app.services.prakriti_classifier import PrakritiClassifier


class TestPrakritiClassifier:
    def setup_method(self):
        self.classifier = PrakritiClassifier()

    def test_single_sattva(self):
        scores = {"sattva": Decimal("90"), "rajas": Decimal("30"), "tamas": Decimal("10")}
        result = self.classifier.classify("sattva", "rajas", scores)
        assert result["prakriti_type"] == "Sattvika"
        assert result["archetype_title"] == "The Harmoniser"

    def test_single_rajas(self):
        scores = {"sattva": Decimal("20"), "rajas": Decimal("80"), "tamas": Decimal("10")}
        result = self.classifier.classify("rajas", "sattva", scores)
        assert result["prakriti_type"] == "Rajasika"
        assert result["archetype_title"] == "The Dynamo"

    def test_single_tamas(self):
        scores = {"sattva": Decimal("10"), "rajas": Decimal("15"), "tamas": Decimal("80")}
        result = self.classifier.classify("tamas", "rajas", scores)
        assert result["prakriti_type"] == "Tamasika"
        assert result["archetype_title"] == "The Anchor"

    def test_dual_sattva_rajas(self):
        scores = {"sattva": Decimal("85"), "rajas": Decimal("80"), "tamas": Decimal("10")}
        result = self.classifier.classify("sattva", "rajas", scores)
        assert result["prakriti_type"] == "Sattva-Rajasika"
        assert result["archetype_title"] == "The Enlightened Leader"

    def test_dual_rajas_sattva(self):
        scores = {"sattva": Decimal("75"), "rajas": Decimal("80"), "tamas": Decimal("10")}
        result = self.classifier.classify("rajas", "sattva", scores)
        assert result["prakriti_type"] == "Rajo-Sattvika"
        assert result["archetype_title"] == "The Passionate Visionary"

    def test_dual_sattva_tamas(self):
        scores = {"sattva": Decimal("70"), "rajas": Decimal("20"), "tamas": Decimal("65")}
        result = self.classifier.classify("sattva", "tamas", scores)
        assert result["prakriti_type"] == "Sattva-Tamasika"
        assert result["archetype_title"] == "The Reflective Sage"

    def test_dual_rajas_tamas(self):
        scores = {"sattva": Decimal("10"), "rajas": Decimal("75"), "tamas": Decimal("70")}
        result = self.classifier.classify("rajas", "tamas", scores)
        assert result["prakriti_type"] == "Rajo-Tamasika"
        assert result["archetype_title"] == "The Restless Warrior"

    def test_gap_above_threshold_gives_single(self):
        """Gap of 15 > threshold of 10 -> single type, not dual."""
        scores = {"sattva": Decimal("85"), "rajas": Decimal("70"), "tamas": Decimal("10")}
        result = self.classifier.classify("sattva", "rajas", scores)
        assert result["prakriti_type"] == "Sattvika"


class TestSubtypeClassification:
    def setup_method(self):
        self.classifier = PrakritiClassifier()

    def test_sattva_brahma_subtype(self):
        """High satya + dharma + medha -> Brahma Kaya."""
        bhava_scores = {"satya": 3, "dharma": 2, "medha": 2, "jnana": 1, "viveka": 1}
        result = self.classifier.classify_subtype("sattva", bhava_scores)
        assert result is not None
        assert result["subtype_key"] == "brahma"
        assert result["subtype_name"] == "Brahma Kaya"
        assert result["subtype_archetype"] == "The Creator"

    def test_sattva_varuna_subtype(self):
        """High kshama + shaucha + akrodha -> Varuna Kaya."""
        bhava_scores = {"kshama": 3, "shaucha": 2, "akrodha": 2, "santosha": 1, "titiksha": 1}
        result = self.classifier.classify_subtype("sattva", bhava_scores)
        assert result is not None
        assert result["subtype_key"] == "varuna"
        assert result["subtype_name"] == "Varuna Kaya"

    def test_rajas_asura_subtype(self):
        """High ahamkara + mana + aishwarya -> Asura Kaya."""
        bhava_scores = {"ahamkara": 3, "mana": 2, "aishwarya": 2, "niyantrana": 1, "ahamkara_pradhana": 1}
        result = self.classifier.classify_subtype("rajas", bhava_scores)
        assert result is not None
        assert result["subtype_key"] == "asura"
        assert result["subtype_name"] == "Asura Kaya"

    def test_rajas_sarpa_subtype(self):
        """High krodha + krodha_bahya + vaira -> Sarpa Kaya."""
        bhava_scores = {"krodha": 3, "krodha_bahya": 2, "krodha_vahana": 2, "vaira": 1, "dvesha": 1}
        result = self.classifier.classify_subtype("rajas", bhava_scores)
        assert result is not None
        assert result["subtype_key"] == "sarpa"

    def test_tamas_pashu_subtype(self):
        """High nidra + alasya + tandra -> Pashu Kaya."""
        bhava_scores = {"nidra": 3, "alasya": 2, "tandra": 2, "sthaulya": 1, "dirghsutrata": 1}
        result = self.classifier.classify_subtype("tamas", bhava_scores)
        assert result is not None
        assert result["subtype_key"] == "pashu"
        assert result["subtype_name"] == "Pashu Kaya"

    def test_tamas_matsya_subtype(self):
        """High bhaya + bheerata + paradheenata -> Matsya Kaya."""
        bhava_scores = {"bhaya": 3, "bheerata": 2, "paradheenata": 2, "nirasha": 1, "udaseenata": 1}
        result = self.classifier.classify_subtype("tamas", bhava_scores)
        assert result is not None
        assert result["subtype_key"] == "matsya"

    def test_subtype_no_match_returns_none(self):
        """No bhava scores -> None."""
        result = self.classifier.classify_subtype("sattva", {})
        assert result is None

    def test_subtype_wrong_guna_returns_none(self):
        """Sattva bhavas don't match rajas sub-types."""
        bhava_scores = {"satya": 3, "dharma": 2}
        result = self.classifier.classify_subtype("rajas", bhava_scores)
        # Should still return a result (picks best rajas match), but score will be 0
        # because satya/dharma aren't in any rajas cluster
        assert result is None

    def test_subtype_tiebreaker_picks_first_highest(self):
        """When two sub-types score equally, picks the one with higher total."""
        # Scores that favor kaubera: tyaga, dana, aparigraha
        bhava_scores = {"tyaga": 2, "dana": 2, "aparigraha": 1, "kritajna": 1, "samata": 1}
        result = self.classifier.classify_subtype("sattva", bhava_scores)
        assert result is not None
        assert result["subtype_key"] == "kaubera"
