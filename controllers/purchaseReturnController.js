import {
    createPurchaseReturn,
    getAllPurchaseReturns,
    getPurchaseReturnById,
    updatePurchaseReturn,
    deletePurchaseReturn,
  } from "../model/purchaseReturnModel.js";
  
  export const addPurchaseReturn = async (req, res) => {
    try {
      await createPurchaseReturn(req.body);
      res.status(201).json({ message: "Purchase return created successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const getPurchaseReturns = async (req, res) => {
    try {
      const data = await getAllPurchaseReturns();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const getPurchaseReturn = async (req, res) => {
    try {
      const data = await getPurchaseReturnById(req.params.id);
      if (!data) return res.status(404).json({ message: "Return not found" });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const editPurchaseReturn = async (req, res) => {
    try {
      await updatePurchaseReturn(req.params.id, req.body);
      res.json({ message: "Purchase return updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const removePurchaseReturn = async (req, res) => {
    try {
      await deletePurchaseReturn(req.params.id);
      res.json({ message: "Purchase return deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  