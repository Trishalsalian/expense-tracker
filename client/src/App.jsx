import { useEffect, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import * as api from './api';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';

const tabs = [
  ['/', 'Dashboard'],
  ['/expenses', 'Expenses'],
  ['/add', 'Add'],
  ['/analytics', 'Analytics'],
  ['/budget', 'Budget'],
];

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});

  const load = async () => {
    setExpenses(await api.getExpenses());
    setBudgets(await api.getBudgets());
  };
  useEffect(() => { load(); }, []);

  return (
    <>
      <nav className="nav">
        <h1 className="logo">💜 SpendWise</h1>
        <div className="tabs">
          {tabs.map(([to, label]) => (
            <NavLink key={to} to={to} end>{label}</NavLink>
          ))}
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard expenses={expenses} />} />
          <Route path="/expenses" element={<Expenses expenses={expenses} reload={load} />} />
          <Route path="/add" element={<AddExpense reload={load} />} />
          <Route path="/analytics" element={<Analytics expenses={expenses} />} />
          <Route path="/budget" element={<Budget expenses={expenses} budgets={budgets} reload={load} />} />
        </Routes>
      </main>
    </>
  );
}