import { getAllProjects, getProjectById, createProject, updateProject, deleteProject } from "../model/project.js";

// Get all projects (supports filters & pagination)
export const getAllProjectsController = async (req, res) => {
  try {
    const { status, start_date, handover_date, page = 1, limit = 10 } = req.query;
    const filters = { status, start_date, handover_date, page, limit };
    const projects = await getAllProjects(filters);
    res.json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get a single project by ID
export const getProjectByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await getProjectById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Create a new project (handles file paths as strings)
export const createProjectController = async (req, res) => {
  try {
    const { 
      project_name, location, contact_number, project_start_date, 
      approx_handover_date, project_code, stage, project_type, status, 
      logo, architect_drawing_file 
    } = req.body;

    if (!logo || !architect_drawing_file) {
      return res.status(400).json({ success: false, message: "Logo and architect drawing file paths are required" });
    }

    // Check if project name already exists
    const existingProject = await getProjectById(project_name);
    if (existingProject) {
      return res.status(400).json({ success: false, message: "This is an existing project. Please enter a new project name." });
    }

    await createProject(req.body); // Pass the entire request body to create the project
    res.status(201).json({ success: true, message: "Project created successfully" });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update a project (handles file paths as strings)
export const updateProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const projectData = req.body;

    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    await updateProject(id, projectData);
    res.json({ success: true, message: "Project updated successfully" });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a project (also deletes associated files)
export const deleteProjectController = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await getProjectById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    await deleteProject(id);
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
