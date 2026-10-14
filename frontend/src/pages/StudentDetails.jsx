import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

export default function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/students/${id}`)
      .then((res) => setStudent(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Student not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '-');

  if (loading) return <p className="loading-text">Loading student...</p>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Student Details</h1>
        <div className="page-actions">
          <Link to="/students" className="btn btn-outline">Back</Link>
          {student && (
            <Link to={`/students/edit/${student._id}`} className="btn btn-primary">Edit</Link>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {student && (
        <div className="card">
          <div className="card-header">
            <span>{student.fullName}</span>
            <span className={`badge ${student.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
              {student.status}
            </span>
          </div>

          <div className="detail-grid">
            <div className="detail-row">
              <div className="detail-label">Student ID</div>
              <div className="detail-value">{student.studentId}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Full Name</div>
              <div className="detail-value">{student.fullName}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Email</div>
              <div className="detail-value">{student.email}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Phone</div>
              <div className="detail-value">{student.phone}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Gender</div>
              <div className="detail-value">{student.gender}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Date of Birth</div>
              <div className="detail-value">{formatDate(student.dateOfBirth)}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Course</div>
              <div className="detail-value">{student.course}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Year</div>
              <div className="detail-value">{student.year}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Enrollment Date</div>
              <div className="detail-value">{formatDate(student.enrollmentDate)}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Status</div>
              <div className="detail-value">{student.status}</div>
            </div>
            <div className="detail-row full">
              <div className="detail-label">Address</div>
              <div className="detail-value">{student.address}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}