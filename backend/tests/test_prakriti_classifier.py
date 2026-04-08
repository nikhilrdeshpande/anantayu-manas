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
