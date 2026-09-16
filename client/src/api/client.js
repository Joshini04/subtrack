const API_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const auth = {
  signup: (name, email, password) =>
    apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  login: (email, password) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
};

export const subscriptions = {
  getAll: () => apiRequest('/subscriptions'),
  getRenewingSoon: (days = 30) => apiRequest(`/subscriptions/renewing-soon?days=${days}`),
  create: (sub) => apiRequest('/subscriptions', { method: 'POST', body: JSON.stringify(sub) }),
  update: (id, sub) => apiRequest(`/subscriptions/${id}`, { method: 'PUT', body: JSON.stringify(sub) }),
  delete: (id) => apiRequest(`/subscriptions/${id}`, { method: 'DELETE' }),
};

export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export function isLoggedIn() {
  return !!getToken();
}