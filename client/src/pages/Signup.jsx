import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api';

export default function Signup({ onAuth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      onAuth(await api.signup(form));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth">
      <h2 className="page-title">Create account</h2>
      <form className="card form" onSubmit={submit}>
        <label>Name
          <input name="name" value={form.name} onChange={change} required />
        </label>
        <label>Email
          <input name="email" type="email" value={form.email} onChange={change} required />
        </label>
        <label>Password (min 6 characters)
          <input name="password" type="password" minLength="6" value={form.password} onChange={change} required />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit">Sign up</button>
        <p className="switch">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}