import { query } from "../config/database.js";

// Function to generate a random project code
const generateProjectCode = () => {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 chars
  const timePart = Date.now().toString(36).slice(-3).toUpperCase(); // last 3 chars of time
  return `PRJ-${timePart}${randomPart}`;
};



// Function to check if a project code is unique
const isProjectCodeUnique = async (projectCode) => {
  const result = await query("SELECT * FROM projects WHERE project_code = ?", [projectCode]);
  return result.length === 0; // If no project exists with the same code, it's unique
};

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
    stage,
    project_type,
    status,
    logo,
    architect_drawing_files = [], // Default to an empty array
  } = projectData;

  let project_code = generateProjectCode(); // Generate a new project code

  // Ensure the project code is unique
  while (!(await isProjectCodeUnique(project_code))) {
    project_code = generateProjectCode(); // Regenerate if the code is not unique
  }

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
    JSON.stringify(architect_drawing_files), // store multiple file paths as a JSON array
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
    stage,
    project_type,
    status,
    logo,
    architect_drawing_files = [], // Default to an empty array
  } = projectData;

  let sql = `UPDATE projects SET 
    company_id=?, project_name=?, location=?, contact_number=?, project_start_date=?, approx_handover_date=?, 
    stage=?, project_type=?, status=?`;

  const params = [
    company_id,
    project_name,
    location,
    contact_number,
    project_start_date,
    approx_handover_date,
    stage,
    project_type,
    status,
  ];

  if (logo) {
    sql += ", logo=?";
    params.push(logo);
  }

  if (architect_drawing_files.length > 0) {
    sql += ", architect_drawing_file=?";
    params.push(JSON.stringify(architect_drawing_files)); // store multiple file paths as JSON
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
