import express from 'express';
import { handleGetUsersForCompany } from '../controllers/company-controller.js';

const router = express.Router();

// Route to get all users for a company
router.get('/company/:companyId', handleGetUsersForCompany);

export const companyRoutes = router;
