const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/studentController');
router.post('/',studentsController.createStudent ); // CREATE
router.get('/',studentsController.getAllStudents); //READ AL
router.get('/:id',studentsController.getStudentById); //READ ONE
router.put('/:id',studentsController.updateStudent); // UPDATE
router.delete('/:id',studentsController.deleteStudent); // DELETE
module.exports = router;