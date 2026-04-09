import json
from decimal import Decimal
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# Threshold: if the gap between top two gunas is <= this %, it's a dual type
DUAL_TYPE_THRESHOLD = Decimal("10")


# 16 sub-type clusters mapped by dominant guna + top bhava patterns
# Based on Ashtanga Hridayam classification from Dr. Akolkar's thesis
SUBTYPE_BHAVA_CLUSTERS: dict[str, dict] = {
    # 7 Sattvika sub-types
    "brahma": {
        "guna": "sattva",
        "key_bhavas": ["satya", "dharma", "medha", "jnana", "viveka"],
        "name": "Brahma Kaya",
        "archetype": "The Creator",
        "animal": "Swan (Hamsa)",
    },
    "mahendra": {
        "guna": "sattva",
        "key_bhavas": ["dhairya", "achara", "tapas", "guru_bhakti", "pratigya_palana"],
        "name": "Mahendra Kaya",
        "archetype": "The Sovereign",
        "animal": "Lion (Simha)",
    },
    "varuna": {
        "guna": "sattva",
        "key_bhavas": ["kshama", "shaucha", "akrodha", "santosha", "titiksha"],
        "name": "Varuna Kaya",
        "archetype": "The Protector",
        "animal": "Elephant (Gaja)",
    },
    "kaubera": {
        "guna": "sattva",
        "key_bhavas": ["tyaga", "dana", "aparigraha", "kritajna", "samata"],
        "name": "Kaubera Kaya",
        "archetype": "The Generous One",
        "animal": "Cow (Dhenu)",
    },
    "gandharva": {
        "guna": "sattva",
        "key_bhavas": ["shaucha", "shaucha_shareera", "anukulata", "lakshya", "prayatna"],
        "name": "Gandharva Kaya",
        "archetype": "The Artist",
        "animal": "Peacock (Mayura)",
    },
    "yamya": {
        "guna": "sattva",
        "key_bhavas": ["dharma", "achara", "astikya", "satya", "anahamkara"],
        "name": "Yamya Kaya",
        "archetype": "The Just One",
        "animal": "Bull (Vrishabha)",
    },
    "rishi": {
        "guna": "sattva",
        "key_bhavas": ["upasana", "anasūyā", "jnana", "medha", "santosha"],
        "name": "Rishi Kaya",
        "archetype": "The Sage",
        "animal": "Deer (Mriga)",
    },
    # 6 Rajasika sub-types
    "asura": {
        "guna": "rajas",
        "key_bhavas": ["ahamkara", "mana", "aishwarya", "niyantrana", "ahamkara_pradhana"],
        "name": "Asura Kaya",
        "archetype": "The Titan",
        "animal": "Tiger (Vyaghra)",
    },
    "sarpa": {
        "guna": "rajas",
        "key_bhavas": ["krodha", "krodha_bahya", "krodha_vahana", "vaira", "dvesha"],
        "name": "Sarpa Kaya",
        "archetype": "The Serpent",
        "animal": "Cobra (Naga)",
    },
    "shakuna": {
        "guna": "rajas",
        "key_bhavas": ["chanchala", "asthirata", "sahasa", "spardhā", "bahya_prerana"],
        "name": "Shakuna Kaya",
        "archetype": "The Hunter",
        "animal": "Hawk (Shyena)",
    },
    "rakshasa": {
        "guna": "rajas",
        "key_bhavas": ["krodha", "amarsha", "asahishnuta", "mada", "niyantrana"],
        "name": "Rakshasa Kaya",
        "archetype": "The Fierce One",
        "animal": "Wolf (Vrka)",
    },
    "paishaca": {
        "guna": "rajas",
        "key_bhavas": ["atibhojana", "pradarshana", "vitatha", "shathya", "apavarjana"],
        "name": "Paishaca Kaya",
        "archetype": "The Indulgent",
        "animal": "Jackal (Srigala)",
    },
    "preta": {
        "guna": "rajas",
        "key_bhavas": ["irshya", "asantosha", "tulana", "pratyasha", "atmashlāghā"],
        "name": "Preta Kaya",
        "archetype": "The Seeker",
        "animal": "Crow (Kaka)",
    },
    # 3 Tamasika sub-types
    "pashu": {
        "guna": "tamas",
        "key_bhavas": ["nidra", "alasya", "tandra", "sthaulya", "dirghsutrata"],
        "name": "Pashu Kaya",
        "archetype": "The Steady One",
        "animal": "Buffalo (Mahisha)",
    },
    "matsya": {
        "guna": "tamas",
        "key_bhavas": ["bhaya", "bheerata", "paradheenata", "nirasha", "udaseenata"],
        "name": "Matsya Kaya",
        "archetype": "The Hidden One",
        "animal": "Fish (Matsya)",
    },
    "vanaspatya": {
        "guna": "tamas",
        "key_bhavas": ["amedha", "buddhi_nasha", "smriti_nasha", "asanga", "ashaucha"],
        "name": "Vanaspatya Kaya",
        "archetype": "The Rooted One",
        "animal": "Tortoise (Kurma)",
    },
}


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

    def classify_subtype(
        self,
        dominant_guna: str,
        bhava_scores: dict[str, int],
    ) -> dict | None:
        """Classify into one of 16 sub-types based on bhava tag scores.

        For deep (full) assessments only. Matches the dominant guna's
        sub-type clusters against the user's per-bhava YES scores.

        Args:
            dominant_guna: 'sattva', 'rajas', or 'tamas'
            bhava_scores: dict mapping bhava_tag -> YES count for that tag

        Returns:
            dict with subtype key, name, archetype, animal  - or None if no match.
        """
        # Filter clusters to only those matching the dominant guna
        candidates = {
            key: cluster for key, cluster in SUBTYPE_BHAVA_CLUSTERS.items()
            if cluster["guna"] == dominant_guna
        }

        if not candidates:
            return None

        # Score each candidate: count how many of its key_bhavas the user scored YES on
        best_key = None
        best_score = -1

        for subtype_key, cluster in candidates.items():
            score = sum(
                bhava_scores.get(bhava, 0) for bhava in cluster["key_bhavas"]
            )
            if score > best_score:
                best_score = score
                best_key = subtype_key

        if best_key is None or best_score == 0:
            return None

        cluster = candidates[best_key]
        return {
            "subtype_key": best_key,
            "subtype_name": cluster["name"],
            "subtype_archetype": cluster["archetype"],
            "subtype_animal": cluster["animal"],
        }
