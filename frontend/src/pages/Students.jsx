import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StudentTable from '../components/StudentTable';

// Static list for the course filter (add more courses here if needed)
const COURSES = ['BCA', 'B.Tech', 'B.Com', 'B.Sc', 'MBA', 'MCA'];

export default function Students() {
  const location = useLocation();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // success message passed from the Add/Edit pages
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      navigate(location.pathname, { replace: true }); // clear it so refresh doesn't re-show it
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto-hide the success message after 3 seconds
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (course) params.course = course;
      if (status) params.status = status;

      const res = await api.get('/students', { params });
      setStudents(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // refetch whenever a filter changes (small delay so typing feels smooth)
  useEffect(() => {
    const t = setTimeout(fetchStudents, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, course, status]);

  const handleDelete = async (student) => {
    const ok = window.confirm(
      `Delete ${student.fullName} (${student.studentId})? This cannot be undone.`
    );
    if (!ok) return;

    try {
      await api.delete(`/students/${student._id}`);
      setStudents((prev) => prev.filter((s) => s._id !== student._id));
      setMessage('Student deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Students</h1>
        <Link to="/students/add" className="btn btn-primary">+ Add Student</Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="filters">
        <input
          className="input search-input"
          type="text"
          placeholder="Search by name, email or student ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="">All Courses</option>
          {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-text">Loading students...</p>
      ) : (
        <StudentTable students={students} onDelete={handleDelete} />
      )}
    </div>
  );
}