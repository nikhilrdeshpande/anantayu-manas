import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Brain, Sparkles, Clock, Award, Shield, LogOut, ChevronRight } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { useAuthStore } from '../stores/auth-store';
import { usePurchaseStore } from '../stores/purchase-store';
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

export default function Dashboard() {
  const { locale = 'en' } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { checkAccess } = usePurchaseStore();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasDeepAccess, setHasDeepAccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate(`/${locale}/login`);
      return;
    }

    Promise.all([
      manas.getUserHistory(user.id).then((d) => setHistory(d.history || [])),
      checkAccess(user.id).then(setHasDeepAccess),
    ]).finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  if (!user) return null;

  const latestQuick = history.find((h) => h.assessment_type === 'quick');
  // latestDeep available for future use
  void history.find((h) => h.assessment_type === 'full' || h.assessment_type === 'deep');
  const quickHistory = history.filter((h) => h.assessment_type === 'quick');
  const deepHistory = history.filter((h) => h.assessment_type === 'full' || h.assessment_type === 'deep');

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
  };

  const balaColor = (grade: string | null) => {
    if (grade === 'pravara') return 'text-[#7ba05b]';
    if (grade === 'madhya') return 'text-[#d4a017]';
    return 'text-[#5b6b7a]';
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#fcf9f8]">
        {/* Greeting bar */}
        <div className="bg-[#1A1A1A] px-4 py-6">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Welcome back</p>
              <h1 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">
                {user.name}
              </h1>
            </div>
            <button
              onClick={() => { logout(); navigate(`/${locale}`); }}
              className="text-white/40 hover:text-white/70 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#d4a017] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Latest Result Card */}
              {latestQuick && (
                <Link
                  to={`/${locale}/results/${latestQuick.assessment_id}`}
                  className="block bg-white rounded-2xl border border-[#d3c5ae] p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#817662] uppercase tracking-wider font-medium">Your Prakriti</span>
                    <ChevronRight size={16} className="text-[#d3c5ae]" />
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Mini guna donut */}
                    <div className="w-16 h-16 rounded-full flex-shrink-0" style={{
                      background: `conic-gradient(
                        #7ba05b ${(latestQuick.sattva_pct || 0) / ((latestQuick.sattva_pct || 0) + (latestQuick.rajas_pct || 0) + (latestQuick.tamas_pct || 0)) * 360}deg,
                        #d4a017 ${(latestQuick.sattva_pct || 0) / ((latestQuick.sattva_pct || 0) + (latestQuick.rajas_pct || 0) + (latestQuick.tamas_pct || 0)) * 360}deg ${((latestQuick.sattva_pct || 0) + (latestQuick.rajas_pct || 0)) / ((latestQuick.sattva_pct || 0) + (latestQuick.rajas_pct || 0) + (latestQuick.tamas_pct || 0)) * 360}deg,
                        #5b6b7a ${((latestQuick.sattva_pct || 0) + (latestQuick.rajas_pct || 0)) / ((latestQuick.sattva_pct || 0) + (latestQuick.rajas_pct || 0) + (latestQuick.tamas_pct || 0)) * 360}deg
                      )`,
                    }}>
                      <div className="w-10 h-10 bg-white rounded-full m-[12px]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-[#1c1b1b] font-[family-name:var(--font-heading)]">
                        {latestQuick.prakriti_type}
                      </h2>
                      <p className="text-sm text-[#4f4634]">{latestQuick.archetype_title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs font-medium capitalize ${balaColor(latestQuick.sattva_bala)}`}>
                          <Shield size={10} className="inline mr-0.5" />
                          {latestQuick.sattva_bala}
                        </span>
                        <span className="text-xs text-[#817662]">{formatDate(latestQuick.completed_at)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to={`/${locale}/assessment/intro`}
                  className="bg-white rounded-xl border border-[#e8e4df] p-4 hover:border-[#d4a017]/30 transition-colors"
                >
                  <Brain size={20} className="text-[#d4a017] mb-2" />
                  <p className="text-sm font-semibold text-[#1c1b1b]">Quick Assessment</p>
                  <p className="text-xs text-[#817662] mt-0.5">25 questions, free</p>
                </Link>

                {hasDeepAccess ? (
                  <Link
                    to={`/${locale}/deep-assessment`}
                    className="bg-gradient-to-br from-[#fdf6e3] to-[#f6f0e0] rounded-xl border border-[#d4a017]/20 p-4 hover:border-[#d4a017]/40 transition-colors"
                  >
                    <Sparkles size={20} className="text-[#d4a017] mb-2" />
                    <p className="text-sm font-semibold text-[#1c1b1b]">Deep Assessment</p>
                    <p className="text-xs text-[#795900] mt-0.5">Ready to take</p>
                  </Link>
                ) : (
                  <Link
                    to={`/${locale}/pricing`}
                    className="bg-[#1A1A1A] rounded-xl p-4 hover:bg-[#252525] transition-colors"
                  >
                    <Sparkles size={20} className="text-[#d4a017] mb-2" />
                    <p className="text-sm font-semibold text-white">Deep Assessment</p>
                    <p className="text-xs text-white/50 mt-0.5">Unlock for ₹399</p>
                  </Link>
                )}
              </div>

              {/* Deep Assessment Results */}
              {deepHistory.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#1c1b1b] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles size={14} className="text-[#d4a017]" />
                    Deep Assessment Reports
                  </h3>
                  <div className="space-y-2">
                    {deepHistory.map((item) => (
                      <Link
                        key={item.assessment_id}
                        to={`/${locale}/deep-results/${item.assessment_id}`}
                        className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#e8e4df] hover:border-[#d4a017]/30 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#fdf6e3] flex items-center justify-center flex-shrink-0">
                          <Sparkles size={18} className="text-[#d4a017]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[#1c1b1b]">
                            {item.prakriti_subtype || item.prakriti_type}
                            {(item.subtype_archetype || item.archetype_title) && (
                              <span className="text-[#817662] font-normal ml-1.5">
                                 - {item.subtype_archetype || item.archetype_title}
                              </span>
                            )}
                          </p>
                          <span className="text-xs text-[#817662]">{formatDate(item.completed_at)}</span>
                        </div>
                        <ArrowRight size={16} className="text-[#d3c5ae] group-hover:text-[#d4a017] transition-colors flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Assessment History */}
              {quickHistory.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#1c1b1b] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Clock size={14} className="text-[#817662]" />
                    Quick Assessment History
                  </h3>
                  <div className="space-y-2">
                    {quickHistory.map((item) => (
                      <Link
                        key={item.assessment_id}
                        to={`/${locale}/results/${item.assessment_id}`}
                        className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#e8e4df] hover:border-[#d4a017]/30 transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#f6f3f2] flex items-center justify-center flex-shrink-0">
                          <Award size={16} className="text-[#817662]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-[#1c1b1b]">
                            {item.prakriti_type}
                            {item.archetype_title && (
                              <span className="text-[#817662] font-normal ml-1">  - {item.archetype_title}</span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[#817662]">{formatDate(item.completed_at)}</span>
                            <span className={`text-xs capitalize ${balaColor(item.sattva_bala)}`}>{item.sattva_bala}</span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-[#d3c5ae] group-hover:text-[#d4a017] transition-colors flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {history.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#e8e4df]">
                  <Brain size={36} className="text-[#d3c5ae] mx-auto mb-3" />
                  <p className="text-[#1c1b1b] font-semibold mb-1">No assessments yet</p>
                  <p className="text-[#817662] text-sm mb-4">Discover your mental constitution in under 5 minutes</p>
                  <Link
                    to={`/${locale}/assessment/intro`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-medium text-sm
                      bg-gradient-to-r from-[#8B6914] to-[#d4a017]"
                  >
                    Take Assessment <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
