import { Link } from 'react-router-dom';

export default function StudentTable({ students, onDelete }) {
  if (!students || students.length === 0) {
    return (
      <div className="table-wrapper">
        <p className="empty-text">No students found.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Year</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.studentId}</td>
              <td>{s.fullName}</td>
              <td>{s.email}</td>
              <td>{s.course}</td>
              <td>{s.year}</td>
              <td>
                <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                  {s.status}
                </span>
              </td>
              <td className="actions-cell">
                <Link className="btn btn-sm btn-outline" to={`/students/${s._id}`}>View</Link>
                <Link className="btn btn-sm btn-primary" to={`/students/edit/${s._id}`}>Edit</Link>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(s)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}