import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LogOut, ArrowRight, Clock, Award, Shield } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { useAuthStore } from '../stores/auth-store';
import { manas } from '../lib/api';

interface HistoryItem {
  assessment_id: string;
  assessment_type: string;
  prakriti_type: string | null;
  prakriti_subtype: string | null;
  archetype_title: string | null;
  subtype_archetype: string | null;
  completed_at: string | null;
  sattva_bala: string | null;
  sattva_pct: number | null;
  rajas_pct: number | null;
  tamas_pct: number | null;
}

export default function Profile() {
  const { locale = 'en' } = useParams<{ locale: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      navigate(`/${locale}/login`);
      return;
    }

    manas.getUserHistory(user.id)
      .then((data) => {
        setHistory(data.history || []);
      })
      .catch(() => {
        // Silently fail  - history just won't show
      })
      .finally(() => setLoadingHistory(false));
  }, [isAuthenticated, user, isLoading, navigate, locale]);

  const handleLogout = () => {
    logout();
    navigate(`/${locale}`);
  };

  const sattvaBalaLabel = (grade: string) => {
    switch (grade) {
      case 'pravara': return 'Pravara (High)';
      case 'madhya': return 'Madhya (Medium)';
      case 'avara': return 'Avara (Low)';
      default: return grade;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (!user) return null;

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#131313] py-12 px-6 relative">
        <div className="absolute inset-0 glow-gold pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* User Info Card */}
          <div className="bg-[#2a2a2a] rounded-2xl border border-[#4f4634]/20 p-8 mb-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full metallic-gold flex items-center justify-center text-[#402d00] text-xl font-bold font-['Plus_Jakarta_Sans']">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#e5e2e1]">
                  {user.name}
                </h1>
                <p className="text-[#d3c5ae] text-sm">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/${locale}/assessment/intro`}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl metallic-gold text-[#402d00] font-bold text-sm shadow-xl hover:shadow-[#f6be39]/20 transition-all active:scale-95"
              >
                Take New Assessment
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#4f4634]/30 text-[#d3c5ae] font-semibold text-sm hover:border-[#f6be39]/40 hover:text-[#f6be39] transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Assessment History */}
          <div className="bg-[#2a2a2a] rounded-2xl border border-[#4f4634]/20 p-8 shadow-2xl">
            <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#e5e2e1] mb-6">
              Assessment History
            </h2>

            {loadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#f6be39] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Clock size={28} className="text-[#9b8f7a]" />
                </div>
                <p className="text-[#e5e2e1] text-sm mb-1 font-bold">No assessments yet</p>
                <p className="text-[#9b8f7a] text-xs">
                  Take your first Manas Prakriti assessment to see your results here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <Link
                    key={item.assessment_id}
                    to={`/${locale}/results/${item.assessment_id}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#1c1b1b] border border-[#4f4634]/20 hover:border-[#f6be39]/30 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#f6be39]/10 border border-[#f6be39]/20 flex items-center justify-center shrink-0">
                      <Award size={20} className="text-[#f6be39]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#e5e2e1]">
                        {item.prakriti_type}
                        {item.archetype_title && (
                          <span className="text-[#d3c5ae] font-normal ml-1.5">
                             - {item.archetype_title}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-[#9b8f7a]">
                          {item.completed_at ? formatDate(item.completed_at) : ''}
                        </span>
                        {item.sattva_bala && (
                          <span className="flex items-center gap-1 text-xs text-[#abd288]">
                            <Shield size={12} />
                            {sattvaBalaLabel(item.sattva_bala)}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-[#9b8f7a] group-hover:text-[#f6be39] transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
