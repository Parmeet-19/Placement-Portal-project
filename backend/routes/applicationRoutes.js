const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationControllers');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

router.post('/', verifyToken, restrictTo('student'), applicationController.createApplication);
router.get('/', verifyToken, restrictTo('admin'), applicationController.getAllApplications);
router.get('/student', verifyToken, restrictTo('student'), applicationController.getMyApplications);
router.get('/job/:jobId', verifyToken, restrictTo('company'), applicationController.getApplicationsForJob);
router.put('/:id/status', verifyToken, restrictTo('company'), applicationController.updateApplicationStatus);

module.exports = router;