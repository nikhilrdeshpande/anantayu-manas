import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useAuthStore } from '../stores/auth-store';

export default function SignUp() {
  const { locale = 'en' } = useParams<{ locale: string }>();
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(email, name, password);
      navigate(`/${locale}/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-[#131313] relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 glow-gold pointer-events-none" />

      {/* Decorative blur orbs */}
      <div className="blur-orb top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f6be39]/10" />
      <div className="blur-orb bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#7ba05b]/10" />

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Branding */}
        <div className="mb-10 text-center">
          <span className="text-3xl font-bold tracking-tighter text-[#f6be39] font-['Plus_Jakarta_Sans']">
            Anantayu
          </span>
          <p className="text-[#d3c5ae] tracking-widest uppercase text-[10px] font-bold mt-2">
            Manas Prakriti
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="w-full max-w-md bg-[#2a2a2a] rounded-3xl border border-[#4f4634]/20 p-8 md:p-10 shadow-2xl">
          <header className="mb-8">
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#e5e2e1] mb-2">
              Create Your Account
            </h2>
            <p className="text-[#d3c5ae] text-sm">
              Begin your journey of self-discovery and balance.
            </p>
          </header>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-[#93000a]/30 border border-[#ffb4ab]/30 text-[#ffdad6] text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
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
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-[#f6be39] focus:outline-none bg-[#1c1b1b] border border-[#4f4634]/30 text-[#e5e2e1] placeholder:text-[#9b8f7a]"
                />
              </div>
            </div>

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
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
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

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 rounded-xl metallic-gold text-[#402d00] font-bold text-base shadow-xl hover:shadow-[#f6be39]/20 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#d3c5ae] text-sm">
              Already have an account?{' '}
              <Link
                to={`/${locale}/login`}
                className="text-[#f6be39] font-bold hover:underline underline-offset-4 ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center max-w-xs">
          <p className="text-[10px] leading-relaxed text-[#9b8f7a] uppercase tracking-[0.2em]">
            Inspired by the Gunas.<br />
            Designed for your Prakriti.
          </p>
        </footer>
      </div>
    </main>
  );
}
