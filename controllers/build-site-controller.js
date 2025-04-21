import Building from "../model/build-site.js";

// Create a new building
export const createBuilding = async (req, res) => {
  try {
    const projectExists = await Building.checkProjectNameExists(req.body.project_name);
    if (!projectExists) {
      return res.status(400).json({ success: false, message: "Project does not exist." });
    }

    const data = {
      company_id: req.body.company_id || null,
      project_name: req.body.project_name,
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
      architect_file: req.body.architect_file || null,
    };

    await Building.createBuilding(data);
    res.status(201).json({ success: true, message: "Building created successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all buildings
export const getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.getAllBuildings();
    res.status(200).json({ success: true, data: buildings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching buildings" });
  }
};

// Get building by ID
export const getBuildingById = async (req, res) => {
  try {
    const building = await Building.getBuildingById(req.params.id);
    if (building.length === 0) {
      return res.status(404).json({ success: false, message: "Building not found" });
    }
    res.status(200).json({ success: true, data: building[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching building" });
  }
};

// Update building
export const updateBuilding = async (req, res) => {
  try {
    const projectExists = await Building.checkProjectNameExists(req.body.project_name);
    if (!projectExists) {
      return res.status(400).json({ success: false, message: "Project does not exist." });
    }

    await Building.updateBuilding(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Building updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating building" });
  }
};

// Delete building
export const deleteBuilding = async (req, res) => {
  try {
    const building = await Building.getBuildingById(req.params.id);
    if (building.length === 0) {
      return res.status(404).json({ success: false, message: "Building not found" });
    }

    await Building.deleteBuilding(req.params.id);
    res.status(200).json({ success: true, message: "Building deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting building" });
  }
};

// Get building summary
export const getBuildingSummary = async (req, res) => {
  try {
    const summary = await Building.getBuildingSummary();
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error getting summary" });
  }
};
