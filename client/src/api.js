const json = (r) => {
  if (!r.ok) throw new Error('Request failed');
  return r.json();
};
const send = (url, method, body) =>
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(json);

export const getExpenses = () => fetch('/api/expenses').then(json);
export const addExpense = (e) => send('/api/expenses', 'POST', e);
export const updateExpense = (id, e) => send(`/api/expenses/${id}`, 'PUT', e);
export const deleteExpense = (id) =>
  fetch(`/api/expenses/${id}`, { method: 'DELETE' }).then(json);
export const getBudgets = () => fetch('/api/budgets').then(json);
export const saveBudgets = (b) => send('/api/budgets', 'PUT', b);