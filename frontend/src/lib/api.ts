const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

// ── Manas API types ──

export interface ApiQuestion {
  id: number;
  section: string;
  question_number: number;
  text_en: string;
  bhava_tag: string;
  bhava_description_en: string;
}

export interface ApiAnswerItem {
  question_id: number;
  answer: string; // "YES" | "NO" | "SOMETIMES"
}

export interface ApiDemographics {
  age: number;
  gender: 'male' | 'female';
  diet: 'vegetarian' | 'non_vegetarian' | 'vegan';
  work_nature: 'desk' | 'physical' | 'creative' | 'mixed';
  sleep_quality: 'good' | 'average' | 'poor';
}

export interface ApiSubmitRequest {
  assessment_type: string;
  locale: string;
  answers: ApiAnswerItem[];
  user_id?: string;
  demographics?: ApiDemographics;
}

export interface ApiResult {
  id: string;
  assessment_id: string;
  sattva_yes: number;
  sattva_no: number;
  sattva_sometimes: number;
  rajas_yes: number;
  rajas_no: number;
  rajas_sometimes: number;
  tamas_yes: number;
  tamas_no: number;
  tamas_sometimes: number;
  sattva_primary_pct: number;
  rajas_primary_pct: number;
  tamas_primary_pct: number;
  sattva_secondary_pct: number;
  rajas_secondary_pct: number;
  tamas_secondary_pct: number;
  primary_dominant_guna: string;
  secondary_dominant_guna: string | null;
  prakriti_type: string;
  prakriti_subtype: string | null;
  archetype_title: string | null;
  subtype_key: string | null;
  subtype_archetype: string | null;
  subtype_animal: string | null;
  bhava_scores: Record<string, number> | null;
  sattva_bala: string;
  ai_insights: Record<string, string> | null;
  created_at: string;
}

export interface RazorpayOrder {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface PurchaseInfo {
  id: string;
  product: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string | null;
}

export const manas = {
  getQuestions: (type = 'quick', locale = 'en') =>
    api.get<{ questions: ApiQuestion[] }>('/api/v1/questions', { params: { type, locale } }),

  submitAssessment: (data: ApiSubmitRequest) =>
    api.post<ApiResult>('/api/v1/assessments/submit', data),

  getResult: (assessmentId: string) =>
    api.get<ApiResult>(`/api/v1/results/${assessmentId}`),

  streamInsights: (assessmentId: string, locale = 'en') => {
    const url = `${API_BASE_URL}/api/v1/results/${assessmentId}/insights?locale=${locale}`;
    return fetch(url);
  },

  // Auth
  register: (email: string, name: string, password: string) =>
    api.post<{ access_token: string; user: Record<string, unknown> }>('/api/v1/auth/register', { email, name, password }),

  login: (email: string, password: string) =>
    api.post<{ access_token: string; user: Record<string, unknown> }>('/api/v1/auth/login', { email, password }),

  // Resume
  saveProgress: (userId: string, assessmentType: string, currentQuestionIndex: number, answers: ApiAnswerItem[]) =>
    api.post('/api/v1/assessments/save-progress', {
      user_id: userId, assessment_type: assessmentType,
      current_question_index: currentQuestionIndex, locale: 'en', answers,
    }),

  getResumeData: (userId: string) =>
    api.get<{ has_progress: boolean; assessment_id?: string; answers?: Array<{ question_id: number; answer: string }> }>(
      `/api/v1/assessments/resume/${userId}`
    ),

  getUserHistory: (userId: string) =>
    api.get<{ history: Array<{ assessment_id: string; prakriti_type: string; archetype_title: string; completed_at: string; sattva_bala: string }> }>(
      `/api/v1/assessments/history/${userId}`
    ),

  getUserDemographics: (userId: string) =>
    api.get<{ has_demographics: boolean; demographics?: ApiDemographics }>(
      `/api/v1/assessments/demographics/${userId}`
    ),

  // Payments
  createOrder: (userId: string, product = 'deep_assessment') =>
    api.post<RazorpayOrder>('/api/v1/payments/create-order', { user_id: userId, product }),

  verifyPayment: (userId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) =>
    api.post<{ status: string; purchase_id: string; product: string }>('/api/v1/payments/verify', {
      user_id: userId,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    }),

  getPurchases: (userId: string) =>
    api.get<{ purchases: PurchaseInfo[] }>(`/api/v1/payments/purchases/${userId}`),

  hasAccess: (userId: string, product = 'deep_assessment') =>
    api.get<{ has_access: boolean }>(`/api/v1/payments/has-access/${userId}/${product}`),

  // Subtype profile
  getSubtypeProfile: (assessmentId: string) =>
    api.get<{ has_profile: boolean; subtype_key?: string; profile?: Record<string, unknown> }>(
      `/api/v1/results/${assessmentId}/subtype-profile`
    ),

  // Deep insights (premium)
  streamDeepInsights: (assessmentId: string, userId: string, locale = 'en') => {
    const url = `${API_BASE_URL}/api/v1/results/${assessmentId}/deep-insights?user_id=${userId}&locale=${locale}`;
    return fetch(url);
  },
};
