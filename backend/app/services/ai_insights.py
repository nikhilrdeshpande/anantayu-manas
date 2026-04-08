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
Do NOT use markdown formatting — just plain flowing text with line breaks between sections."""

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
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt, stream=True)
        for chunk in response:
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
