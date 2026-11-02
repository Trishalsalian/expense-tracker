import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api';

export default function Login({ onAuth }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      onAuth(await api.login(form));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth">
      <h2 className="page-title">Welcome back</h2>
      <form className="card form" onSubmit={submit}>
        <label>Email
          <input name="email" type="email" value={form.email} onChange={change} required />
        </label>
        <label>Password
          <input name="password" type="password" value={form.password} onChange={change} required />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit">Login</button>
        <p className="switch">New here? <Link to="/signup">Create an account</Link></p>
      </form>
    </div>
  );
}