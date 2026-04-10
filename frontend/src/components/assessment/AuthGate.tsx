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
        <h2 className="text-2xl font-bold mb-2 text-[#e5e2e1] font-['Plus_Jakarta_Sans']">
          {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
        </h2>
        <p className="text-sm text-[#d3c5ae]">
          {mode === 'signup'
            ? 'Sign up to save your results and track your wellness journey'
            : 'Sign in to continue your journey'}
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-full p-1 mb-8 bg-[#1c1b1b] border border-[#4f4634]/30">
        <button
          type="button"
          onClick={() => { setMode('signup'); setError(''); }}
          className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            mode === 'signup'
              ? 'metallic-gold text-[#402d00]'
              : 'text-[#d3c5ae] hover:text-white'
          }`}
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => { setMode('login'); setError(''); }}
          className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            mode === 'login'
              ? 'metallic-gold text-[#402d00]'
              : 'text-[#d3c5ae] hover:text-white'
          }`}
        >
          Sign In
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 rounded-xl bg-[#93000a]/30 border border-[#ffb4ab]/30 text-[#ffdad6] text-sm text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name (signup only) */}
        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-[#d3c5ae]">
              Full Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b8f7a]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-[#f6be39] focus:outline-none bg-[#1c1b1b] border border-[#4f4634]/30 text-[#e5e2e1] placeholder:text-[#9b8f7a]"
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-[#d3c5ae]">
            Email Address
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b8f7a]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-[#f6be39] focus:outline-none bg-[#1c1b1b] border border-[#4f4634]/30 text-[#e5e2e1] placeholder:text-[#9b8f7a]"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-[#d3c5ae]">
            Password
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b8f7a]" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter password'}
              required
              className="w-full pl-11 pr-11 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-[#f6be39] focus:outline-none bg-[#1c1b1b] border border-[#4f4634]/30 text-[#e5e2e1] placeholder:text-[#9b8f7a]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9b8f7a] hover:text-[#f6be39] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl metallic-gold text-[#402d00] font-bold text-base shadow-xl hover:shadow-[#f6be39]/20 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading
            ? (mode === 'signup' ? 'Creating Account...' : 'Signing In...')
            : (mode === 'signup' ? 'Create Account & Continue' : 'Sign In & Continue')}
        </button>
      </form>
    </div>
  );
}
