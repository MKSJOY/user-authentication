import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../model/project.js";

// Get all projects
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

// Get a single project
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

// Create a new project
export const createProjectController = async (req, res) => {
  try {
    const {
      company_id,
      project_name,
      location,
      contact_number,
      project_start_date,
      approx_handover_date,
      stage,
      project_type,
      status,
      logo,                         // string
      architect_drawing_files       // array of strings
    } = req.body;

    const projectData = {
      company_id,
      project_name,
      location,
      contact_number,
      project_start_date,
      approx_handover_date,
      stage,
      project_type,
      status,
      logo,
      architect_drawing_files: Array.isArray(architect_drawing_files)
        ? architect_drawing_files
        : architect_drawing_files
          ? [architect_drawing_files]
          : [], // Normalize to array
    };

    // Call the model to create the project, project_code will be auto-generated
    await createProject(projectData);
    res.status(201).json({ success: true, message: "Project created successfully" });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Update a project
export const updateProjectController = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company_id,
      project_name,
      location,
      contact_number,
      project_start_date,
      approx_handover_date,
      stage,
      project_type,
      status,
      logo,
      architect_drawing_files
    } = req.body;

    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const updatedData = {
      company_id,
      project_name,
      location,
      contact_number,
      project_start_date,
      approx_handover_date,
      stage,
      project_type,
      status,
      logo,
      architect_drawing_files: Array.isArray(architect_drawing_files)
        ? architect_drawing_files
        : architect_drawing_files
          ? [architect_drawing_files]
          : [],
    };

    // Call the model to update the project, without the project_code (it's immutable)
    await updateProject(id, updatedData);
    res.json({ success: true, message: "Project updated successfully" });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a project
export const deleteProjectController = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await getProjectById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Since files are just string paths, we won't delete them from filesystem
    await deleteProject(id);
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
