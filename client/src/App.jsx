import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import * as api from './api';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';
import Login from './pages/Login';
import Signup from './pages/Signup';

const tabs = [
  ['/', 'Dashboard'],
  ['/expenses', 'Expenses'],
  ['/add', 'Add'],
  ['/analytics', 'Analytics'],
  ['/budget', 'Budget'],
];

export default function App() {
  const nav = useNavigate();
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});

  const load = async () => {
    try {
      setExpenses(await api.getExpenses());
      setBudgets(await api.getBudgets());
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => { if (user) load(); }, [user]);

  const onAuth = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    nav('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setExpenses([]);
    setBudgets({});
    nav('/login');
  };

  if (!user) {
    return (
      <>
        <nav className="nav"><h1 className="logo">💜 SpendWise</h1></nav>
        <main>
          <Routes>
            <Route path="/login" element={<Login onAuth={onAuth} />} />
            <Route path="/signup" element={<Signup onAuth={onAuth} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </>
    );
  }

  return (
    <>
      <nav className="nav">
        <h1 className="logo">💜 SpendWise</h1>
        <div className="tabs">
          {tabs.map(([to, label]) => (
            <NavLink key={to} to={to} end>{label}</NavLink>
          ))}
        </div>
        <div className="userbox">
          <span>Hi, {user.name}</span>
          <button className="btn small ghost" onClick={logout}>Logout</button>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard expenses={expenses} />} />
          <Route path="/expenses" element={<Expenses expenses={expenses} reload={load} />} />
          <Route path="/add" element={<AddExpense reload={load} />} />
          <Route path="/analytics" element={<Analytics expenses={expenses} />} />
          <Route path="/budget" element={<Budget expenses={expenses} budgets={budgets} reload={load} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}