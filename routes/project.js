import express from 'express';
import uploadMiddleware from '../middleware/uploadMiddleware.js';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project-controller.js';

const router = express.Router();

// Use multerMiddleware to handle file uploads for the 'create' route
router.post('/create', createProject);
router.get('/all', getAllProjects);
router.get('/get/:id', getProjectById);
router.put('/update/:id', updateProject);
router.delete('/delete/:id', deleteProject);

export const projectRoutes = router;
