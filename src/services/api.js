const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('food_store_token');

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'The request failed.');
  }

  return data;
}

export const api = {
  register: (payload) => apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => apiRequest('/api/auth/me'),
  products: () => apiRequest('/api/products')
};
