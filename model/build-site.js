import { query } from "../config/database.js";

export default class Building {
  // Check if project_name exists in the projects table
  static async checkProjectNameExists(project_name) {
    const sql = `SELECT id FROM projects WHERE project_name = ? LIMIT 1`;
    const result = await query(sql, [project_name]);
    return result.length > 0;  // Return true if project exists, else false
  }

  // Create a new building
  static async createBuilding(data) {
    const {
      project_name,
      site_no,
      avg_flat_size,
      floor_area_size,
      building_height,
      flat_per_floor,
      piling_type,
      facing_type,
      start_date,
      handover_date,
      stage,
      status,
      architect_file,
    } = data;

    // Check if project_name exists in the projects table
    const projectExists = await this.checkProjectNameExists(project_name);
    if (!projectExists) {
      throw new Error("Project name does not exist in the projects table.");
    }

    const sql = `
      INSERT INTO buildings 
      (project_name, site_no, avg_flat_size, floor_area_size, building_height, 
       flat_per_floor, piling_type, facing_type, start_date, handover_date, 
       stage, status, architect_file) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    return query(sql, [
      project_name,
      site_no,
      avg_flat_size,
      floor_area_size,
      building_height,
      flat_per_floor,
      piling_type,
      facing_type,
      start_date,
      handover_date,
      stage,
      status,
      architect_file,
    ]);
  }

  // Update a building by id
  static async updateBuilding(id, data) {
    const {
      project_name,
      site_no,
      avg_flat_size,
      floor_area_size,
      building_height,
      flat_per_floor,
      piling_type,
      facing_type,
      start_date,
      handover_date,
      stage,
      status,
      architect_file,
    } = data;

    // Check if project_name exists in the projects table
    const projectExists = await this.checkProjectNameExists(project_name);
    if (!projectExists) {
      throw new Error("Project name does not exist in the projects table.");
    }

    const sql = `
      UPDATE buildings SET 
      project_name=?, site_no=?, avg_flat_size=?, floor_area_size=?, building_height=?, 
      flat_per_floor=?, piling_type=?, facing_type=?, start_date=?, 
      handover_date=?, stage=?, status=?, architect_file=? 
      WHERE id=?`;

    return query(sql, [
      project_name,
      site_no,
      avg_flat_size,
      floor_area_size,
      building_height,
      flat_per_floor,
      piling_type,
      facing_type,
      start_date,
      handover_date,
      stage,
      status,
      architect_file,
      id,
    ]);
  }

  // Get all buildings
  static async getAllBuildings() {
  const sql = `SELECT * FROM buildings`;
  return query(sql);
  }

  // Add method to get building by ID
  static async getBuildingById(id) {
    try {
      const [rows] = await db.execute("SELECT * FROM buildings WHERE id = ?", [id]);
      return rows;  // Return the result of the query
    } catch (error) {
      throw new Error("Error fetching building by ID");
    }
  }


  // Delete a building by id
  static async deleteBuilding(id) {
    const sql = `DELETE FROM buildings WHERE id = ?`;
    return query(sql, [id]);
  }

  // Get all project names for dropdown suggestion
  static async getProjectNames() {
    const sql = `SELECT project_name FROM projects`;
    return query(sql);
  }
}
