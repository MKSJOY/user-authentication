import { query } from "../config/database.js";

export const createSalesAgent = async (data) => {
  const sql = `
    INSERT INTO sales_agents (status, name, phone, occupation, address, nid, tin, email, profile_photo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    data.status,
    data.name,
    data.phone,
    data.occupation,
    data.address,
    data.nid,
    data.tin,
    data.email,
    data.profile_photo,
  ];
  const result = await query(sql, params);
  return result.insertId;
};

export const getAllSalesAgents = async () => {
  return await query("SELECT * FROM sales_agents");
};

export const getSalesAgentById = async (id) => {
  const result = await query("SELECT * FROM sales_agents WHERE id = ?", [id]);
  return result[0];
};

export const updateSalesAgent = async (id, data) => {
  const sql = `
    UPDATE sales_agents SET status=?, name=?, phone=?, occupation=?, address=?, nid=?, tin=?, email=?, profile_photo=?
    WHERE id=?
  `;
  const params = [
    data.status,
    data.name,
    data.phone,
    data.occupation,
    data.address,
    data.nid,
    data.tin,
    data.email,
    data.profile_photo,
    id,
  ];
  return await query(sql, params);
};

export const deleteSalesAgent = async (id) => {
  return await query("DELETE FROM sales_agents WHERE id = ?", [id]);
};
