const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('craftcv_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.response = { status: response.status, data };
    throw error;
  }

  return data;
};

export const authApi = {
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => request('/auth/me'),
};

export const portfolioApi = {
  list: (userId) => request(`/portfolios${userId ? `?userId=${userId}` : ''}`),
  get: (id) => request(`/portfolios/${id}`),
  save: (data) =>
    request('/portfolios', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/portfolios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/portfolios/${id}`, {
      method: 'DELETE',
    }),
};

export const githubApi = {
  ingest: (username) => request(`/github/${encodeURIComponent(username)}`),
};

export default { authApi, portfolioApi, githubApi };
