import express from 'express';
import { handleGetUsersForCompany, createCompanyController } from '../controllers/company-controller.js';

const router = express.Router();

// Route to get all users for a company
router.get('/:companyId', handleGetUsersForCompany);

// Route for creating a new company after user registration
router.post('/create', createCompanyController);

export const companyRoutes = router;
