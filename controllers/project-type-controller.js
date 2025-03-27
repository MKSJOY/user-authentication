import { createProjectType, getAllProjectTypes, getProjectTypeById, updateProjectTypeById, deleteProjectType } from "../model/project-type.js";

// Create a new project type
export const addProjectType = async (req, res) => {
  try {
    const { type_name, code } = req.body;

    if (!type_name || !code) {
      return res.status(400).json({ success: false, message: "Type name and code are required" });
    }

    await createProjectType(type_name, code);
    res.status(201).json({ success: true, message: "Project type added successfully" });
  } catch (error) {
    console.error("Error adding project type:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all project types
export const getProjectTypes = async (req, res) => {
  try {
    const projectTypes = await getAllProjectTypes();
    res.json({ success: true, projectTypes });
  } catch (error) {
    console.error("Error fetching project types:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get a project type by ID
export const getProjectType = async (req, res) => {
  try {
    const { id } = req.params;
    const projectType = await getProjectTypeById(id);

    if (!projectType) {
      return res.status(404).json({ success: false, message: "Project type not found" });
    }

    res.json({ success: true, projectType });
  } catch (error) {
    console.error("Error fetching project type:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update a project type
export const updateProjectType = async (req, res) => {
  try {
    const { id } = req.params;
    const { type_name, code } = req.body;

    if (!type_name || !code) {
      return res.status(400).json({ success: false, message: "Type name and code are required" });
    }

    const updated = await updateProjectTypeById(id, type_name, code);

    if (updated.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Project type not found" });
    }

    res.json({ success: true, message: "Project type updated successfully" });
  } catch (error) {
    console.error("Error updating project type:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a project type
export const removeProjectType = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteProjectType(id);
    res.json({ success: true, message: "Project type deleted successfully" });
  } catch (error) {
    console.error("Error deleting project type:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};