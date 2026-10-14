import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.demo ? 'demo@example.com' : '');
  const [password, setPassword] = useState(location.state?.demo ? 'Demo@123' : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });

      // save the session, then go to the dashboard
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // fills the demo credentials (real login still goes through the backend)
  const fillDemoAccount = () => {
    setEmail('demo@example.com');
    setPassword('Demo@123');
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-app-name">Student Management</p>
        <h1 className="auth-heading">Welcome Back</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button type="button" className="btn btn-outline btn-block demo-btn" onClick={fillDemoAccount}>
          Use Demo Account
        </button>

        <div className="demo-box">
          <strong>Demo Account</strong>
          <span>Email: demo@example.com</span>
          <span>Password: Demo@123</span>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}