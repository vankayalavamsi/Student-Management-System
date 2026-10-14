import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // fetch fresh account info from the protected /auth/me endpoint
  useEffect(() => {
    api.get('/auth/me')
      .then((res) => setUser(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Something went wrong'));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {user && (
        <div className="card">
          <div className="card-header">Account Information</div>
          <div className="detail-grid">
            <div className="detail-row">
              <div className="detail-label">Name</div>
              <div className="detail-value">{user.name}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Email</div>
              <div className="detail-value">{user.email}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Role</div>
              <div className="detail-value">{user.role}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Account Created</div>
              <div className="detail-value">{new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}

      <p className="hint-text">Note: passwords are never displayed or returned by the API.</p>
    </div>
  );
}