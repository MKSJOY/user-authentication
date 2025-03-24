import { query } from "../config/database.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import fs from "fs";

// Get all projects (supports filters & pagination)
export const getAllProjects = async (req, res) => {
  try {
    const { status, start_date, handover_date, page = 1, limit = 10 } = req.query;
    let sql = "SELECT * FROM projects WHERE 1=1";
    const params = [];

    if (status) {
      sql += " AND status = ?";
      params.push(status);
    }
    if (start_date) {
      sql += " AND project_start_date >= ?";
      params.push(start_date);
    }
    if (handover_date) {
      sql += " AND approx_handover_date <= ?";
      params.push(handover_date);
    }

    sql += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const projects = await query(sql, params);
    res.json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await query("SELECT * FROM projects WHERE id = ?", [id]);

    if (project.length === 0) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, project: project[0] });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Create a new project (handles file uploads)
export const createProject = async (req, res) => {
  uploadMiddleware.fields([{ name: "logo", maxCount: 1 }, { name: "architect_drawing_file", maxCount: 1 }])(
    req,
    res,
    async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      try {
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

        const logo = req.files["logo"] ? req.files["logo"][0].path : null;
        const architect_drawing_file = req.files["architect_drawing_file"] ? req.files["architect_drawing_file"][0].path : null;

        if (!logo || !architect_drawing_file) {
          return res.status(400).json({ success: false, message: "Logo and architect drawing file are required" });
        }

        // Check if project name already exists
        const existingProject = await query("SELECT * FROM projects WHERE project_name = ?", [project_name]);
        if (existingProject.length > 0) {
          return res.status(400).json({ success: false, message: "This is an existing project. Please enter a new project name." });
        }

        const sql = `INSERT INTO projects 
          (project_name, location, contact_number, project_start_date, approx_handover_date, 
          project_code, stage, project_type, status, logo, architect_drawing_file) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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

        await query(sql, params);
        res.status(201).json({ success: true, message: "Project created successfully" });
      } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    }
  );
};


// Update a project (handles file uploads)
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

        // Get existing project details
        const existingProject = await query("SELECT logo, architect_drawing_file FROM projects WHERE id = ?", [id]);
        if (existingProject.length === 0) {
          return res.status(404).json({ success: false, message: "Project not found" });
        }

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

        // Handle file updates
        if (req.files["logo"]) {
          if (existingProject[0].logo) fs.unlinkSync(existingProject[0].logo); // Delete old file
          sql += ", logo=?";
          params.push(req.files["logo"][0].path);
        }

        if (req.files["architect_drawing_file"]) {
          if (existingProject[0].architect_drawing_file) fs.unlinkSync(existingProject[0].architect_drawing_file); // Delete old file
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

// Delete a project (also deletes associated files)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Get project details to delete files
    const project = await query("SELECT logo, architect_drawing_file FROM projects WHERE id = ?", [id]);
    if (project.length === 0) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Delete associated files
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
