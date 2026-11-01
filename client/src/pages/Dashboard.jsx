import { Link } from 'react-router-dom';
import { money, thisMonth } from '../utils';

export default function Dashboard({ expenses }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const month = expenses
    .filter((e) => e.date.startsWith(thisMonth()))
    .reduce((s, e) => s + e.amount, 0);
  const byCat = {};
  expenses.forEach((e) => (byCat[e.category] = (byCat[e.category] || 0) + e.amount));
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  const recent = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <>
      <h2 className="page-title">Dashboard</h2>
      <div className="grid">
        <div className="card stat"><div className="label">Total Spent</div><div className="value">{money(total)}</div></div>
        <div className="card stat"><div className="label">This Month</div><div className="value purple">{money(month)}</div></div>
        <div className="card stat"><div className="label">Top Category</div><div className="value purple">{top ? top[0] : '—'}</div></div>
      </div>
      <div className="card">
        <h3>Recent Expenses</h3>
        {recent.map((e) => (
          <div className="row" key={e.id}>
            <div>
              <strong>{e.title}</strong><span className="badge">{e.category}</span>
              <div className="meta">{e.date}</div>
            </div>
            <div className="amount">{money(e.amount)}</div>
          </div>
        ))}
        {!recent.length && <p className="empty">No expenses yet. <Link to="/add">Add one</Link></p>}
      </div>
    </>
  );
}