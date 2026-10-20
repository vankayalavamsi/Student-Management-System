require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const User = require('./models/User');
const Student = require('./models/Student');

const app = express();

// Configure CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as health checks.
      // In production, configure FRONTEND_URL in Render.
      if (!origin || allowedOrigins.length === 0) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
  })
);

// Parse incoming JSON
app.use(express.json());

// --------------------------------------------------
// API Routes
// --------------------------------------------------

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Management System API is running...',
    environment: process.env.NODE_ENV || 'development',
  });
});

// --------------------------------------------------
// 404 Handler
// --------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// --------------------------------------------------
// Central Error Handler
// --------------------------------------------------

app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  if (res.headersSent) {
    return next(err);
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'Cross-origin request not allowed',
    });
  }

  res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
});

// --------------------------------------------------
// Demo Data Seeding
// --------------------------------------------------

async function seedDemoData() {
  // Seed demo records only when explicitly enabled.
  // Set SEED_DEMO_DATA=true in Render to enable.
  if (process.env.SEED_DEMO_DATA !== 'true') {
    console.log('Demo data seeding is disabled.');
    return;
  }

  try {
    // 1. Create demo admin if it does not exist
    const demoEmail = 'demo@example.com';

    const existingUser = await User.findOne({
      email: demoEmail,
    });

    if (!existingUser) {
      await User.create({
        name: 'Demo Admin',
        email: demoEmail,
        password: 'Demo@123',
        role: 'admin',
      });

      console.log('Demo admin user created.');
    } else {
      console.log('Demo admin user already exists.');
    }

    // 2. Seed demo students only if collection is empty
    const studentCount = await Student.countDocuments();

    if (studentCount === 0) {
      await Student.create([
        {
          studentId: 'STU001',
          fullName: 'Vaun Kumar',
          email: 'vaun@example.com',
          phone: '9876543210',
          gender: 'Male',
          dateOfBirth: '2004-03-12',
          course: 'BCA',
          year: '2',
          address: 'Hyderabad, Telangana',
          enrollmentDate: '2023-08-01',
          status: 'Active',
        },
        {
          studentId: 'STU002',
          fullName: 'Pavan Kumar',
          email: 'pavan@example.com',
          phone: '9876543211',
          gender: 'Male',
          dateOfBirth: '2003-11-25',
          course: 'B.Tech',
          year: '3',
          address: 'Vijayawada, Andhra Pradesh',
          enrollmentDate: '2022-08-01',
          status: 'Active',
        },
        {
          studentId: 'STU003',
          fullName: 'Arjun Reddy',
          email: 'arjun@example.com',
          phone: '9876543212',
          gender: 'Male',
          dateOfBirth: '2005-01-30',
          course: 'MBA',
          year: '1',
          address: 'Warangal, Telangana',
          enrollmentDate: '2024-08-01',
          status: 'Active',
        },
        {
          studentId: 'STU004',
          fullName: 'Siva Raju',
          email: 'siva@example.com',
          phone: '9876543213',
          gender: 'Male',
          dateOfBirth: '2004-07-19',
          course: 'B.Com',
          year: '2',
          address: 'Guntur, Andhra Pradesh',
          enrollmentDate: '2023-08-01',
          status: 'Inactive',
        },
        {
          studentId: 'STU005',
          fullName: 'Karthik',
          email: 'karthik@example.com',
          phone: '9876543214',
          gender: 'Male',
          dateOfBirth: '2005-09-08',
          course: 'BCA',
          year: '1',
          address: 'Nizamabad, Telangana',
          enrollmentDate: '2024-08-01',
          status: 'Active',
        },
      ]);

      console.log('Demo students created successfully.');
    } else {
      console.log(
        `Student collection already contains ${studentCount} record(s). Skipping demo student seeding.`
      );
    }
  } catch (err) {
    // A seeding failure should not be silently ignored.
    // Re-throw so the startup process can handle the failure.
    console.error('Demo data seeding failed:', err.message);
    throw err;
  }
}

// --------------------------------------------------
// Start Server
// --------------------------------------------------

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB Atlas first
    await connectDB();

    console.log('Database connection established.');

    // Seed demo data only when enabled
    await seedDemoData();

    // Start Express server after successful initialization
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('Server startup failed:', err.message);
    process.exit(1);
  }
}

startServer();
