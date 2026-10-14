// Entry point of the backend
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const User = require('./models/User');
const Student = require('./models/Student');

const app = express();

app.use(cors());         // allow the React app to call this API
app.use(express.json()); // parse JSON request bodies

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));

// simple health check
app.get('/', (req, res) => res.send('Student Management System API is running...'));

// 404 for unknown routes
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// central error handler - never leaks internal errors to the client
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: 'Something went wrong' });
});

// ---------------------------------------------------------
// Demo data (runs once on startup, never creates duplicates)
// ---------------------------------------------------------
async function seedDemoData() {
  try {
    // 1. Demo admin user - password is hashed by the User model
    const demoUser = await User.findOne({ email: 'demo@example.com' });
    if (!demoUser) {
      await User.create({
        name: 'Demo Admin',
        email: 'demo@example.com',
        password: 'Demo@123', // plain text here, hashed before saving
        role: 'admin',
      });
      console.log('Demo user created: demo@example.com / Demo@123');
    }

    // 2. Demo students - only if the collection is empty
    const count = await Student.countDocuments();
    if (count === 0) {
      await Student.create([
        { studentId: 'STU001', fullName: 'Vaun Kumar',  email: 'vaun@example.com',   phone: '9876543210', gender: 'Male', dateOfBirth: '2004-03-12', course: 'BCA',    year: '2', address: 'Hyderabad, Telangana',        enrollmentDate: '2023-08-01', status: 'Active' },
        { studentId: 'STU002', fullName: 'Pavan Kumar', email: 'pavan@example.com',  phone: '9876543211', gender: 'Male', dateOfBirth: '2003-11-25', course: 'B.Tech', year: '3', address: 'Vijayawada, Andhra Pradesh',  enrollmentDate: '2022-08-01', status: 'Active' },
        { studentId: 'STU003', fullName: 'Arjun Reddy', email: 'arjun@example.com',  phone: '9876543212', gender: 'Male', dateOfBirth: '2005-01-30', course: 'MBA',    year: '1', address: 'Warangal, Telangana',         enrollmentDate: '2024-08-01', status: 'Active' },
        { studentId: 'STU004', fullName: 'Siva Raju',   email: 'siva@example.com',   phone: '9876543213', gender: 'Male', dateOfBirth: '2004-07-19', course: 'B.Com',  year: '2', address: 'Guntur, Andhra Pradesh',      enrollmentDate: '2023-08-01', status: 'Inactive' },
        { studentId: 'STU005', fullName: 'Karthik',     email: 'karthik@example.com',phone: '9876543214', gender: 'Male', dateOfBirth: '2005-09-08', course: 'BCA',    year: '1', address: 'Nizamabad, Telangana',        enrollmentDate: '2024-08-01', status: 'Active' },
      ]);
      console.log('Demo students created');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}

// start the server only after the DB connection is ready
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDemoData();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
};

startServer();