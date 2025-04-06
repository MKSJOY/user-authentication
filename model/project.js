import { query } from "../config/database.js";

// Get all projects
export const getAllProjects = async () => {
  const sql = "SELECT * FROM projects";
  try {
    return await query(sql);
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to retrieve projects");
  }
};


// Get a single project by ID
export const getProjectById = async (id) => {
  const project = await query("SELECT * FROM projects WHERE id = ?", [id]);
  return project.length > 0 ? project[0] : null;
};

// Create a new project
export const createProject = async (projectData) => {
  const {
    company_id,
    project_name,
    location,
    contact_number,
    project_start_date,
    approx_handover_date,
    project_code,
    stage,
    project_type,
    status,
    logo,
    architect_drawing_file,
  } = projectData;

  const sql = `INSERT INTO projects 
    (company_id, project_name, location, contact_number, project_start_date, approx_handover_date, 
    project_code, stage, project_type, status, logo, architect_drawing_file) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    company_id,
    project_name,
    location,
    contact_number,
    project_start_date,
    approx_handover_date,
    project_code,
    stage,
    project_type,
    status,
    logo,
    architect_drawing_file,
  ];

  return await query(sql, params);
};

// Update a project
export const updateProject = async (id, projectData) => {
  const {
    company_id,
    project_name,
    location,
    contact_number,
    project_start_date,
    approx_handover_date,
    project_code,
    stage,
    project_type,
    status,
    logo,
    architect_drawing_file,
  } = projectData;

  let sql = `UPDATE projects SET 
    company_id=?, project_name=?, location=?, contact_number=?, project_start_date=?, approx_handover_date=?, 
    project_code=?, stage=?, project_type=?, status=?`;

  const params = [
    company_id,
    project_name,
    location,
    contact_number,
    project_start_date,
    approx_handover_date,
    project_code,
    stage,
    project_type,
    status,
  ];

  if (logo) {
    sql += ", logo=?";
    params.push(logo);
  }

  if (architect_drawing_file) {
    sql += ", architect_drawing_file=?";
    params.push(architect_drawing_file);
  }

  sql += " WHERE id=?";
  params.push(id);

  return await query(sql, params);
};

// Delete a project
export const deleteProject = async (id) => {
  try {
    // Fetch project to check if it exists
    const project = await query("SELECT * FROM projects WHERE id = ?", [id]);
    if (project.length === 0) {
      throw new Error("Project not found");
    }

    // Delete project from DB
    await query("DELETE FROM projects WHERE id = ?", [id]);

    return { success: true, message: "Project deleted successfully" };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

