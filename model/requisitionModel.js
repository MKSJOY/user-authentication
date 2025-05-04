import { pool, query } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

// Create requisition
export const createRequisition = async (requisition, items) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const requisition_id = uuidv4();
    const sqlRequisition = `
      INSERT INTO requisitions (
        id, requisition_type, requisition_purpose, note,
        project_id, building_id, requisition_date, required_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await conn.execute(sqlRequisition, [
      requisition_id,
      requisition.requisition_type,
      requisition.requisition_purpose,
      requisition.note,
      requisition.project_id,
      requisition.building_id,
      requisition.requisition_date,
      requisition.required_date,
    ]);

    const sqlItem = `
      INSERT INTO requisition_items (
        id, requisition_id, product_name, category_name, product_unit, quantity
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    for (const item of items) {
      await conn.execute(sqlItem, [
        uuidv4(),
        requisition_id,
        item.product_name,
        item.category_name,
        item.product_unit,
        item.quantity,
      ]);
    }

    await conn.commit();
    return requisition_id;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// Get all requisitions with items
export const getAllRequisitions = async () => {
  const requisitions = await query("SELECT * FROM requisitions ORDER BY created_at DESC");
  const items = await query("SELECT * FROM requisition_items");

  // Nest items into their parent requisition
  const result = requisitions.map((req) => ({
    ...req,
    requisition_date: req.requisition_date.toISOString().split("T")[0],
    required_date: req.required_date.toISOString().split("T")[0],
    items: items.filter((item) => item.requisition_id === req.id),
  }));

  return result;
};

// Get one requisition by ID with items
export const getRequisitionById = async (id) => {
  const [requisition] = await query("SELECT * FROM requisitions WHERE id = ?", [id]);
  if (!requisition) return null;

  const items = await query("SELECT * FROM requisition_items WHERE requisition_id = ?", [id]);
  return {
    ...requisition,
    requisition_date: requisition.requisition_date.toISOString().split("T")[0],
    required_date: requisition.required_date.toISOString().split("T")[0],
    items,
  };
};

// Update requisition
export const updateRequisition = async (id, data) => {
  const sql = `
    UPDATE requisitions
    SET requisition_type = ?, requisition_purpose = ?, note = ?,
        project_id = ?, building_id = ?, requisition_date = ?, required_date = ?
    WHERE id = ?
  `;
  return await query(sql, [
    data.requisition_type,
    data.requisition_purpose,
    data.note,
    data.project_id,
    data.building_id,
    data.requisition_date,
    data.required_date,
    id,
  ]);
};

// Delete requisition
export const deleteRequisition = async (id) => {
  return await query("DELETE FROM requisitions WHERE id = ?", [id]);
};
