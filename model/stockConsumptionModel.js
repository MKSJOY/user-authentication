import { query } from "../config/database.js";

export const createStockConsumption = async (data) => {
  const sql = `
    INSERT INTO stock_consumptions (
      consumption_date, project_id, building_product_id, building_id,
      floor_unit_id, brand, unit, total_quantity, consume_quantity, note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    data.consumption_date,
    data.project_id,
    data.building_product_id,
    data.building_id || null,
    data.floor_unit_id || null,
    data.brand || null,
    data.unit || null,
    data.total_quantity || 0,
    data.consume_quantity || 0,
    data.note || null,
  ];

  return await query(sql, params);
};

export const getAllStockConsumptions = async () => {
  return await query("SELECT * FROM stock_consumptions");
};

export const getStockConsumptionById = async (id) => {
  return await query("SELECT * FROM stock_consumptions WHERE id = ?", [id]);
};

export const updateStockConsumption = async (id, data) => {
  const sql = `
    UPDATE stock_consumptions SET
      consumption_date = ?, project_id = ?, building_product_id = ?, building_id = ?,
      floor_unit_id = ?, brand = ?, unit = ?, total_quantity = ?, consume_quantity = ?, note = ?
    WHERE id = ?`;

  const params = [
    data.consumption_date,
    data.project_id,
    data.building_product_id,
    data.building_id || null,
    data.floor_unit_id || null,
    data.brand || null,
    data.unit || null,
    data.total_quantity || 0,
    data.consume_quantity || 0,
    data.note || null,
    id,
  ];

  return await query(sql, params);
};

export const deleteStockConsumption = async (id) => {
  return await query("DELETE FROM stock_consumptions WHERE id = ?", [id]);
};
