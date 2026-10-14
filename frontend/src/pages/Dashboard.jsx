import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/students')
      .then((res) => setStudents(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Something went wrong'))
      .finally(() => setLoading(false));
  }, []);

  // simple stats calculated from the full list (already sorted newest first)
  const total = students.length;
  const active = students.filter((s) => s.status === 'Active').length;
  const inactive = total - active;
  const totalCourses = new Set(students.map((s) => s.course)).size;
  const recentStudents = students.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <Link to="/students/add" className="btn btn-primary">+ Add Student</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{active}</div>
          <div className="stat-label">Active Students</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-value">{inactive}</div>
          <div className="stat-label">Inactive Students</div>
        </div>
        <div className="stat-card gray">
          <div className="stat-value">{totalCourses}</div>
          <div className="stat-label">Total Courses</div>
        </div>
      </div>

      <h2 className="section-title">Recent Students</h2>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Year</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((s) => (
                <tr key={s._id}>
                  <td><Link to={`/students/${s._id}`}>{s.studentId}</Link></td>
                  <td>{s.fullName}</td>
                  <td>{s.course}</td>
                  <td>{s.year}</td>
                  <td>
                    <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link to="/students" className="view-all-link">View all students →</Link>
    </div>
  );
}