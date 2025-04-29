import { query } from "../config/database.js";

// Create a new work head
export const createWorkHead = async (name) => {
  const sql = "INSERT INTO work_heads (name) VALUES (?)";
  const params = [name];
  try {
    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw error;
  }
};

// Get all work heads
export const getAllWorkHeads = async () => {
  const sql = "SELECT * FROM work_heads";
  try {
    const result = await query(sql);
    return result;
  } catch (error) {
    throw error;
  }
};

// Get a single work head by id
export const getWorkHeadById = async (id) => {
  const sql = "SELECT * FROM work_heads WHERE id = ?";
  const params = [id];
  try {
    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw error;
  }
};

// Update a work head by id
export const updateWorkHead = async (id, name) => {
  const sql = "UPDATE work_heads SET name = ? WHERE id = ?";
  const params = [name, id];
  try {
    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw error;
  }
};

// Delete a work head by id
export const deleteWorkHead = async (id) => {
  const sql = "DELETE FROM work_heads WHERE id = ?";
  const params = [id];
  try {
    const result = await query(sql, params);
    return result;
  } catch (error) {
    throw error;
  }
};
