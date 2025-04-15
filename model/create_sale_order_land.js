import { query } from "../config/database.js";

// Create Land Sale Order
export const createLandSaleOrder = async (data) => {
  const {
    client_name,
    land_name,
    plot,
    location,
    mouja,
    cs_dag_no,
    quantity,
    unit,
    unit_price,
    total,
    discount,
    sale_value_after_discount,
    registration_cost,
    utility_charge,
    others_charge,
    vat_percentage,
    sale_value,
    installment_amount,
    reference,
    sale_date
  } = data;

  const sql = `
    INSERT INTO sale_orders_land (
      client_name, land_name, plot, location, mouja, cs_dag_no,
      quantity, unit, unit_price, total, discount,
      sale_value_after_discount, registration_cost, utility_charge, others_charge,
      vat_percentage, sale_value, installment_amount, reference, sale_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    client_name, land_name, plot, location, mouja, cs_dag_no,
    quantity, unit, unit_price, total, discount,
    sale_value_after_discount, registration_cost, utility_charge, others_charge,
    vat_percentage, sale_value, installment_amount, reference, sale_date
  ];

  await query(sql, values);

  const [result] = await query(
    `SELECT id FROM sale_orders_land 
     WHERE client_name = ? AND land_name = ? 
     ORDER BY created_at DESC LIMIT 1`,
    [client_name, land_name]
  );
  
  // Returning sale order ID
  const sale_order_id = result?.id;
  return sale_order_id;
};

// Down Payments
export const createDownPayments = async (sale_order_id, down_payments) => {
  if (!sale_order_id) {
    throw new Error("Sale Order ID is required for down payments");
  }

  if (!Array.isArray(down_payments) || down_payments.length === 0) return;

  const sql = `
    INSERT INTO sale_down_payments_land (sale_order_id, amount, payment_date, note)
    VALUES ${down_payments.map(() => "(?, ?, ?, ?)").join(", ")}
  `;

  const values = down_payments.flatMap(dp => [
    sale_order_id,
    dp.amount ?? null,
    dp.payment_date ?? null,
    dp.note ?? null
  ]);

  await query(sql, values);
};

// Installments
export const createInstallments = async (sale_order_id, installments) => {
  if (!Array.isArray(installments)) return;

  const insertQueries = installments.map(async (ins) => {
    const installment_no = ins?.installment_no ?? null;
    const due_date = ins?.due_date ?? null;
    const amount = ins?.amount ?? null;
    const status = ins?.status ?? 'pending';

    const sql = `
      INSERT INTO sale_installments_land (sale_order_id, installment_no, due_date, amount, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    await query(sql, [sale_order_id, installment_no, due_date, amount, status]);
  });

  await Promise.all(insertQueries);
};

// Fetch All Land Sale Orders
export const getAllLandOrders = async () => {
  return await query("SELECT * FROM sale_orders_land");
};

// Fetch Land Sale Order By ID
export const getLandOrderById = async (id) => {
  const result = await query("SELECT * FROM sale_orders_land WHERE id = ?", [id]);
  return result[0] || null;
};

// Update Land Sale Order
export const updateLandOrder = async (id, updatedData) => {
  const keys = Object.keys(updatedData);
  const values = Object.values(updatedData);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");

  const sql = `UPDATE sale_orders_land SET ${setClause} WHERE id = ?`;
  return await query(sql, [...values, id]);
};

// Delete Land Sale Order and Associated Data
export const deleteLandOrder = async (id) => {
  // Deleting associated down payments and installments before deleting the sale order
  await query("DELETE FROM sale_down_payments_land WHERE sale_order_id = ?", [id]);
  await query("DELETE FROM sale_installments_land WHERE sale_order_id = ?", [id]);

  // Deleting the sale order itself
  return await query("DELETE FROM sale_orders_land WHERE id = ?", [id]);
};
