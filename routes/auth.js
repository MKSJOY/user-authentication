import express from 'express';
import { register, login } from '../controllers/auth-controller.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Export the router
export const authRoutes = router;
