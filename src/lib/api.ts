/**
 * API client for Laravel backend
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://myunipath-production-6387.up.railway.app/api';

function getSessionId(): string {
  let id = localStorage.getItem('myunipath_session_id');
  if (!id) {
    id = crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toSthring(36).slice(2);
    localStorage.setItem('myunipath_session_id', id);
  }
  return id;
}

export function setApiSessionId(id: string) {
  localStorage.setItem('myunipath_session_id', id);
}

export function clearApiSessionId() {
  localStorage.removeItem('myunipath_session_id');
}

async function fetchApi<T>(
  path: string,
  options: RequestInit & { params?: Record<string, string> } = {}
): Promise<T> {
  const { params, ...fetchOpts } = options;
  let url = `${API_BASE}${path}`;
  if (params && Object.keys(params).length > 0) {
    url += '?' + new URLSearchParams(params).toString();
  }
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'X-Session-Id': getSessionId(),
    ...(typeof fetchOpts.headers === 'object' && !(fetchOpts.headers instanceof Headers)
      ? (fetchOpts.headers as Record<string, string>)
      : {}),
  };
  
  // Set JSON content type only if body is not FormData
  if (fetchOpts.body && !(fetchOpts.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  } else if (!fetchOpts.body) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const res = await fetch(url, { ...fetchOpts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  getPrograms: () => fetchApi<Array<{
    id: number;
    slug: string;
    name: string;
    icon: string;
    short_desc: string;
    color: string;
    description?: string;
    duration?: string;
    fees?: string;
    requirements?: string[];
    careers?: string[];
    highlights?: string[];
    why_this_program?: Record<string, string>;
  }>>('/programs'),

  getProgram: (slug: string) =>
    fetchApi<{
      id: number;
      slug: string;
      name: string;
      icon: string;
      short_desc: string;
      color: string;
      description?: string;
      duration?: string;
      fees?: string;
      requirements?: string[];
      careers?: string[];
      highlights?: string[];
      why_this_program?: Record<string, string>;
    }>(`/programs/${slug}`),

  getQuizQuestions: () =>
    fetchApi<Array<{ id: number; question: string; options: Array<{ text: string; persona: string; icon: string; logic: number; creative: number }> }>>('/quiz/questions'),

  submitQuiz: (data: {
    persona: string;
    logic_score: number;
    creative_score: number;
    answers?: Array<{ logic: number; creative: number; persona: string }>;
    recommended_program_ids: string[];
  }) =>
    fetchApi<{ success: boolean; completion_id: number }>('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getRecommendation: (answers: string[]) =>
    fetchApi<{ success: boolean; persona: string; score_breakdown: Record<string, number> }>('/recommend', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  createStudent: (data: { name: string; email: string; password?: string; age?: string; school_name?: string; phone_number?: string; persona?: string; quiz_completed?: boolean; highest_qualification?: string; transcript?: File | null }) => {
    if (data.transcript) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });
      return fetchApi<{ success: boolean; student: any }>('/students', {
        method: 'POST',
        body: formData,
      });
    }
    return fetchApi<{ success: boolean; student: any }>('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  loginStudent: (data: { email: string; password?: string }) =>
    fetchApi<{ success: boolean; student: any }>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () =>
    fetchApi<{ success: boolean; student: any }>('/students/me'),

  updateStudent: (data: { name: string; email: string; password?: string; age?: string; school_name?: string; phone_number?: string; highest_qualification?: string; transcript?: File | null }) => {
    if (data.transcript) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });
      // Laravel needs _method=PATCH when sending FormData
      formData.append('_method', 'PATCH');
      return fetchApi<{ success: boolean; student: any }>('/students/me', {
        method: 'POST', 
        body: formData,
      });
    }
    return fetchApi<{ success: boolean; student: any }>('/students/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  getStudents: () =>
    fetchApi<{ success: boolean; students: any[] }>('/students'),

  // Admin: update any student by id. Requires the admin password.
  adminUpdateStudent: (
    id: number,
    data: Partial<{ name: string; email: string; age: number | string; persona: string; highest_qualification: string }>,
    adminPassword: string
  ) =>
    fetchApi<{ success: boolean; student: any }>(`/admin/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'X-Admin-Password': adminPassword },
    }),

  // Admin: delete a student by id. Requires the admin password.
  adminDeleteStudent: (id: number, adminPassword: string) =>
    fetchApi<{ success: boolean }>(`/admin/students/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Password': adminPassword },
    }),

  getAnalytics: (password: string) =>
    fetchApi<{
      totalParticipants: number;
      totalRegistered: number;
      quizCompletedCount: number;
      completionRate: number;
      personaCounts: Record<string, number>;
      programCounts: Record<string, number>;
      schoolCounts: Record<string, number>;
      qualificationCounts: Record<string, number>;
      ageCounts: Record<string, number>;
      avgXp: number;
      levelCounts: Record<string, number>;
      dailyRegistrations: Record<string, number>;
      dailyCompletions: Record<string, number>;
      completions: Array<{ id: number; persona: string; program_ids: string[]; created_at: string }>;
    }>('/analytics/dashboard', {
      headers: { 'X-Admin-Password': password },
    }),

  analyticsLogin: (password: string) =>
    fetchApi<{ success: boolean }>('/analytics/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: { 'Content-Type': 'application/json' },
    }),

  updateXp: (data: { xp_earned: number; best_combo?: number }) =>
    fetchApi<{ success: boolean; xp: number; level: number; quiz_count: number; best_combo: number; leveled_up: boolean }>('/students/me/xp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
