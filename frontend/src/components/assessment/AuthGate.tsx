import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../stores/auth-store';

interface AuthGateProps {
  onAuthenticated: () => void;
}

export function AuthGate({ onAuthenticated }: AuthGateProps) {
  const { register, login } = useAuthStore();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
        await register(email, name, password);
      } else {
        await login(email, password);
      }
      onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--on-surface)' }}
        >
          {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
        </h2>
        <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
          {mode === 'signup'
            ? 'Sign up to save your results and track your wellness journey'
            : 'Sign in to continue your journey'}
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-full p-1 mb-8" style={{ backgroundColor: '#f6f3f2' }}>
        <button
          type="button"
          onClick={() => { setMode('signup'); setError(''); }}
          className="flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
          style={{
            backgroundColor: mode === 'signup' ? '#fff' : 'transparent',
            color: mode === 'signup' ? '#1c1b1b' : '#817662',
            boxShadow: mode === 'signup' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => { setMode('login'); setError(''); }}
          className="flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
          style={{
            backgroundColor: mode === 'login' ? '#fff' : 'transparent',
            color: mode === 'login' ? '#1c1b1b' : '#817662',
            boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          Sign In
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 rounded-xl bg-[#ffdad6] text-[#93000a] text-sm text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name (signup only) */}
        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#4f4634' }}>
              Full Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#817662' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-none text-sm focus:ring-2 focus:ring-[#d4a017] focus:outline-none"
                style={{ backgroundColor: '#f6f3f2', color: '#1c1b1b' }}
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#4f4634' }}>
            Email Address
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#817662' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border-none text-sm focus:ring-2 focus:ring-[#d4a017] focus:outline-none"
              style={{ backgroundColor: '#f6f3f2', color: '#1c1b1b' }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#4f4634' }}>
            Password
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#817662' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Min 6 characters' : '••••••••'}
              required
              className="w-full pl-11 pr-11 py-3.5 rounded-xl border-none text-sm focus:ring-2 focus:ring-[#d4a017] focus:outline-none"
              style={{ backgroundColor: '#f6f3f2', color: '#1c1b1b' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: '#817662' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            background: 'linear-gradient(135deg, #D4A017 0%, #C4920F 100%)',
            boxShadow: '0 4px 14px rgba(212, 160, 23, 0.35)',
          }}
        >
          {loading
            ? (mode === 'signup' ? 'Creating Account...' : 'Signing In...')
            : (mode === 'signup' ? 'Create Account & Continue' : 'Sign In & Continue')}
        </button>
      </form>
    </div>
  );
}
