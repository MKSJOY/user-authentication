import { query } from "../config/database.js"; // Using your existing query function

export const getCompaniesByUser = async (req, res) => {
  try {
    const { id: userId } = req.params; // Extract user ID from request params

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // Fetch companies where created_by matches the given user ID
    const sql = "SELECT * FROM companies WHERE created_by = ?";
    const companies = await query(sql, [userId]);

    if (companies.length === 0) {
      return res.status(404).json({ success: false, message: "No companies found for this user." });
    }

    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
