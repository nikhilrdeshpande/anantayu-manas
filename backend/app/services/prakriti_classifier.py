import json
from decimal import Decimal
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# Threshold: if the gap between top two gunas is <= this %, it's a dual type
DUAL_TYPE_THRESHOLD = Decimal("10")


class PrakritiClassifier:
    """Maps dominant guna combinations to prakriti types and archetype titles."""

    # The 7 prakriti types
    SINGLE_TYPES = {
        "sattva": {
            "prakriti_type": "Sattvika",
            "archetype_title": "The Harmoniser",
        },
        "rajas": {
            "prakriti_type": "Rajasika",
            "archetype_title": "The Dynamo",
        },
        "tamas": {
            "prakriti_type": "Tamasika",
            "archetype_title": "The Anchor",
        },
    }

    DUAL_TYPES = {
        ("sattva", "rajas"): {
            "prakriti_type": "Sattva-Rajasika",
            "archetype_title": "The Enlightened Leader",
        },
        ("sattva", "tamas"): {
            "prakriti_type": "Sattva-Tamasika",
            "archetype_title": "The Reflective Sage",
        },
        ("rajas", "sattva"): {
            "prakriti_type": "Rajo-Sattvika",
            "archetype_title": "The Passionate Visionary",
        },
        ("rajas", "tamas"): {
            "prakriti_type": "Rajo-Tamasika",
            "archetype_title": "The Restless Warrior",
        },
    }

    def classify(
        self,
        primary: str,
        secondary: str | None,
        guna_scores: dict[str, Decimal],
    ) -> dict:
        """Classify prakriti based on dominant gunas and their scores.

        Returns dict with prakriti_type, prakriti_subtype, archetype_title.
        """
        sorted_gunas = sorted(guna_scores.items(), key=lambda x: x[1], reverse=True)
        top = sorted_gunas[0]
        runner_up = sorted_gunas[1] if len(sorted_gunas) > 1 else None

        # Check if dual type: gap between top two is within threshold
        is_dual = False
        if runner_up and runner_up[1] > 0:
            gap = top[1] - runner_up[1]
            if gap <= DUAL_TYPE_THRESHOLD:
                is_dual = True

        if is_dual and runner_up:
            key = (top[0], runner_up[0])
            if key in self.DUAL_TYPES:
                info = self.DUAL_TYPES[key]
                return {
                    "prakriti_type": info["prakriti_type"],
                    "prakriti_subtype": None,
                    "archetype_title": info["archetype_title"],
                }
            # Fallback for unexpected combos like (tamas, sattva) or (tamas, rajas)
            return {
                "prakriti_type": f"{top[0].capitalize()}-{runner_up[0].capitalize()}",
                "prakriti_subtype": None,
                "archetype_title": None,
            }

        # Single dominant type
        info = self.SINGLE_TYPES.get(primary, {})
        return {
            "prakriti_type": info.get("prakriti_type", primary.capitalize()),
            "prakriti_subtype": None,
            "archetype_title": info.get("archetype_title"),
        }
