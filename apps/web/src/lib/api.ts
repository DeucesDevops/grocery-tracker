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
    create: (data: any) => fetchApi<any>('/items', { method: 'POST', body: JSON.stringify(data) }),
  },
  shops: {
    getAll: () => fetchApi<any[]>('/shops'),
    create: (data: any) => fetchApi<any>('/shops', { method: 'POST', body: JSON.stringify(data) }),
  },
  lists: {
    getAll: () => fetchApi<any[]>('/lists'),
    getById: (id: string) => fetchApi<any>(`/lists/${id}`),
    create: (data: any) => fetchApi<any>('/lists', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<void>(`/lists/${id}`, { method: 'DELETE' }),
    update: (id: string, data: any) => fetchApi<any>(`/lists/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    addItem: (listId: string, data: any) => fetchApi<any>(`/lists/${listId}/items`, { method: 'POST', body: JSON.stringify(data) }),
    toggleItem: (listItemId: string, checked: boolean) => fetchApi<any>(`/lists/items/${listItemId}`, { method: 'PATCH', body: JSON.stringify({ checked }) }),
    finishTrip: (id: string, data: any) => fetchApi<any>(`/lists/${id}/finish`, { method: 'POST', body: JSON.stringify(data) }),
  },
};
