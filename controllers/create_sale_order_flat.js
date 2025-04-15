import {
    createSaleOrder,
    createDownPayments,
    createInstallments,
    getAllSaleOrders,
    getSaleOrderById,
    updateSaleOrder,
    deleteSaleOrder,
  } from "../model/create_sale_order_flat.js";
  
  // Helper to generate installment schedule
  const generateInstallments = (sale_date, number_of_installments, installment_duration, amount_per_installment) => {
    const installments = [];
    const startDate = new Date(sale_date);
    const interval = Math.floor(installment_duration / number_of_installments);
  
    for (let i = 0; i < number_of_installments; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i * interval);
  
      installments.push({
        installment_no: i + 1,
        due_date: dueDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        amount: amount_per_installment,
        status: "pending",
      });
    }
  
    return installments;
  };
  
  // Create Sale Order Controller
  export const createSaleOrderController = async (req, res) => {
    try {
      const {
        client_name,
        property_name,
        sale_type,
        type,
        size,
        rate_per_sft,
        discount = 0,
        discount_type = "fixed", // or "percent"
        car_parking_charge = 0,
        registration_cost = 0,
        utility_charge = 0,
        others_charge = 0,
        vat_percentage = 0,
        reference = "",
        sale_date,
        down_payments = [],
        number_of_installments = 0,
        installment_duration = 0,
      } = req.body;
  
      // Basic validation
      if (!client_name || !sale_date || size <= 0 || rate_per_sft <= 0) {
        return res.status(400).json({ message: "Missing or invalid input fields" });
      }
  
      // Calculate total before and after discount
      const base_total = size * rate_per_sft;
      const discounted_total =
        discount_type === "percent"
          ? base_total - base_total * (discount / 100)
          : base_total - discount;
  
      // Add additional charges
      const charges_total =
        Number(car_parking_charge) +
        Number(registration_cost) +
        Number(utility_charge) +
        Number(others_charge);
  
      const sale_value_after_discount = discounted_total + charges_total;
      const vat = sale_value_after_discount * (vat_percentage / 100);
      const sale_value = sale_value_after_discount + vat;
  
      // Calculate down payment and remaining balance
      const total_down_payment = down_payments.reduce((sum, dp) => sum + Number(dp.amount || 0), 0);
      const remaining_balance = sale_value - total_down_payment;
  
      // Generate installments if applicable
      let installment_amount = 0;
      let installments = [];
  
      if (
        Number(number_of_installments) > 0 &&
        Number(installment_duration) > 0 &&
        Number(remaining_balance) > 0
      ) {
        installment_amount = parseFloat((remaining_balance / number_of_installments).toFixed(2));
  
        installments = generateInstallments(
          sale_date,
          number_of_installments,
          installment_duration,
          installment_amount
        );
      }
  
      // Ensure installment_amount is numeric
      installment_amount = isNaN(installment_amount) ? 0 : installment_amount;
  
      // Create sale order data
      const saleOrderData = {
        client_name,
        property_name,
        sale_type,
        type,
        size,
        rate_per_sft,
        total: base_total,
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
        sale_date,
      };
  
      // Create the sale order
      const sale_order_id = await createSaleOrder(saleOrderData);
  
      // Create down payments if any
      if (down_payments.length > 0) {
        await createDownPayments(sale_order_id, down_payments);
      }
  
      // Create installments if applicable
      if (installments.length > 0) {
        await createInstallments(sale_order_id, installments);
      }
  
      // Respond with the result
      return res.status(201).json({
        message: "Sale order created successfully",
        sale_order_id,
        installments,
      });
    } catch (error) {
      console.error("Create Sale Order Error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
  // Get All Sale Orders
  export const getAllSaleOrdersController = async (req, res) => {
    try {
      const data = await getAllSaleOrders();
      res.status(200).json({ message: "Sale orders fetched successfully", data });
    } catch (error) {
      console.error("Get All Sale Orders Error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
  // Get Sale Order By ID
  export const getSaleOrderByIdController = async (req, res) => {
    try {
      const { id } = req.params;
      const order = await getSaleOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Sale order not found" });
      }
      res.status(200).json({ message: "Sale order fetched successfully", order });
    } catch (error) {
      console.error("Get Sale Order Error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
  // Update Sale Order
  export const updateSaleOrderController = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      await updateSaleOrder(id, updatedData);
      res.status(200).json({ message: "Sale order updated successfully", updatedData });
    } catch (error) {
      console.error("Update Sale Order Error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
  // Delete Sale Order
  export const deleteSaleOrderController = async (req, res) => {
    try {
      const { id } = req.params;
      await deleteSaleOrder(id);
      res.status(200).json({ message: "Sale order deleted successfully" });
    } catch (error) {
      console.error("Delete Sale Order Error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  