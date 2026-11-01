import { useState } from 'react';
import { CATEGORIES } from '../utils';

const empty = () => ({
  title: '',
  amount: '',
  category: CATEGORIES[0],
  date: new Date().toISOString().slice(0, 10),
  note: '',
});

export default function ExpenseForm({ initial, onSubmit, submitLabel = 'Add Expense', onCancel }) {
  const [form, setForm] = useState(initial || empty());
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    await onSubmit(form);
    if (!initial) setForm(empty());
  };

  return (
    <form className="card form" onSubmit={submit}>
      <label>Title
        <input name="title" value={form.title} onChange={change} required />
      </label>
      <label>Amount
        <input name="amount" type="number" min="1" value={form.amount} onChange={change} required />
      </label>
      <label>Category
        <select name="category" value={form.category} onChange={change}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label>Date
        <input name="date" type="date" value={form.date} onChange={change} required />
      </label>
      <label>Note (optional)
        <textarea name="note" rows="2" value={form.note} onChange={change} />
      </label>
      <div className="actions">
        <button className="btn" type="submit">{submitLabel}</button>
        {onCancel && <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}