export const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Bills',
  'Entertainment', 'Health', 'Other',
];
export const CURRENCY = '₹';
export const money = (n) => CURRENCY + Number(n || 0).toLocaleString();
export const thisMonth = () => new Date().toISOString().slice(0, 7);