import {
    createLandSaleOrder,
    createDownPayments,
    createInstallments,
    getAllLandOrders,
    getLandOrderById,
    updateLandOrder,
    deleteLandOrder
  } from "../model/create_sale_order_land.js";
  
  // Installment Generator
  const generateInstallments = (sale_date, count, duration, amount) => {
    const installments = [];
    const startDate = new Date(sale_date);
    const interval = Math.floor(duration / count);
  
    for (let i = 0; i < count; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i * interval);
  
      installments.push({
        installment_no: i + 1,
        due_date: dueDate.toISOString().split("T")[0],
        amount: amount,
        status: "pending"
      });
    }
  
    return installments;
  };
  
  // Create Controller
  export const createLandSaleOrderController = async (req, res) => {
    try {
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
        discount = 0,
        registration_cost = 0,
        utility_charge = 0,
        others_charge = 0,
        vat_percentage = 0,
        reference = "",
        sale_date,
        down_payments = [],
        number_of_installments = 0,
        installment_duration = 0
      } = req.body;
  
      const total = quantity * unit_price;
      const discounted_total = total - (total * (discount / 100));
      const charges_total = registration_cost + utility_charge + others_charge;
      const sale_value_after_discount = discounted_total + charges_total;
      const vat = sale_value_after_discount * (vat_percentage / 100);
      const sale_value = sale_value_after_discount + vat;
      const total_down_payment = down_payments.reduce((sum, dp) => sum + Number(dp.amount || 0), 0);
      const remaining = sale_value - total_down_payment;
  
      let installment_amount = 0;
      let installments = [];
  
      if (number_of_installments > 0 && installment_duration > 0 && remaining > 0) {
        installment_amount = parseFloat((remaining / number_of_installments).toFixed(2));
        installments = generateInstallments(sale_date, number_of_installments, installment_duration, installment_amount);
      }
  
      const saleData = {
        client_name, land_name, plot, location, mouja, cs_dag_no,
        quantity, unit, unit_price, total, discount,
        sale_value_after_discount, registration_cost, utility_charge,
        others_charge, vat_percentage, sale_value, installment_amount,
        reference, sale_date
      };
  
      const sale_order_id = await createLandSaleOrder(saleData);
  
      if (down_payments.length) await createDownPayments(sale_order_id, down_payments);
      if (installments.length) await createInstallments(sale_order_id, installments);
  
      return res.status(201).json({
        message: "Land sale order created",
        sale_order_id,
        installments
      });
    } catch (error) {
      console.error("Error creating land sale order:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get All
  export const getAllLandSaleOrdersController = async (req, res) => {
    try {
      const orders = await getAllLandOrders();
      res.status(200).json({ message: "Fetched successfully", data: orders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get By ID
  export const getLandSaleOrderByIdController = async (req, res) => {
    try {
      const { id } = req.params;
      const order = await getLandOrderById(id);
      if (!order) return res.status(404).json({ message: "Not found" });
      res.status(200).json({ message: "Fetched BY ID", order });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update
  export const updateLandSaleOrderController = async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      await updateLandOrder(id, data);
      res.status(200).json({ message: "Updated Successfully", data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Delete
  export const deleteLandSaleOrderController = async (req, res) => {
    try {
      const { id } = req.params;
      await deleteLandOrder(id);
      res.status(200).json({ message: "Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  