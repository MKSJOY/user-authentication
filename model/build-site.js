import { query } from "../config/database.js";

export default class Building {
  static async checkProjectNameExists(project_name) {
    const sql = `SELECT id FROM projects WHERE project_name = ? LIMIT 1`;
    const result = await query(sql, [project_name]);
    return result.length > 0;
  }

  static async createBuilding(data) {
    const {
      company_id,
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

    const projectExists = await this.checkProjectNameExists(project_name);
    if (!projectExists) {
      throw new Error("Project name does not exist.");
    }

    const sql = `
      INSERT INTO buildings 
      (company_id, project_name, site_no, avg_flat_size, floor_area_size, building_height, 
       flat_per_floor, piling_type, facing_type, start_date, handover_date, 
       stage, status, architect_file) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    return query(sql, [
      company_id,
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

  static async updateBuilding(id, data) {
    const {
      company_id,
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

    const projectExists = await this.checkProjectNameExists(project_name);
    if (!projectExists) {
      throw new Error("Project name does not exist.");
    }

    const sql = `
      UPDATE buildings SET 
        company_id=?, project_name=?, site_no=?, avg_flat_size=?, floor_area_size=?, 
        building_height=?, flat_per_floor=?, piling_type=?, facing_type=?, 
        start_date=?, handover_date=?, stage=?, status=?, architect_file=? 
      WHERE id=?`;

    return query(sql, [
      company_id,
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

  static async getAllBuildings() {
    return query(`SELECT * FROM buildings`);
  }

  static async getBuildingById(id) {
    return query(`SELECT * FROM buildings WHERE id = ?`, [id]);
  }

  static async deleteBuilding(id) {
    return query(`DELETE FROM buildings WHERE id = ?`, [id]);
  }

  static async getProjectNames() {
    return query(`SELECT project_name FROM projects`);
  }

  static async getBuildingSummary() {
    const sql = `
      SELECT 
        COUNT(*) AS total,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) AS completed,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) AS active,
        COUNT(CASE WHEN status = 'Inactive' THEN 1 END) AS inactive
      FROM buildings
    `;
    const [result] = await query(sql);
    return result;
  }
}
