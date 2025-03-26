import express from 'express';
import {
  getAllProjectsController,
  getProjectByIdController,
  createProjectController,
  updateProjectController,
  deleteProjectController,
} from '../controllers/project-controller.js';

const router = express.Router();

// Create a new project (handles file paths as strings)
router.post('/create', createProjectController);

// Get all projects (supports filters & pagination)
router.get('/all', getAllProjectsController);

// Get a single project by ID
router.get('/get/:id', getProjectByIdController);

// Update a project (handles file paths as strings)
router.put('/update/:id', updateProjectController);

// Delete a project (also deletes associated files)
router.delete('/delete/:id', deleteProjectController);

export const projectRoutes = router;
