const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
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

export const portfolioApi = {
  list: () => request('/portfolios'),
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

export const aiApi = {
  ask: (question, candidateContext) =>
    request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ question, candidateContext }),
    }),
};

export default { portfolioApi, githubApi, aiApi };
