const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  dashboard: {
    getSummary: () => fetchApi<{
      monthlySpend: number;
      budgetRemaining: number;
      activeLists: number;
      savedViaDeals: number;
    }>('/dashboard/summary'),
    getActiveLists: () => fetchApi<any[]>('/dashboard/active-lists'),
    getRecentExpenses: () => fetchApi<any[]>('/dashboard/recent-expenses'),
  },
  items: {
    getAll: () => fetchApi<any[]>('/items'),
  },
  shops: {
    getAll: () => fetchApi<any[]>('/shops'),
  },
  lists: {
    getAll: () => fetchApi<any[]>('/lists'),
    getById: (id: string) => fetchApi<any>(`/lists/${id}`),
  },
};
