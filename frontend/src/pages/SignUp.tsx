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
      navigate(`/${locale}/assessment/intro`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[#fcf9f8] relative overflow-hidden">
      {/* Background decorative blurs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#ffdfa0]/20 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#c6efa1]/20 blur-[100px] rounded-full -z-10" />

      {/* Branding */}
      <div className="mb-12 text-center">
        <img src="/Anantayu Logo.png" alt="Anantayu" className="h-16 w-auto mx-auto mb-2" />
        <p className="text-[#4f4634] tracking-widest uppercase text-xs font-semibold">
          Manas Prakriti
        </p>
      </div>

      {/* Sign Up Card */}
      <div className="w-full max-w-md bg-white rounded-xl p-8 md:p-12 shadow-[0_8px_40px_rgba(28,27,27,0.04)] border border-[#d3c5ae]/15">
        <header className="mb-10">
          <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#1c1b1b] mb-2">
            Create Your Account
          </h2>
          <p className="text-[#4f4634] text-sm">
            Begin your journey of self-discovery and balance.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-[#ffdad6] text-[#93000a] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold text-[#4f4634] uppercase tracking-wider mb-2"
            >
              Full Name
            </label>
            <div className="relative flex items-center border-b border-[#d3c5ae]/30 focus-within:border-[#795900] transition-all duration-300">
              <User size={20} className="text-[#817662] absolute left-0" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full pl-8 pb-3 bg-transparent border-none focus:ring-0 focus:outline-none text-[#1c1b1b] placeholder:text-[#d3c5ae] text-base"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-[#4f4634] uppercase tracking-wider mb-2"
            >
              Email Address
            </label>
            <div className="relative flex items-center border-b border-[#d3c5ae]/30 focus-within:border-[#795900] transition-all duration-300">
              <Mail size={20} className="text-[#817662] absolute left-0" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-8 pb-3 bg-transparent border-none focus:ring-0 focus:outline-none text-[#1c1b1b] placeholder:text-[#d3c5ae] text-base"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-[#4f4634] uppercase tracking-wider mb-2"
            >
              Password
            </label>
            <div className="relative flex items-center border-b border-[#d3c5ae]/30 focus-within:border-[#795900] transition-all duration-300">
              <Lock size={20} className="text-[#817662] absolute left-0" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-8 pr-10 pb-3 bg-transparent border-none focus:ring-0 focus:outline-none text-[#1c1b1b] placeholder:text-[#d3c5ae] text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 pb-3 text-[#d3c5ae] hover:text-[#4f4634]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="mt-2 text-xs text-[#817662]">Minimum 6 characters</p>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden font-['Plus_Jakarta_Sans'] font-bold py-4 px-6 rounded-full text-white shadow-lg shadow-[#795900]/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #795900 0%, #d4a017 100%)' }}
          >
            <span className="relative z-10">{loading ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[#4f4634] text-sm">
            Already have an account?{' '}
            <Link
              to={`/${locale}/login`}
              className="text-[#795900] font-bold hover:underline underline-offset-4 ml-1"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center max-w-xs">
        <p className="text-[10px] leading-relaxed text-[#817662] uppercase tracking-[0.2em]">
          Inspired by the Gunas. <br />
          Designed for your Prakriti.
        </p>
      </footer>
    </main>
  );
}
