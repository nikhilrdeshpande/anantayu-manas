import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { manas } from '../../lib/api';

interface AIInsightsProps {
  assessmentId: string | null;
  locale?: string;
  fallbackText?: string;
}

export function AIInsights({ assessmentId, locale = 'en', fallbackText }: AIInsightsProps) {
  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasStreamed, setHasStreamed] = useState(false);

  useEffect(() => {
    const startStreaming = async () => {
      if (!assessmentId || hasStreamed) return;
      setIsStreaming(true);

      try {
        const response = await manas.streamInsights(assessmentId, locale);
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error('No reader');

        let accumulated = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setText(accumulated);
        }
        setHasStreamed(true);
      } catch (err) {
        console.warn('AI streaming failed:', err);
        setText(fallbackText || 'Unable to generate personalized insights at this time.');
      } finally {
        setIsStreaming(false);
      }
    };

    startStreaming();
  }, [assessmentId, locale, fallbackText, hasStreamed]);

  // If no assessmentId and we have fallback text, show that
  const displayText = text || fallbackText || '';

  if (!displayText && !isStreaming) return null;

  return (
    <div
      className="rounded-xl p-6"
      style={{ backgroundColor: '#f6f3f2' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-[#d4a017]" />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#d4a017' }}>
          AI Insight
        </span>
        {isStreaming && (
          <span
            className="inline-block w-2 h-4 ml-1"
            style={{
              backgroundColor: '#d4a017',
              animation: 'blink 1s step-end infinite',
            }}
          />
        )}
      </div>
      <blockquote
        className="text-sm italic leading-relaxed pl-4 whitespace-pre-wrap"
        style={{
          color: 'var(--on-surface-variant)',
          borderLeft: '4px solid #d4a017',
        }}
      >
        {displayText}
        {isStreaming && (
          <span
            className="inline-block w-1.5 h-3.5 ml-0.5 align-text-bottom"
            style={{
              backgroundColor: 'var(--on-surface-variant)',
              animation: 'blink 1s step-end infinite',
            }}
          />
        )}
      </blockquote>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
