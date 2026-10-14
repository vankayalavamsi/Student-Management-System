import { useState } from 'react';

const COURSES = ['BCA', 'B.Tech', 'B.Com', 'B.Sc', 'MBA', 'MCA'];
const YEARS = ['1', '2', '3', '4'];

const EMPTY_FORM = {
  studentId: '', fullName: '', email: '', phone: '', gender: '',
  dateOfBirth: '', course: '', year: '', address: '',
  enrollmentDate: '', status: 'Active',
};

export default function StudentForm({ initialData, onSubmit, submitLabel = 'Save Student' }) {
  const [form, setForm] = useState(initialData || EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const requiredFields = [
      'studentId', 'fullName', 'email', 'phone', 'gender',
      'dateOfBirth', 'course', 'year', 'address', 'enrollmentDate',
    ];
    for (const field of requiredFields) {
      if (!String(form[field]).trim()) return 'Please fill all required fields';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return 'Please enter a valid email address';
    }
    if (!/^[0-9+\-\s]{7,15}$/.test(form.phone)) {
      return 'Please enter a valid phone number';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSubmit(form); // parent does the API call
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label>Student ID <span className="required">*</span></label>
          <input type="text" name="studentId" value={form.studentId} onChange={handleChange} placeholder="e.g. STU010" />
        </div>

        <div className="form-group">
          <label>Full Name <span className="required">*</span></label>
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="e.g. Rahul Kumar" />
        </div>

        <div className="form-group">
          <label>Email <span className="required">*</span></label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="rahul@example.com" />
        </div>

        <div className="form-group">
          <label>Phone <span className="required">*</span></label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
        </div>

        <div className="form-group">
          <label>Gender <span className="required">*</span></label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date of Birth <span className="required">*</span></label>
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Course <span className="required">*</span></label>
          <select name="course" value={form.course} onChange={handleChange}>
            <option value="">Select course</option>
            {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Year <span className="required">*</span></label>
          <select name="year" value={form.year} onChange={handleChange}>
            <option value="">Select year</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Enrollment Date <span className="required">*</span></label>
          <input type="date" name="enrollmentDate" value={form.enrollmentDate} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="form-group full">
          <label>Address <span className="required">*</span></label>
          <textarea name="address" value={form.address} onChange={handleChange} placeholder="City, State" />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}