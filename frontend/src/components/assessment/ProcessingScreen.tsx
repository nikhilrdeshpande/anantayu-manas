import { useEffect, useState } from 'react';

interface ProcessingScreenProps {
  onComplete: () => void | Promise<void>;
}

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 70); // ~3.5s to reach 100

    // Fire completion after minimum 3.5s (allows backend call to finish)
    const timer = setTimeout(() => {
      Promise.resolve(onComplete());
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#1A1A1A' }}
    >
      {/* Rotating mandala background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[320, 280, 240, 200, 160].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: size,
              height: size,
              borderColor: `rgba(255,255,255,${0.03 + i * 0.01})`,
              animation: `spinMandala ${30 + i * 10}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
            }}
          />
        ))}
      </div>

      {/* 3 concentric breathing circles */}
      <div className="relative mb-16">
        {/* Tamas outer */}
        <div
          className="absolute rounded-full"
          style={{
            width: 160,
            height: 160,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '2px solid rgba(91, 107, 122, 0.4)',
            animation: 'breatheOuter 4s ease-in-out infinite',
          }}
        />
        {/* Rajas middle */}
        <div
          className="absolute rounded-full"
          style={{
            width: 110,
            height: 110,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '2px solid rgba(212, 160, 23, 0.4)',
            animation: 'breatheMiddle 4s ease-in-out infinite 0.5s',
          }}
        />
        {/* Sattva inner */}
        <div
          className="absolute rounded-full"
          style={{
            width: 70,
            height: 70,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '2px solid rgba(123, 160, 91, 0.5)',
            animation: 'breatheInner 4s ease-in-out infinite 1s',
          }}
        />
        {/* Center glowing dot */}
        <div
          className="relative w-4 h-4 rounded-full"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.2)',
            animation: 'pulseGlow 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Headline */}
      <h2
        className="text-xl md:text-2xl font-bold text-white text-center mb-2"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Analyzing your responses...
      </h2>

      {/* Subtitle */}
      <p className="text-sm text-white/50 text-center mb-10 max-w-xs">
        Computing your unique Manas Prakriti based on ancient Ayurvedic wisdom
      </p>

      {/* Progress line */}
      <div className="w-48 h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #7BA05B, #D4A017, #5B6B7A)',
            transition: 'width 100ms linear',
          }}
        />
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes spinMandala {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes breatheOuter {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.5; }
        }
        @keyframes breatheMiddle {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
        }
        @keyframes breatheInner {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.25); opacity: 0.7; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
