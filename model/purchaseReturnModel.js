import { query } from "../config/database.js";

export const createPurchaseReturn = async (data) => {
  const {
    purchase_order_id,
    supplier_id,
    product_name,
    unit,
    return_date,
    per_unit_cost,
    return_quantity,
  } = data;

  const sql = `
    INSERT INTO purchase_returns 
    (purchase_order_id, supplier_id, product_name, unit, return_date, per_unit_cost, return_quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  return await query(sql, [
    purchase_order_id,
    supplier_id,
    product_name,
    unit,
    return_date,
    per_unit_cost,
    return_quantity,
  ]);
};

export const getAllPurchaseReturns = async () => {
  const sql = `
    SELECT pr.*, po.total_amount AS order_total, s.name AS supplier_name
    FROM purchase_returns pr
    LEFT JOIN purchase_orders po ON pr.purchase_order_id = po.id
    LEFT JOIN suppliers s ON pr.supplier_id = s.id
    ORDER BY pr.created_at DESC
  `;
  return await query(sql);
};

export const getPurchaseReturnById = async (id) => {
    const sql = `
      SELECT 
        pr.id,
        pr.purchase_order_id,
        pr.supplier_id,
        pr.product_name,
        pr.unit,
        pr.return_date,
        pr.per_unit_cost,
        pr.return_quantity,
        pr.total_return_amount,
        pr.created_at,
        pr.updated_at,
        po.total_amount AS order_total,
        s.name AS supplier_name
      FROM 
        purchase_returns pr
      LEFT JOIN 
        purchase_orders po ON pr.purchase_order_id = po.id
      LEFT JOIN 
        suppliers s ON pr.supplier_id = s.id
      WHERE 
        pr.id = ?
    `;
    const results = await query(sql, [id]);
    return results[0];
  };
  

export const updatePurchaseReturn = async (id, data) => {
  const {
    purchase_order_id,
    supplier_id,
    product_name,
    unit,
    return_date,
    per_unit_cost,
    return_quantity,
  } = data;

  const sql = `
    UPDATE purchase_returns SET 
      purchase_order_id = ?, 
      supplier_id = ?, 
      product_name = ?, 
      unit = ?, 
      return_date = ?, 
      per_unit_cost = ?, 
      return_quantity = ?
    WHERE id = ?
  `;
  return await query(sql, [
    purchase_order_id,
    supplier_id,
    product_name,
    unit,
    return_date,
    per_unit_cost,
    return_quantity,
    id,
  ]);
};

export const deletePurchaseReturn = async (id) => {
  const sql = `DELETE FROM purchase_returns WHERE id = ?`;
  return await query(sql, [id]);
};
