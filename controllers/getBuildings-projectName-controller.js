import { query } from "../config/database.js"; // Using your existing query function

export const getBuildingsByProject = async (req, res) => {
  try {
    const { project_name } = req.params; // Extract project name from request params

    if (!project_name) {
      return res.status(400).json({ success: false, message: "Project name is required." });
    }

    // Fetch buildings where project_name matches the given project name
    const sql = "SELECT * FROM buildings WHERE project_name = ?";
    const buildings = await query(sql, [project_name]);

    if (buildings.length === 0) {
      return res.status(404).json({ success: false, message: "No buildings found for this project." });
    }

    res.status(200).json({ success: true, data: buildings });
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
