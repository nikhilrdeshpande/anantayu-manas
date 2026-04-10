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
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const { checkAccess } = usePurchaseStore();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasDeepAccess, setHasDeepAccess] = useState(false);

  useEffect(() => {
    // Wait for auth state to finish loading before redirecting
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      navigate(`/${locale}/login`);
      return;
    }

    Promise.all([
      manas.getUserHistory(user.id).then((d) => setHistory(d.history || [])),
      checkAccess(user.id).then(setHasDeepAccess),
    ]).finally(() => setLoading(false));
  }, [isAuthenticated, user, isLoading]);

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
    if (grade === 'pravara') return 'text-[#abd288]';
    if (grade === 'madhya') return 'text-[#f6be39]';
    return 'text-[#9b8f7a]';
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#131313] relative">
        <div className="absolute inset-0 glow-gold pointer-events-none" />

        <div className="relative z-10">
          {/* Greeting bar */}
          <div className="px-4 py-10">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-[#9b8f7a] text-xs uppercase tracking-widest font-bold mb-1">Welcome back</p>
                <h1 className="text-3xl font-bold text-[#e5e2e1] font-['Plus_Jakarta_Sans']">
                  {user.name}
                </h1>
              </div>
              <button
                onClick={() => { logout(); navigate(`/${locale}`); }}
                className="text-[#9b8f7a] hover:text-[#f6be39] transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 pb-12 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-[#f6be39] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Latest Result Card */}
                {latestQuick && (
                  <Link
                    to={`/${locale}/results/${latestQuick.assessment_id}`}
                    className="block bg-[#2a2a2a] rounded-2xl border border-[#4f4634]/20 p-6 shadow-2xl hover:border-[#f6be39]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-[#f6be39] uppercase tracking-widest font-bold">Your Prakriti</span>
                      <ChevronRight size={16} className="text-[#9b8f7a]" />
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Mini guna donut */}
                      <div className="w-16 h-16 rounded-full flex-shrink-0" style={{
                        background: `conic-gradient(
                          #7ba05b ${(latestQuick.sattva_pct || 0) / ((latestQuick.sattva_pct || 0) + (latestQuick.rajas_pct || 0) + (latestQuick.tamas_pct || 0)) * 360}deg,
                          #f6be39 ${(latestQuick.sattva_pct || 0) / ((latestQuick.sattva_pct || 0) + (latestQuick.rajas_pct || 0) + (latestQuick.tamas_pct || 0)) * 360}deg ${((latestQuick.sattva_pct || 0) + (latestQuick.rajas_pct || 0)) / ((latestQuick.sattva_pct || 0) + (latestQuick.rajas_pct || 0) + (latestQuick.tamas_pct || 0)) * 360}deg,
                          #5b6b7a ${((latestQuick.sattva_pct || 0) + (latestQuick.rajas_pct || 0)) / ((latestQuick.sattva_pct || 0) + (latestQuick.rajas_pct || 0) + (latestQuick.tamas_pct || 0)) * 360}deg
                        )`,
                      }}>
                        <div className="w-10 h-10 bg-[#2a2a2a] rounded-full m-[12px]" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-bold text-[#e5e2e1] font-['Plus_Jakarta_Sans']">
                          {latestQuick.prakriti_type}
                        </h2>
                        <p className="text-sm text-[#d3c5ae]">{latestQuick.archetype_title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs font-medium capitalize ${balaColor(latestQuick.sattva_bala)}`}>
                            <Shield size={10} className="inline mr-0.5" />
                            {latestQuick.sattva_bala}
                          </span>
                          <span className="text-xs text-[#9b8f7a]">{formatDate(latestQuick.completed_at)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/${locale}/assessment/intro`}
                    className="bg-[#2a2a2a] rounded-xl border border-[#4f4634]/20 p-5 hover:border-[#f6be39]/30 transition-colors"
                  >
                    <Brain size={22} className="text-[#f6be39] mb-3" />
                    <p className="text-sm font-bold text-[#e5e2e1]">Quick Assessment</p>
                    <p className="text-xs text-[#9b8f7a] mt-1">25 questions, free</p>
                  </Link>

                  {hasDeepAccess ? (
                    <Link
                      to={`/${locale}/deep-assessment`}
                      className="bg-gradient-to-br from-[#f6be39]/15 to-[#d4a017]/10 rounded-xl border border-[#f6be39]/30 p-5 hover:border-[#f6be39]/50 transition-colors"
                    >
                      <Sparkles size={22} className="text-[#f6be39] mb-3" />
                      <p className="text-sm font-bold text-[#e5e2e1]">Deep Assessment</p>
                      <p className="text-xs text-[#f6be39] mt-1">Ready to take</p>
                    </Link>
                  ) : (
                    <Link
                      to={`/${locale}/pricing`}
                      className="bg-[#2a2a2a] rounded-xl border border-[#4f4634]/20 p-5 hover:border-[#f6be39]/30 transition-colors relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#f6be39]/5 to-transparent" />
                      <Sparkles size={22} className="text-[#f6be39] mb-3 relative" />
                      <p className="text-sm font-bold text-[#e5e2e1] relative">Deep Assessment</p>
                      <p className="text-xs text-[#f6be39] mt-1 relative">Unlock for &#x20B9;399</p>
                    </Link>
                  )}
                </div>

                {/* Deep Assessment Results */}
                {deepHistory.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-[#f6be39] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Sparkles size={14} />
                      Deep Assessment Reports
                    </h3>
                    <div className="space-y-2">
                      {deepHistory.map((item) => (
                        <Link
                          key={item.assessment_id}
                          to={`/${locale}/deep-results/${item.assessment_id}`}
                          className="flex items-center gap-3 p-4 bg-[#2a2a2a] rounded-xl border border-[#4f4634]/20 hover:border-[#f6be39]/30 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#f6be39]/10 border border-[#f6be39]/20 flex items-center justify-center flex-shrink-0">
                            <Sparkles size={18} className="text-[#f6be39]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-[#e5e2e1]">
                              {item.prakriti_subtype || item.prakriti_type}
                              {(item.subtype_archetype || item.archetype_title) && (
                                <span className="text-[#d3c5ae] font-normal ml-1.5">
                                  - {item.subtype_archetype || item.archetype_title}
                                </span>
                              )}
                            </p>
                            <span className="text-xs text-[#9b8f7a]">{formatDate(item.completed_at)}</span>
                          </div>
                          <ArrowRight size={16} className="text-[#9b8f7a] group-hover:text-[#f6be39] transition-colors flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Assessment History */}
                {quickHistory.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-[#d3c5ae] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Clock size={14} />
                      Quick Assessment History
                    </h3>
                    <div className="space-y-2">
                      {quickHistory.map((item) => (
                        <Link
                          key={item.assessment_id}
                          to={`/${locale}/results/${item.assessment_id}`}
                          className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-xl border border-[#4f4634]/20 hover:border-[#f6be39]/30 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                            <Award size={16} className="text-[#9b8f7a]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-[#e5e2e1]">
                              {item.prakriti_type}
                              {item.archetype_title && (
                                <span className="text-[#9b8f7a] font-normal ml-1">- {item.archetype_title}</span>
                              )}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-[#9b8f7a]">{formatDate(item.completed_at)}</span>
                              <span className={`text-xs capitalize ${balaColor(item.sattva_bala)}`}>{item.sattva_bala}</span>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-[#9b8f7a] group-hover:text-[#f6be39] transition-colors flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {history.length === 0 && (
                  <div className="text-center py-16 bg-[#2a2a2a] rounded-2xl border border-[#4f4634]/20">
                    <Brain size={36} className="text-[#9b8f7a] mx-auto mb-3" />
                    <p className="text-[#e5e2e1] font-bold mb-1">No assessments yet</p>
                    <p className="text-[#9b8f7a] text-sm mb-6">Discover your mental constitution in under 5 minutes</p>
                    <Link
                      to={`/${locale}/assessment/intro`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full metallic-gold text-[#402d00] font-bold text-sm shadow-xl hover:shadow-[#f6be39]/20 transition-all"
                    >
                      Take Assessment <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
