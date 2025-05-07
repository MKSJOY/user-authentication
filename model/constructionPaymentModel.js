import { query } from "../config/database.js";

export const createPayment = async (paymentData) => {
  const {
    project_id, building_id, client_id, payment_date,
    total_amount, received_amount, purpose,
    payment_type, manual_invoice_no, reference_invoice_code, received_by
  } = paymentData;

  const sql = `
    INSERT INTO construction_payments (
      project_id, building_id, client_id, payment_date,
      total_amount, received_amount, purpose,
      payment_type, manual_invoice_no, reference_invoice_code, received_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    project_id, building_id, client_id, payment_date,
    total_amount, received_amount, purpose,
    payment_type, manual_invoice_no, reference_invoice_code, received_by
  ];

  const result = await query(sql, params);
  return { id: result.insertId };
};

export const getAllPayments = () => query("SELECT * FROM construction_payments");

export const getPaymentById = (id) =>
  query("SELECT * FROM construction_payments WHERE id = ?", [id]);

export const updatePayment = (id, data) => {
  const sql = `
    UPDATE construction_payments SET 
      project_id = ?, building_id = ?, client_id = ?, payment_date = ?,
      total_amount = ?, received_amount = ?, purpose = ?,
      payment_type = ?, manual_invoice_no = ?, reference_invoice_code = ?, received_by = ?
    WHERE id = ?
  `;
  const params = [
    data.project_id, data.building_id, data.client_id, data.payment_date,
    data.total_amount, data.received_amount, data.purpose,
    data.payment_type, data.manual_invoice_no, data.reference_invoice_code, data.received_by,
    id
  ];
  return query(sql, params);
};

export const deletePayment = (id) =>
  query("DELETE FROM construction_payments WHERE id = ?", [id]);
