import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const COLORS = ['#8B5CF6', '#B026FF', '#39FF14', '#00E5FF', '#FF3CAC', '#FFD93D', '#FF6B6B'];
const tip = {
  contentStyle: { background: '#15151F', border: '1px solid #B026FF', borderRadius: 8, color: '#fff' },
  itemStyle: { color: '#fff' },
};

export default function Analytics({ expenses }) {
  const cat = {};
  const mon = {};
  expenses.forEach((e) => {
    cat[e.category] = (cat[e.category] || 0) + e.amount;
    const m = e.date.slice(0, 7);
    mon[m] = (mon[m] || 0) + e.amount;
  });
  const catData = Object.entries(cat).map(([name, value]) => ({ name, value }));
  const monData = Object.entries(mon)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, total]) => ({ month, total }));

  if (!expenses.length)
    return (<><h2 className="page-title">Analytics</h2><p className="empty">Add some expenses to see charts.</p></>);

  return (
    <>
      <h2 className="page-title">Analytics</h2>
      <div className="card">
        <h3>By Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={catData} dataKey="value" nameKey="name" outerRadius={100} label>
              {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip {...tip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3>By Month</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monData}>
            <CartesianGrid stroke="#26263A" />
            <XAxis dataKey="month" stroke="#8A8AA0" />
            <YAxis stroke="#8A8AA0" />
            <Tooltip {...tip} cursor={{ fill: 'rgba(139,92,246,.15)' }} />
            <Bar dataKey="total" fill="#B026FF" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}