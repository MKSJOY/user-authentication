import { query } from "../config/database.js";

export const createWorkDetail = async (work_head_id, description) => {
  const sql = "INSERT INTO work_details (work_head_id, description) VALUES (?, ?)";
  return await query(sql, [work_head_id, description]);
};

export const getAllWorkDetails = async () => {
  const sql = "SELECT id, work_head_id, description FROM work_details";
  return await query(sql);
};

export const getWorkDetailById = async (id) => {
  const sql = "SELECT id, work_head_id, description FROM work_details WHERE id = ?";
  return await query(sql, [id]);
};

export const updateWorkDetail = async (id, work_head_id, description) => {
  const sql = "UPDATE work_details SET work_head_id = ?, description = ? WHERE id = ?";
  return await query(sql, [work_head_id, description, id]);
};

export const deleteWorkDetail = async (id) => {
  const sql = "DELETE FROM work_details WHERE id = ?";
  return await query(sql, [id]);
};
