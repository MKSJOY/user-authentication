import { query } from "../config/database.js";

// Helper function to calculate sale value after discount
const calculateSaleValueAfterDiscount = (total, discount) => {
  return total - (total * (discount / 100));
};

// Helper function to calculate the final sale value including all charges
const calculateFinalSaleValue = (total, charges) => {
  return total + charges.reduce((sum, charge) => sum + charge, 0);
};

// Helper function to calculate the remaining amount after down payments
const calculateRemainingAmount = (sale_value_after_discount, downPayments = []) => {
  const totalDownPayment = downPayments.reduce(
    (sum, dp) => sum + (dp.amount || 0),
    0
  );
  return sale_value_after_discount - totalDownPayment;
};

// Helper function to calculate installment amount after down payments
const calculateInstallmentAmount = (remaining_amount, number_of_installments) => {
  return remaining_amount / number_of_installments;
};

// Create a new sale order
export const createSaleOrder = async (data) => {
  const {
    client_name,
    property_name,
    sale_type,
    type,
    size,
    rate_per_sft,
    discount,
    car_parking_charge,
    registration_cost,
    utility_charge,
    others_charge,
    vat_percentage,
    reference,
    sale_date,
    down_payments = [],
    number_of_installments
  } = data;

  const calculatedTotal = size * rate_per_sft;

  const totalWithCharges =
    calculatedTotal +
    car_parking_charge +
    registration_cost +
    utility_charge +
    others_charge;

  const sale_value_after_discount = calculateSaleValueAfterDiscount(totalWithCharges, discount);
  const vatCharge = sale_value_after_discount * (vat_percentage / 100);
  const finalSaleValue = sale_value_after_discount + vatCharge;

  const remaining_amount = calculateRemainingAmount(finalSaleValue, down_payments);
  let installment_amount = calculateInstallmentAmount(remaining_amount, number_of_installments);
  installment_amount = Number(installment_amount) || 0;

  const sql = `
    INSERT INTO sale_orders_flat (
      client_name,
      property_name,
      sale_type,
      type,
      size,
      rate_per_sft,
      total,
      discount,
      sale_value_after_discount,
      car_parking_charge,
      registration_cost,
      utility_charge,
      others_charge,
      vat_percentage,
      sale_value,
      installment_amount,
      reference,
      sale_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    client_name,
    property_name,
    sale_type,
    type,
    size,
    rate_per_sft,
    calculatedTotal,
    discount,
    sale_value_after_discount,
    car_parking_charge,
    registration_cost,
    utility_charge,
    others_charge,
    vat_percentage,
    finalSaleValue,
    installment_amount,
    reference,
    sale_date
  ];

  await query(sql, values);

  // Get latest inserted sale order ID (assumes latest is unique enough by date + client + property)
  const [result] = await query(
    `SELECT id FROM sale_orders_flat
     WHERE client_name = ? AND property_name = ?
     ORDER BY created_at DESC LIMIT 1`,
    [client_name, property_name]
  );

  return result?.id;
};

// Create Down Payments
export const createDownPayments = async (sale_order_id, downPayments = []) => {
  if (!sale_order_id) {
    throw new Error("Sale Order ID is required for down payments");
  }

  const values = downPayments.map((dp) => [
    sale_order_id,
    dp.amount ?? null,
    dp.payment_date ?? null,
    dp.note || null
  ]);

  const sql = `
    INSERT INTO sale_down_payments_flat (
      sale_order_id,
      amount,
      payment_date,
      note
    ) VALUES ${values.map(() => "(?, ?, ?, ?)").join(", ")}
  `;

  const flatValues = values.flat();
  return await query(sql, flatValues);
};

// Create Installments
export const createInstallments = async (sale_order_id, installments = []) => {
  if (!sale_order_id) {
    throw new Error("Sale Order ID is required for installments");
  }

  const values = installments.map((inst) => [
    sale_order_id,
    inst.installment_no,
    inst.due_date,
    inst.amount,
    inst.status || "pending"
  ]);

  const sql = `
    INSERT INTO sale_installments_flat (
      sale_order_id,
      installment_no,
      due_date,
      amount,
      status
    ) VALUES ${values.map(() => "(?, ?, ?, ?, ?)").join(", ")}
  `;

  const flatValues = values.flat();
  return await query(sql, flatValues);
};

// Wrapper to insert order with payments + installments
export const createSaleOrderWithPayments = async (data, downPayments = [], installments = []) => {
  try {
    const saleOrderId = await createSaleOrder(data);

    if (downPayments.length) {
      await createDownPayments(saleOrderId, downPayments);
    }

    if (installments.length) {
      await createInstallments(saleOrderId, installments);
    }

    return saleOrderId;
  } catch (error) {
    console.error("Error in creating sale order with payments:", error);
    throw error;
  }
};

// Get All Sale Orders
export const getAllSaleOrders = async () => {
  return await query("SELECT * FROM sale_orders_flat ORDER BY created_at DESC");
};

// Get Sale Order by ID
export const getSaleOrderById = async (id) => {
  const result = await query("SELECT * FROM sale_orders_flat WHERE id = ?", [id]);
  return result.length ? result[0] : null;
};

// Update Sale Order
export const updateSaleOrder = async (id, updatedData) => {
  const keys = Object.keys(updatedData);
  const values = Object.values(updatedData);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");

  const sql = `UPDATE sale_orders_flat SET ${setClause} WHERE id = ?`;
  return await query(sql, [...values, id]);
};

// Delete Sale Order and related payments
export const deleteSaleOrder = async (id) => {
  await query("DELETE FROM sale_down_payments_flat WHERE sale_order_id = ?", [id]);
  await query("DELETE FROM sale_installments_flat WHERE sale_order_id = ?", [id]);
  return await query("DELETE FROM sale_orders_flat WHERE id = ?", [id]);
};
