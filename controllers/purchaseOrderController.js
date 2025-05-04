import {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrder,
    deletePurchaseOrder
  } from "../model/purchaseOrderModel.js";
  

  //create
  export const create = async (req, res) => {
    try {
      await createPurchaseOrder(req.body); // We don't need to return the raw result
      res.status(201).json({ message: "Purchase order created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error creating purchase order", error: error.message });
    }
  };
  
//grt all
  export const getAll = async (req, res) => {
    try {
      const data = await getAllPurchaseOrders();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching purchase orders", error });
    }
  };
  

  //get by id
  export const getById = async (req, res) => {
    try {
      const data = await getPurchaseOrderById(req.params.id);
      res.json(data[0] || {});
    } catch (error) {
      res.status(500).json({ message: "Error fetching purchase order", error });
    }
  };
  

  //update
  export const update = async (req, res) => {
    try {
      await updatePurchaseOrder(req.params.id, req.body);
      res.json({ message: "Purchase order updated" });
    } catch (error) {
      res.status(500).json({ message: "Error updating purchase order", error });
    }
  };
  

  //delete
  export const remove = async (req, res) => {
    try {
      await deletePurchaseOrder(req.params.id);
      res.json({ message: "Purchase order deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting purchase order", error });
    }
  };
  