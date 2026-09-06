const express = require("express");
const router = express.Router();
const jobsController = require('../controllers/jobControllers');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

router.post('/', verifyToken, restrictTo('company'), jobsController.createJob);
router.get('/',jobsController.getAllJobs); //READ AL
router.get('/:id',jobsController.getJobById); //READ ONE
router.put('/:id',jobsController.updateJob); // UPDATE
router.delete('/:id',jobsController.deleteJob); // DELETE
module.exports = router;