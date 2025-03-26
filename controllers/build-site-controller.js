import Building from "../model/build-site.js";

// Create a new building (with file path as string)
export const createBuilding = async (req, res) => {
  try {
    // Validate if project_name exists in the projects table
    const projectNames = await Building.getProjectNames();
    const existingProjectNames = projectNames.map(project => project.project_name);
    
    if (!existingProjectNames.includes(req.body.project_name)) {
      return res.status(400).json({ success: false, message: "Project name does not exist in the projects table." });
    }

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
      architect_file: req.body.architect_file || null, // Now accepting architect_file as a string (file path)
    };

    // Validate that essential fields are provided
    if (!data.project_name) {
      return res.status(400).json({ success: false, message: "Project name is required" });
    }

    // Create the building
    await Building.createBuilding(data);
    res.status(201).json({ success: true, message: "Building created successfully!" });
  } catch (error) {
    if (error.message === "Project name does not exist in the projects table.") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Error creating building", error: error.message });
  }
};

// Update a building by id (with file path as string)
export const updateBuilding = async (req, res) => {
  try {
    // Validate if project_name exists in the projects table before updating
    const projectNames = await Building.getProjectNames();
    const existingProjectNames = projectNames.map(project => project.project_name);

    if (!existingProjectNames.includes(req.body.project_name)) {
      return res.status(400).json({ success: false, message: "Project name does not exist in the projects table." });
    }

    // Update building by id instead of project_name
    const updatedData = { 
      ...req.body, 
      architect_file: req.body.architect_file || null  // Now accepting architect_file as a string (file path)
    };
    await Building.updateBuilding(req.params.id, updatedData);
    res.status(200).json({ success: true, message: "Building updated successfully!" });
  } catch (error) {
    if (error.message === "Project name does not exist in the projects table.") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Error updating building", error: error.message });
  }
};

// Delete a building by id (no file handling since architect_file is a string now)
export const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;  // Use id instead of project_name

    // Fetch building data for file deletion (if necessary, depending on how you manage files)
    const building = await Building.getBuildingById(id);
    if (building.length === 0) {
      return res.status(404).json({ success: false, message: "Building not found" });
    }

    // Delete associated file if architect_file is provided (optional based on your use case)
    if (building[0].architect_file) {
      // Handle file deletion if needed based on your project structure
      // fs.unlinkSync(building[0].architect_file); // Commented out since it's now just a string
    }

    await Building.deleteBuilding(id);  // Use id instead of project_name
    res.status(200).json({ success: true, message: "Building deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting building", error: error.message });
  }
};

// Get all buildings
export const getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.getAllBuildings();
    res.status(200).json({ success: true, buildings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching buildings", error: error.message });
  }
};

// Get a building by id
export const getBuildingById = async (req, res) => {
  try {
    const building = await Building.getBuildingById(req.params.id);
    if (building.length === 0) return res.status(404).json({ success: false, message: "Building not found" });
    res.status(200).json({ success: true, building: building[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching building", error: error.message });
  }
};

// Get project names for dropdown suggestion
export const getProjectNames = async (req, res) => {
  try {
    const projects = await Building.getProjectNames();
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching project names", error: error.message });
  }
};
