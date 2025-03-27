import { query } from "../config/database.js";

// Create a new project type
export const createProjectType = async (type_name, code) => {
  return await query("INSERT INTO project_types (type_name, code) VALUES (?, ?)", [type_name, code]);
};

// Get all project types
export const getAllProjectTypes = async () => {
  return await query("SELECT * FROM project_types");
};

// Get a single project type by ID
export const getProjectTypeById = async (id) => {
  const result = await query("SELECT * FROM project_types WHERE id = ?", [id]);
  return result.length ? result[0] : null;
};

// Update a project type by ID
export const updateProjectTypeById = async (id, type_name, code) => {
  return await query("UPDATE project_types SET type_name = ?, code = ? WHERE id = ?", [type_name, code, id]);
};


// Delete a project type
export const deleteProjectType = async (id) => {
  return await query("DELETE FROM project_types WHERE id = ?", [id]);
};