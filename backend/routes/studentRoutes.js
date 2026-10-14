const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const {
  getStudents, getStudentById, createStudent, updateStudent, deleteStudent,
} = require('../controllers/studentController');

// every student route below requires a valid JWT
router.use(protect);

router.route('/').get(getStudents).post(createStudent);
router.route('/:id').get(getStudentById).put(updateStudent).delete(deleteStudent);

module.exports = router;