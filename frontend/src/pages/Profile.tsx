import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LogOut, ArrowRight, Clock, Award, Shield } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { useAuthStore } from '../stores/auth-store';
import { manas } from '../lib/api';

interface HistoryItem {
  assessment_id: string;
  prakriti_type: string;
  archetype_title: string;
  completed_at: string;
  sattva_bala: string;
}

export default function Profile() {
  const { locale = 'en' } = useParams<{ locale: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
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
  }, [isAuthenticated, user, navigate, locale]);

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
      <div className="min-h-screen bg-[#FAFAF5] py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* User Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DF] p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#d4a017] flex items-center justify-center text-white text-xl font-bold font-['Plus_Jakarta_Sans']">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#1c1b1b]">
                  {user.name}
                </h1>
                <p className="text-[#4f4634] text-sm">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/${locale}/assessment/intro`}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #D4A017 0%, #C4920F 100%)' }}
              >
                Take New Assessment
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#E8E4DF] text-[#4f4634] font-semibold text-sm hover:bg-[#f6f3f2] transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Assessment History */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DF] p-8">
            <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#1c1b1b] mb-6">
              Assessment History
            </h2>

            {loadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#d4a017] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#f6f3f2] flex items-center justify-center">
                  <Clock size={28} className="text-[#817662]" />
                </div>
                <p className="text-[#4f4634] text-sm mb-1">No assessments yet</p>
                <p className="text-[#817662] text-xs">
                  Take your first Manas Prakriti assessment to see your results here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <Link
                    key={item.assessment_id}
                    to={`/${locale}/results/${item.assessment_id}`}
                    className="flex items-center gap-4 p-4 rounded-xl border border-[#E8E4DF] hover:border-[#d4a017]/30 hover:bg-[#fdf9f0] transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#d4a017]/10 flex items-center justify-center shrink-0">
                      <Award size={20} className="text-[#d4a017]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#1c1b1b]">
                        {item.prakriti_type}
                        {item.archetype_title && (
                          <span className="text-[#817662] font-normal ml-1.5">
                             - {item.archetype_title}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-[#817662]">
                          {formatDate(item.completed_at)}
                        </span>
                        {item.sattva_bala && (
                          <span className="flex items-center gap-1 text-xs text-[#466729]">
                            <Shield size={12} />
                            {sattvaBalaLabel(item.sattva_bala)}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-[#d3c5ae] group-hover:text-[#d4a017] transition-colors shrink-0" />
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
