import { useEffect, useState } from 'react';
import * as api from '../api';
import { CATEGORIES, money, thisMonth } from '../utils';

export default function Budget({ expenses, budgets, reload }) {
  const [draft, setDraft] = useState(budgets);
  useEffect(() => setDraft(budgets), [budgets]);

  const spent = (c) =>
    expenses
      .filter((e) => e.category === c && e.date.startsWith(thisMonth()))
      .reduce((s, e) => s + e.amount, 0);

  const save = async () => {
    const clean = {};
    CATEGORIES.forEach((c) => (clean[c] = Number(draft[c]) || 0));
    await api.saveBudgets(clean);
    await reload();
    alert('Budgets saved!');
  };

  return (
    <>
      <h2 className="page-title">Monthly Budget</h2>
      {CATEGORIES.map((c) => {
        const limit = Number(draft[c]) || 0;
        const s = spent(c);
        const pct = limit ? (s / limit) * 100 : 0;
        return (
          <div className="card" key={c}>
            <div className="budget-head">
              <strong>{c}</strong>
              <input
                type="number"
                min="0"
                value={draft[c] ?? ''}
                onChange={(e) => setDraft({ ...draft, [c]: e.target.value })}
              />
            </div>
            <div className="bar">
              <div className={pct > 100 ? 'over' : ''} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <div className="meta">{money(s)} of {money(limit)} ({Math.round(pct)}%)</div>
          </div>
        );
      })}
      <button className="btn" onClick={save}>Save Budgets</button>
    </>
  );
}