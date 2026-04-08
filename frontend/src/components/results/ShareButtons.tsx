import { MessageCircle, Camera, Copy, Check } from 'lucide-react';
import { useState } from 'react';

// X (Twitter) icon as inline SVG since lucide doesn't have it
function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface ShareButtonsProps {
  prakritiType: string;
  shareUrl?: string;
}

export function ShareButtons({ prakritiType, shareUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = shareUrl || window.location.href;
  const text = `I just discovered my Manas Prakriti is ${prakritiType}! Find yours at Anantayu.`;

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`,
      '_blank',
    );
  };

  const handleInstagram = () => {
    // Instagram doesn't support direct URL sharing, so copy to clipboard
    navigator.clipboard.writeText(text + '\n' + url);
    alert('Link copied! Paste it in your Instagram story or bio.');
  };

  const handleX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const buttonClass =
    'w-12 h-12 rounded-full bg-[#e5e2e1] flex items-center justify-center transition-colors duration-200 hover:bg-[#d4a017] hover:text-white cursor-pointer';

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-sm font-medium" style={{ color: 'var(--on-surface-variant)' }}>
        Share your Prakriti
      </span>
      <div className="flex items-center gap-3">
        <button onClick={handleWhatsApp} className={buttonClass} aria-label="Share on WhatsApp">
          <MessageCircle size={20} />
        </button>
        <button onClick={handleInstagram} className={buttonClass} aria-label="Share on Instagram">
          <Camera size={20} />
        </button>
        <button onClick={handleX} className={buttonClass} aria-label="Share on X">
          <XIcon size={20} />
        </button>
        <button onClick={handleCopy} className={buttonClass} aria-label="Copy link">
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </button>
      </div>
    </div>
  );
}
