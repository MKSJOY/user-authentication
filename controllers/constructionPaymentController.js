import {
    createPayment, getAllPayments, getPaymentById,
    updatePayment, deletePayment
  } from "../model/constructionPaymentModel.js";
  
  export const createConstructionPayment = async (req, res) => {
    try {
      const payment = await createPayment(req.body);
      res.status(201).json({
        message: "Payment created successfully"
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  export const getConstructionPayments = async (req, res) => {
    try {
      const payments = await getAllPayments();
      res.json(payments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  export const getConstructionPaymentById = async (req, res) => {
    try {
      const [payment] = await getPaymentById(req.params.id);
      if (!payment) return res.status(404).json({ message: "Payment not found" });
      res.json(payment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  export const updateConstructionPayment = async (req, res) => {
    try {
      await updatePayment(req.params.id, req.body);
      res.json({ message: "Payment updated" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  export const deleteConstructionPayment = async (req, res) => {
    try {
      await deletePayment(req.params.id);
      res.json({ message: "Payment deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  