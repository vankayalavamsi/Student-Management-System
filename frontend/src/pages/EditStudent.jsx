import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import StudentForm from '../components/StudentForm';

// "2004-05-14T00:00:00.000Z" -> "2004-05-14" (format needed by <input type="date">)
const toDateInput = (value) => (value ? new Date(value).toISOString().split('T')[0] : '');

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // load the existing student so we can pre-fill the form
  useEffect(() => {
    api.get(`/students/${id}`)
      .then((res) => setStudent(res.data))
      .catch(() => navigate('/students'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (formData) => {
    await api.put(`/students/${id}`, formData);
    navigate('/students', { state: { message: 'Student updated successfully' } });
  };

  if (loading) return <p className="loading-text">Loading student...</p>;
  if (!student) return null;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Edit Student</h1>
        <Link to="/students" className="btn btn-outline">Back to Students</Link>
      </div>

      <div className="card">
        <div className="card-body">
          <StudentForm
            initialData={{
              studentId: student.studentId,
              fullName: student.fullName,
              email: student.email,
              phone: student.phone,
              gender: student.gender,
              dateOfBirth: toDateInput(student.dateOfBirth),
              course: student.course,
              year: student.year,
              address: student.address,
              enrollmentDate: toDateInput(student.enrollmentDate),
              status: student.status,
            }}
            onSubmit={handleSubmit}
            submitLabel="Update Student"
          />
        </div>
      </div>
    </div>
  );
}