import { query } from "../config/database.js"; 
import fs from "fs"; // For file deletion
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";


export const createProject = async (req, res) => {
  // File upload middleware
  uploadMiddleware.fields([
    { name: "logo", maxCount: 1 },
    { name: "architect_drawing_file", maxCount: 1 }
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      // Extract form data
      const {
        project_name,
        location,
        contact_number,
        project_start_date,
        approx_handover_date,
        project_code,
        stage,
        project_type,
        status
      } = req.body;

      // Extract file paths (logo, architect drawing file)
      const logo = req.files["logo"] ? req.files["logo"][0].path : null;
      const architect_drawing_file = req.files["architect_drawing_file"] ? req.files["architect_drawing_file"][0].path : null;

      // Ensure both files are provided
      if (!logo || !architect_drawing_file) {
        return res.status(400).json({ success: false, message: "Logo and architect drawing file are required." });
      }

      // Check for existing project with the same name
      const existingProject = await query("SELECT * FROM projects WHERE project_name = ?", [project_name]);
      if (existingProject.length > 0) {
        return res.status(400).json({ success: false, message: "This is an existing project. Please enter a new project name." });
      }

      // SQL query to insert project data
      const sql = `
        INSERT INTO projects 
        (project_name, location, contact_number, project_start_date, approx_handover_date, 
        project_code, stage, project_type, status, logo, architect_drawing_file) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      // Parameters for the SQL query
      const params = [
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

      // Execute the query
      await query(sql, params);

      // Respond with success
      res.status(201).json({ success: true, message: "Project created successfully" });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
};



// Update a project (with file uploads)
export const updateProject = async (req, res) => {
  uploadMiddleware.fields([{ name: "logo", maxCount: 1 }, { name: "architect_drawing_file", maxCount: 1 }])(
    req,
    res,
    async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      try {
        const { id } = req.params;
        const {
          project_name,
          location,
          contact_number,
          project_start_date,
          approx_handover_date,
          project_code,
          stage,
          project_type,
          status,
        } = req.body;

        let sql = `UPDATE projects SET 
          project_name=?, location=?, contact_number=?, project_start_date=?, approx_handover_date=?, 
          project_code=?, stage=?, project_type=?, status=?`;

        const params = [
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

        // Update logo and architect_drawing_file if they are provided
        if (req.files["logo"]) {
          sql += ", logo=?";
          params.push(req.files["logo"][0].path);
        }
        if (req.files["architect_drawing_file"]) {
          sql += ", architect_drawing_file=?";
          params.push(req.files["architect_drawing_file"][0].path);
        }

        sql += " WHERE id=?";
        params.push(id);

        await query(sql, params);
        res.json({ success: true, message: "Project updated successfully" });
      } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    }
  );
};


// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the project to delete files
    const project = await query("SELECT logo, architect_drawing_file FROM projects WHERE id = ?", [id]);
    if (project.length === 0) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Delete associated files from the server
    if (project[0].logo) fs.unlinkSync(project[0].logo);
    if (project[0].architect_drawing_file) fs.unlinkSync(project[0].architect_drawing_file);

    // Delete project from DB
    await query("DELETE FROM projects WHERE id = ?", [id]);
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
