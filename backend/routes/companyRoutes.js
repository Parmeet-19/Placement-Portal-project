const express = require('express');
const router = express.Router();
const companiescontroller = require('../controllers/companyControllers');
router.post('/',companiescontroller.createCompany); // CREATE
router.get('/',companiescontroller.getAllCompanies); //READ AL
router.get('/:id',companiescontroller.getCompanyById); //READ ONE
router.put('/:id',companiescontroller.updateCompany); // UPDATE
router.delete('/:id',companiescontroller.deleteCompany); // DELETE
module.exports = router;