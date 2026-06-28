import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import '../Login/Auth.css';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', skills: '', bio: '', github: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      const res = await api.post('/auth/register', payload);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page page">
      <div className="auth-box">
        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Join the DevHub community</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required />
          </div>
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, Python" />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows={2} />
          </div>
          <div className="form-group">
            <label>GitHub URL</label>
            <input name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/username" />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <Button type="submit" loading={loading} size="lg" style={{ width: '100%' }}>Create Account</Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}