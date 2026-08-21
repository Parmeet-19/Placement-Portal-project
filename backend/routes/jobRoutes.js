const express = require("express");
const router = express.Router();
const jobsController = require('../controllers/jobControllers');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, jobsController.createJob);
router.post('/',jobsController.createJob); // CREATE
router.get('/',jobsController.getAllJobs); //READ AL
router.get('/:id',jobsController.getJobById); //READ ONE
router.put('/:id',jobsController.updateJob); // UPDATE
router.delete('/:id',jobsController.deleteJob); // DELETE
module.exports = router;