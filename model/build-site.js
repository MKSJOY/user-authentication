import { query } from "../config/database.js";

export default class Building {
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

  // Get all buildings
  static async getAllBuildings() {
    const sql = `
      SELECT b.*, p.project_name 
      FROM buildings b 
      JOIN projects p ON b.project_name = p.project_name`;

    return query(sql);
  }


  // Get a single building by id
static async getBuildingById(id) {
  const sql = `
    SELECT b.*, p.project_name 
    FROM buildings b 
    JOIN projects p ON b.project_name = p.project_name 
    WHERE b.id = ?`;
  return query(sql, [id]);
}

// Update a building by id
static async updateBuilding(id, data) {
  const {
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
  const sql = `
    UPDATE buildings SET 
    site_no=?, avg_flat_size=?, floor_area_size=?, building_height=?, 
    flat_per_floor=?, piling_type=?, facing_type=?, start_date=?, 
    handover_date=?, stage=?, status=?, architect_file=? 
    WHERE id=?`;
  return query(sql, [
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
