import Building from "../model/build-site.js";
import fs from "fs"; // For file deletion
import uploadMiddleware from "../middleware/uploadMiddleware.js";

// Create a new building (with file upload)
export const createBuilding = async (req, res) => {
  uploadMiddleware.single("architect_file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      // Prepare data to ensure all required fields are either provided or set to null
      const data = {
        project_name: req.body.project_name || null,
        site_no: req.body.site_no || null,
        avg_flat_size: req.body.avg_flat_size || null,
        floor_area_size: req.body.floor_area_size || null,
        building_height: req.body.building_height || null,
        flat_per_floor: req.body.flat_per_floor || null,
        piling_type: req.body.piling_type || null,
        facing_type: req.body.facing_type || null,
        start_date: req.body.start_date || null,
        handover_date: req.body.handover_date || null,
        stage: req.body.stage || null,
        status: req.body.status || null,
        architect_file: req.file?.path || null, // Ensure the file path is set or null
      };

      // Validate that essential fields are provided
      if (!data.project_name) {
        return res.status(400).json({ success: false, message: "Project name is required" });
      }

      // Create the building
      await Building.createBuilding(data);
      res.status(201).json({ success: true, message: "Building created successfully!" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error creating building", error });
    }
  });
};


// Get all buildings
export const getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.getAllBuildings();
    res.status(200).json({ success: true, buildings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching buildings", error });
  }
};


// Get a building by id
export const getBuildingById = async (req, res) => {
  try {
    const building = await Building.getBuildingById(req.params.id);  // Changed to use id
    if (building.length === 0) return res.status(404).json({ success: false, message: "Building not found" });
    res.status(200).json({ success: true, building: building[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching building", error });
  }
};

// Update a building by id
export const updateBuilding = async (req, res) => {
  uploadMiddleware.single("architect_file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      // Update building by id instead of project_name
      await Building.updateBuilding(req.params.id, { ...req.body, architect_file: req.file?.path || null });
      res.status(200).json({ success: true, message: "Building updated successfully!" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error updating building", error });
    }
  });
};

// Delete a building by id
export const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;  // Use id instead of project_name

    // Fetch building data for file deletion
    const building = await Building.getBuildingById(id);  // Changed to use id
    if (building.length === 0) {
      return res.status(404).json({ success: false, message: "Building not found" });
    }

    // Delete associated file
    if (building[0].architect_file) fs.unlinkSync(building[0].architect_file);

    await Building.deleteBuilding(id);  // Use id instead of project_name
    res.status(200).json({ success: true, message: "Building deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting building", error });
  }
};

// Get project names for dropdown suggestion
export const getProjectNames = async (req, res) => {
  try {
    const projects = await Building.getProjectNames();
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching project names", error });
  }
};
