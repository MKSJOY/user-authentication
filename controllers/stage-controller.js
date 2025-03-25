import { query } from "../config/database.js";

// ✅ Add a new stage
export const addStage = async (req, res) => {
  try {
    const { building_id, stage_name, stage_date } = req.body;

    if (!building_id || !stage_name || !stage_date) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const sql = `INSERT INTO stages (building_id, stage_name, stage_date) VALUES (?, ?, ?)`;    
    await query(sql, [building_id, stage_name, stage_date]);

    res.status(201).json({ success: true, message: "Stage added successfully." });
  } catch (error) {
    console.error("Error adding stage:", error);
    res.status(500).json({ success: false, message: "Error adding stage.", error: error.message });
  }
};

// ✅ Get all stages for a specific building
export const getStagesByBuilding = async (req, res) => {
  try {
    const { building_id } = req.params;

    if (!building_id) {
      return res.status(400).json({ success: false, message: "Building ID is required." });
    }

    const sql = `SELECT * FROM stages WHERE building_id = ? ORDER BY stage_date ASC`;
    const stages = await query(sql, [building_id]);

    res.status(200).json({ success: true, stages });
  } catch (error) {
    console.error("Error retrieving stages:", error);
    res.status(500).json({ success: false, message: "Error retrieving stages.", error: error.message });
  }
};

// ✅ Update a stage
export const updateStage = async (req, res) => {
  try {
    const { stage_id } = req.params;
    const { stage_name, stage_date } = req.body;

    if (!stage_id || !stage_name || !stage_date) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const sql = `UPDATE stages SET stage_name = ?, stage_date = ? WHERE id = ?`;
    const result = await query(sql, [stage_name, stage_date, stage_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Stage not found." });
    }

    res.status(200).json({ success: true, message: "Stage updated successfully." });
  } catch (error) {
    console.error("Error updating stage:", error);
    res.status(500).json({ success: false, message: "Error updating stage.", error: error.message });
  }
};

// ✅ Delete a stage
export const deleteStage = async (req, res) => {
  try {
    const { stage_id } = req.params;

    if (!stage_id) {
      return res.status(400).json({ success: false, message: "Stage ID is required." });
    }

    const sql = `DELETE FROM stages WHERE id = ?`;
    const result = await query(sql, [stage_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Stage not found." });
    }

    res.status(200).json({ success: true, message: "Stage deleted successfully." });
  } catch (error) {
    console.error("Error deleting stage:", error);
    res.status(500).json({ success: false, message: "Error deleting stage.", error: error.message });
  }
};
