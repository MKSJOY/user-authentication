import { query } from "../config/database.js";


//create
export const createPurchaseOrder = async (data) => {
  const sql = `
    INSERT INTO purchase_orders (
      requisition_id, property_id, is_buy_property,
      land_name, land_property_id, location, cs_dag_no, mouja_name,
      owner_name, owner_id, contact_no, nid_no,
      total_amount, discount, vat_tax,
      payment_date, pay_amount, payment_type, attachment_file
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    data.requisition_id, data.property_id, data.is_buy_property,
    data.land_name, data.land_property_id, data.location, data.cs_dag_no, data.mouja_name,
    data.owner_name, data.owner_id, data.contact_no, data.nid_no,
    data.total_amount, data.discount, data.vat_tax,
    data.payment_date, data.pay_amount, data.payment_type, data.attachment_file,
  ];
  return await query(sql, params);
};

//get all
export const getAllPurchaseOrders = async () => {
  return await query("SELECT * FROM purchase_orders");
};


//get by id
export const getPurchaseOrderById = async (id) => {
  return await query("SELECT * FROM purchase_orders WHERE id = ?", [id]);
};


//update
export const updatePurchaseOrder = async (id, data) => {
  const sql = `
    UPDATE purchase_orders SET
      requisition_id = ?, property_id = ?, is_buy_property = ?,
      land_name = ?, land_property_id = ?, location = ?, cs_dag_no = ?, mouja_name = ?,
      owner_name = ?, owner_id = ?, contact_no = ?, nid_no = ?,
      total_amount = ?, discount = ?, vat_tax = ?,
      payment_date = ?, pay_amount = ?, payment_type = ?, attachment_file = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const params = [
    data.requisition_id, data.property_id, data.is_buy_property,
    data.land_name, data.land_property_id, data.location, data.cs_dag_no, data.mouja_name,
    data.owner_name, data.owner_id, data.contact_no, data.nid_no,
    data.total_amount, data.discount, data.vat_tax,
    data.payment_date, data.pay_amount, data.payment_type, data.attachment_file,
    id
  ];
  return await query(sql, params);
};


//delete
export const deletePurchaseOrder = async (id) => {
  return await query("DELETE FROM purchase_orders WHERE id = ?", [id]);
};
