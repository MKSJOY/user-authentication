import { query } from "../config/database.js";

export const createStockTransfer = async (data) => {
  const sql = `INSERT INTO stock_transfers (
    transfer_date, from_project_id, from_building_id,
    to_project_id, to_building_id, building_product_id,
    total_quantity, unit, transfer_quantity, purpose, description
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    data.transfer_date,
    data.from_project_id,
    data.from_building_id,
    data.to_project_id,
    data.to_building_id,
    data.building_product_id,
    data.total_quantity,
    data.unit,
    data.transfer_quantity,
    data.purpose,
    data.description
  ];

  return await query(sql, params);
};

export const getAllStockTransfers = async () => {
  return await query("SELECT * FROM stock_transfers", []);
};

export const getStockTransferById = async (id) => {
  return await query("SELECT * FROM stock_transfers WHERE id = ?", [id]);
};

export const updateStockTransfer = async (id, data) => {
  const sql = `UPDATE stock_transfers SET 
    transfer_date = ?, from_project_id = ?, from_building_id = ?,
    to_project_id = ?, to_building_id = ?, building_product_id = ?,
    total_quantity = ?, unit = ?, transfer_quantity = ?, purpose = ?, description = ?
    WHERE id = ?`;

  const params = [
    data.transfer_date,
    data.from_project_id,
    data.from_building_id,
    data.to_project_id,
    data.to_building_id,
    data.building_product_id,
    data.total_quantity,
    data.unit,
    data.transfer_quantity,
    data.purpose,
    data.description,
    id
  ];

  return await query(sql, params);
};

export const deleteStockTransfer = async (id) => {
  return await query("DELETE FROM stock_transfers WHERE id = ?", [id]);
};