const Student = require('../models/Student');

// Escape special regex characters so user search input can't break the query
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/students?search=&course=&status=
const getStudents = async (req, res) => {
  try {
    const { search, course, status } = req.query;

    // build the filter step by step
    const filter = {};
    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i'); // case-insensitive
      filter.$or = [{ fullName: regex }, { email: regex }, { studentId: regex }];
    }
    if (course) filter.course = course;
    if (status) filter.status = status;

    // newest students first
    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    // invalid id format also ends up here
    res.status(404).json({ message: 'Student not found' });
  }
};

// POST /api/students
const createStudent = async (req, res) => {
  try {
    const {
      studentId, fullName, email, phone, gender, dateOfBirth,
      course, year, address, enrollmentDate, status,
    } = req.body;

    if (
      !studentId || !fullName || !email || !phone || !gender ||
      !dateOfBirth || !course || !year || !address || !enrollmentDate
    ) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // prevent duplicate student IDs
    const existing = await Student.findOne({ studentId });
    if (existing) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }

    const student = await Student.create({
      studentId, fullName, email, phone, gender, dateOfBirth,
      course, year, address, enrollmentDate,
      status: status || 'Active',
    });

    res.status(201).json(student);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const {
      studentId, fullName, email, phone, gender, dateOfBirth,
      course, year, address, enrollmentDate, status,
    } = req.body;

    if (
      !studentId || !fullName || !email || !phone || !gender ||
      !dateOfBirth || !course || !year || !address || !enrollmentDate
    ) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        studentId, fullName, email, phone, gender, dateOfBirth,
        course, year, address, enrollmentDate,
        status: status || 'Active',
      },
      { new: true, runValidators: true } // return the updated document
    );

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    res.status(404).json({ message: 'Student not found' }); // invalid id format
  }
};

// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(404).json({ message: 'Student not found' });
  }
};

module.exports = { getStudents, getStudentById, createStudent, updateStudent, deleteStudent };