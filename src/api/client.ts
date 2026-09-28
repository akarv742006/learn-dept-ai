// Centralized Fetch API Client for LearnDebt AI Backend

const customApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '');
const API_BASE_URL = customApiUrl ? (customApiUrl.endsWith('/api') ? customApiUrl : `${customApiUrl}/api`) : '/api';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('learndebt_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = typeof errorData.detail === 'string' 
          ? errorData.detail 
          : JSON.stringify(errorData.detail);
      }
    } catch (e) {
      // Ignore JSON parse error on non-json error responses
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
