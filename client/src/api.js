const getToken = () => localStorage.getItem('token');

const request = async (url, method = 'GET', body) => {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && getToken()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data.error || 'Request failed');
  }
  return data;
};

export const signup = (b) => request('/api/auth/signup', 'POST', b);
export const login = (b) => request('/api/auth/login', 'POST', b);

export const getExpenses = () => request('/api/expenses');
export const addExpense = (e) => request('/api/expenses', 'POST', e);
export const updateExpense = (id, e) => request(`/api/expenses/${id}`, 'PUT', e);
export const deleteExpense = (id) => request(`/api/expenses/${id}`, 'DELETE');
export const getBudgets = () => request('/api/budgets');
export const saveBudgets = (b) => request('/api/budgets', 'PUT', b);