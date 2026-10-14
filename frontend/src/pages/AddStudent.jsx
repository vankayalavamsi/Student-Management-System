import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StudentForm from '../components/StudentForm';

export default function AddStudent() {
  const navigate = useNavigate();

  // StudentForm validates first; if the API call fails it throws and
  // StudentForm shows the error message.
  const handleSubmit = async (formData) => {
    await api.post('/students', formData);
    navigate('/students', { state: { message: 'Student added successfully' } });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Add Student</h1>
        <Link to="/students" className="btn btn-outline">Back to Students</Link>
      </div>

      <div className="card">
        <div className="card-body">
          <StudentForm onSubmit={handleSubmit} submitLabel="Add Student" />
        </div>
      </div>
    </div>
  );
}