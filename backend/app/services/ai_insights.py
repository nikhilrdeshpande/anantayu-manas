from collections.abc import AsyncGenerator
from app.config import settings


class AIInsightsService:
    """Multi-LLM service for generating personalized Ayurvedic insights."""

    def _build_prompt(self, prakriti_type, primary_guna, secondary_guna,
                      sattva_pct, rajas_pct, tamas_pct, sattva_bala, locale,
                      demographics: dict | None = None):
        language_map = {"en": "English", "hi": "Hindi", "mr": "Marathi"}
        language = language_map.get(locale, "English")

        demographics_section = ""
        if demographics:
            demographics_section = f"""

Additional context about the person:
- Age: {demographics.get('age', 'Unknown')}
- Gender: {demographics.get('gender', 'Unknown')}
- Diet: {demographics.get('diet', 'Unknown')}
- Work: {demographics.get('work_nature', 'Unknown')}
- Sleep quality: {demographics.get('sleep_quality', 'Unknown')}

Use this context to make your recommendations more specific and relevant."""

        return f"""You are a warm, knowledgeable Ayurvedic wellness counselor for the Anantayu platform.

Given this Manas Prakriti assessment result:
- Prakriti Type: {prakriti_type}
- Primary Guna: {primary_guna}
- Secondary Guna: {secondary_guna or 'None'}
- Sattva: {sattva_pct:.1f}%, Rajas: {rajas_pct:.1f}%, Tamas: {tamas_pct:.1f}%
- Sattva Bala (mental strength): {sattva_bala}{demographics_section}

Write a personalized wellness insight in {language}. Include:
1. A warm 2-sentence explanation of what this prakriti means for them personally
2. One specific daily practice recommendation tailored to their guna balance
3. One encouraging thought about their natural strengths

Keep tone warm, non-judgmental, empowering. Use simple language. Keep total under 150 words.
Do NOT use markdown formatting  - just plain flowing text with line breaks between sections."""

    async def generate_insights_stream(self, prakriti_type: str, primary_guna: str,
                                        secondary_guna: str | None, sattva_pct: float,
                                        rajas_pct: float, tamas_pct: float,
                                        sattva_bala: str, locale: str = "en",
                                        demographics: dict | None = None) -> AsyncGenerator[str, None]:
        prompt = self._build_prompt(prakriti_type, primary_guna, secondary_guna,
                                     sattva_pct, rajas_pct, tamas_pct, sattva_bala, locale,
                                     demographics=demographics)

        provider = settings.LLM_PROVIDER.lower()

        if provider == "anthropic" and settings.ANTHROPIC_API_KEY:
            async for chunk in self._stream_anthropic(prompt):
                yield chunk
        elif provider == "gemini" and settings.GEMINI_API_KEY:
            async for chunk in self._stream_gemini(prompt):
                yield chunk
        elif provider == "openai" and settings.OPENAI_API_KEY:
            async for chunk in self._stream_openai(prompt):
                yield chunk
        else:
            # Try any available provider
            if settings.ANTHROPIC_API_KEY:
                async for chunk in self._stream_anthropic(prompt):
                    yield chunk
            elif settings.GEMINI_API_KEY:
                async for chunk in self._stream_gemini(prompt):
                    yield chunk
            elif settings.OPENAI_API_KEY:
                async for chunk in self._stream_openai(prompt):
                    yield chunk
            else:
                yield "Your mental constitution reflects a unique balance of the three Gunas. "
                yield "Consider incorporating mindfulness practices into your daily routine "
                yield "to nurture your dominant qualities while maintaining balance."

    async def _stream_anthropic(self, prompt: str) -> AsyncGenerator[str, None]:
        from anthropic import AsyncAnthropic
        client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        async with client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}],
        ) as stream:
            async for text in stream.text_stream:
                yield text

    async def _stream_gemini(self, prompt: str) -> AsyncGenerator[str, None]:
        from google import genai
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        response = await client.aio.models.generate_content_stream(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        async for chunk in response:
            if chunk.text:
                yield chunk.text

    async def _stream_openai(self, prompt: str) -> AsyncGenerator[str, None]:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        stream = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            stream=True,
            max_tokens=300,
        )
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    # ── Deep Report (Premium) ──────────────────────────────────────────

    def _build_deep_report_prompt(
        self,
        prakriti_type: str,
        subtype_key: str | None,
        subtype_name: str | None,
        subtype_archetype: str | None,
        subtype_animal: str | None,
        primary_guna: str,
        secondary_guna: str | None,
        sattva_pct: float,
        rajas_pct: float,
        tamas_pct: float,
        sattva_bala: str,
        bhava_scores: dict[str, int] | None,
        demographics: dict | None,
        subtype_profile: dict | None,
        locale: str = "en",
    ) -> str:
        language_map = {"en": "English", "hi": "Hindi", "mr": "Marathi"}
        language = language_map.get(locale, "English")

        # Build behavioral evidence from bhava scores
        bhava_evidence = ""
        if bhava_scores:
            top_bhavas = sorted(bhava_scores.items(), key=lambda x: x[1], reverse=True)[:8]
            bhava_evidence = "\n".join(
                f"  - {tag}: scored {score} (high)" for tag, score in top_bhavas if score > 0
            )

        # Build profile context from subtype data
        profile_context = ""
        if subtype_profile:
            patterns = "\n".join(f"  - {p}" for p in subtype_profile.get("behavioral_patterns", []))
            strengths = ", ".join(subtype_profile.get("strengths", []))
            shadows = ", ".join(subtype_profile.get("shadows", []))
            rel_style = subtype_profile.get("relationship_style", "")
            work_style = subtype_profile.get("work_style", "")
            profile_context = f"""
SUBTYPE PROFILE DATA (use as foundation, but personalize with demographics):
  Behavioral patterns:
{patterns}
  Strengths: {strengths}
  Shadows: {shadows}
  Relationship style: {rel_style}
  Work style: {work_style}"""

        demographics_section = ""
        if demographics:
            age = demographics.get("age", "Unknown")
            gender = demographics.get("gender", "Unknown")
            diet = demographics.get("diet", "Unknown")
            work = demographics.get("work_nature", "Unknown")
            sleep = demographics.get("sleep_quality", "Unknown")
            demographics_section = f"""
DEMOGRAPHICS (use these to make every section hyper-specific):
  Age: {age}, Gender: {gender}
  Diet: {diet}, Work type: {work}
  Sleep quality: {sleep}"""

        diet_pref = demographics.get("diet", "vegetarian") if demographics else "vegetarian"
        work_type = demographics.get("work_nature", "desk") if demographics else "desk"
        sleep_qual = demographics.get("sleep_quality", "average") if demographics else "average"
        age = demographics.get("age", 30) if demographics else 30
        gender = demographics.get("gender", "unknown") if demographics else "unknown"

        return f"""You are an expert Ayurvedic wellness counselor creating a PAID premium report for the Anantayu platform. It must feel deeply personal.

ASSESSMENT RESULTS:
  Prakriti Type: {prakriti_type}
  Sub-type: {subtype_name or "Not classified"} - {subtype_archetype or ""} ({subtype_animal or ""})
  Primary Guna: {primary_guna}, Secondary: {secondary_guna or "None"}
  Sattva: {sattva_pct:.1f}%, Rajas: {rajas_pct:.1f}%, Tamas: {tamas_pct:.1f}%
  Sattva Bala (mental strength): {sattva_bala}
  Person: {age}-year-old {gender}, {diet_pref} diet, {work_type} work, {sleep_qual} sleep

BHAVA (TRAIT) SCORES - behavioral evidence:
{bhava_evidence or "  No per-bhava data available"}
{profile_context}

Respond in {language} with ONLY valid JSON. No markdown, no explanation, just the JSON object.
The "who_you_are" section is the most important - write it like 16personalities. The reader should think "how do they know me so well?" Lead with specific behavioral patterns ("You're the kind of person who..."), name inner conflicts between gunas, describe how they show up at work/relationships/alone. Use their age, work type, and sleep quality to make it specific. Do NOT use abstract Ayurvedic theory.

All diet recommendations MUST be for a {diet_pref} diet. Name specific {diet_pref} foods.
All routine times must account for {work_type} work and {sleep_qual} sleep quality.
Be SPECIFIC everywhere: name real foods, real times, real techniques. Never be vague.
Use "you" throughout. Write as a warm counselor, not a textbook.

{{
  "who_you_are": {{
    "paragraphs": ["First paragraph ~100 words about their core personality pattern...", "Second paragraph ~100 words about their inner conflicts...", "Third paragraph ~100 words about how they show up in daily life...", "Fourth paragraph ~100 words about what drives them..."],
    "inner_conflict": "One sentence capturing their core tension between gunas",
    "at_work": "2-3 sentences about their professional style, specific to {work_type} work",
    "in_relationships": "2-3 sentences about their relationship patterns"
  }},
  "strengths_and_shadows": {{
    "strengths": [
      {{"title": "Strength name", "description": "Why this is powerful for them, with behavioral example"}},
      {{"title": "Strength name", "description": "..."}},
      {{"title": "Strength name", "description": "..."}}
    ],
    "shadows": [
      {{"title": "Shadow name", "description": "How this manifests, with compassionate framing"}},
      {{"title": "Shadow name", "description": "..."}},
      {{"title": "Shadow name", "description": "..."}}
    ]
  }},
  "diet": {{
    "increase": [
      {{"food": "Specific {diet_pref} food item", "reason": "Why it helps their guna balance"}},
      {{"food": "...", "reason": "..."}},
      {{"food": "...", "reason": "..."}},
      {{"food": "...", "reason": "..."}}
    ],
    "reduce": [
      {{"food": "Specific food to reduce", "reason": "Why it aggravates their imbalance"}},
      {{"food": "...", "reason": "..."}},
      {{"food": "...", "reason": "..."}}
    ],
    "meals": {{
      "breakfast": "Specific {diet_pref} breakfast recommendation",
      "lunch": "Specific {diet_pref} lunch recommendation",
      "dinner": "Specific {diet_pref} dinner recommendation",
      "snack": "Specific {diet_pref} snack recommendation"
    }},
    "note": "One personalized insight connecting their diet to their guna balance"
  }},
  "routine": {{
    "morning": {{"time": "5:30 - 8:00 AM", "practices": ["Practice 1 with timing", "Practice 2 with timing", "Practice 3"]}},
    "midday": {{"time": "12:00 - 2:00 PM", "practices": ["Practice 1", "Practice 2"]}},
    "evening": {{"time": "5:00 - 7:00 PM", "practices": ["Practice 1", "Practice 2"]}},
    "night": {{"time": "9:00 - 10:30 PM", "practices": ["Practice 1", "Practice 2"]}}
  }},
  "practices": {{
    "pranayama": {{"name": "Specific technique name", "duration": "X minutes", "technique": "Brief how-to in 1-2 sentences"}},
    "meditation": {{"name": "Specific style", "duration": "X minutes", "technique": "Brief how-to in 1-2 sentences"}},
    "yoga": [
      {{"name": "Asana name", "benefit": "Why this specific asana helps their type"}},
      {{"name": "...", "benefit": "..."}},
      {{"name": "...", "benefit": "..."}}
    ]
  }},
  "thirty_day_plan": {{
    "week1": {{"focus": "Theme for week 1", "actions": ["Specific action 1", "Specific action 2", "Specific action 3"]}},
    "week2": {{"focus": "Theme for week 2", "actions": ["Specific action 1", "Specific action 2", "Specific action 3"]}},
    "week3": {{"focus": "Theme for week 3", "actions": ["Specific action 1", "Specific action 2", "Specific action 3"]}},
    "week4": {{"focus": "Theme for week 4", "actions": ["Specific action 1", "Specific action 2", "Specific action 3"]}},
    "expected_outcome": "What they can expect to feel/notice after 30 days"
  }}
}}"""

    async def generate_deep_report_stream(
        self,
        prakriti_type: str,
        subtype_key: str | None,
        subtype_name: str | None,
        subtype_archetype: str | None,
        subtype_animal: str | None,
        primary_guna: str,
        secondary_guna: str | None,
        sattva_pct: float,
        rajas_pct: float,
        tamas_pct: float,
        sattva_bala: str,
        bhava_scores: dict[str, int] | None = None,
        demographics: dict | None = None,
        subtype_profile: dict | None = None,
        locale: str = "en",
    ) -> AsyncGenerator[str, None]:
        """Generate comprehensive premium report using Claude Sonnet."""
        prompt = self._build_deep_report_prompt(
            prakriti_type=prakriti_type,
            subtype_key=subtype_key,
            subtype_name=subtype_name,
            subtype_archetype=subtype_archetype,
            subtype_animal=subtype_animal,
            primary_guna=primary_guna,
            secondary_guna=secondary_guna,
            sattva_pct=sattva_pct,
            rajas_pct=rajas_pct,
            tamas_pct=tamas_pct,
            sattva_bala=sattva_bala,
            bhava_scores=bhava_scores,
            demographics=demographics,
            subtype_profile=subtype_profile,
            locale=locale,
        )

        # Use Sonnet for premium quality, with fallback chain
        if settings.ANTHROPIC_API_KEY:
            async for chunk in self._stream_anthropic_deep(prompt):
                yield chunk
        elif settings.GEMINI_API_KEY:
            async for chunk in self._stream_gemini_deep(prompt):
                yield chunk
        elif settings.OPENAI_API_KEY:
            async for chunk in self._stream_openai_deep(prompt):
                yield chunk
        else:
            yield "Premium report generation requires an AI provider API key."

    async def _stream_anthropic_deep(self, prompt: str) -> AsyncGenerator[str, None]:
        from anthropic import AsyncAnthropic
        client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        async with client.messages.stream(
            model="claude-sonnet-4-6-20250514",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}],
        ) as stream:
            async for text in stream.text_stream:
                yield text

    async def _stream_gemini_deep(self, prompt: str) -> AsyncGenerator[str, None]:
        from google import genai
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        response = await client.aio.models.generate_content_stream(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        async for chunk in response:
            if chunk.text:
                yield chunk.text

    async def _stream_openai_deep(self, prompt: str) -> AsyncGenerator[str, None]:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        stream = await client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            stream=True,
            max_tokens=4000,
        )
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
