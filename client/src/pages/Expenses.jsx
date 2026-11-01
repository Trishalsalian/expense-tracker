import { useState } from 'react';
import * as api from '../api';
import { CATEGORIES, money } from '../utils';
import ExpenseForm from '../components/ExpenseForm';

export default function Expenses({ expenses, reload }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [editing, setEditing] = useState(null);

  const list = expenses.filter(
    (e) =>
      (cat === 'All' || e.category === cat) &&
      e.title.toLowerCase().includes(q.toLowerCase())
  );

  const remove = async (id) => {
    if (window.confirm('Delete this expense?')) {
      await api.deleteExpense(id);
      reload();
    }
  };
  const save = async (form) => {
    await api.updateExpense(editing.id, form);
    setEditing(null);
    reload();
  };

  return (
    <>
      <h2 className="page-title">Expenses</h2>
      {editing && (
        <ExpenseForm initial={editing} onSubmit={save} submitLabel="Save Changes" onCancel={() => setEditing(null)} />
      )}
      <div className="filters">
        <input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option>All</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="card">
        {list.map((e) => (
          <div className="row" key={e.id}>
            <div>
              <strong>{e.title}</strong><span className="badge">{e.category}</span>
              <div className="meta">{e.date}{e.note && ` • ${e.note}`}</div>
            </div>
            <div className="actions">
              <span className="amount">{money(e.amount)}</span>
              <button className="btn small ghost" onClick={() => setEditing(e)}>Edit</button>
              <button className="btn small danger" onClick={() => remove(e.id)}>Delete</button>
            </div>
          </div>
        ))}
        {!list.length && <p className="empty">No expenses found.</p>}
      </div>
    </>
  );
}