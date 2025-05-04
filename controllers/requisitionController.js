import {
    createRequisition,
    getAllRequisitions,
    getRequisitionById,
    updateRequisition,
    deleteRequisition,
  } from "../model/requisitionModel.js";
  
  // Create
  export const create = async (req, res) => {
    try {
      const { items = [], ...requisition } = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ message: "Items must be an array" });
      }
  
      const requisition_id = await createRequisition(requisition, items);
      res.status(201).json({ message: "Requisition created", requisition_id });
    } catch (err) {
      res.status(500).json({ message: "Failed to create requisition", error: err.message });
    }
  };
  
  // Get all
  export const getAll = async (req, res) => {
    try {
      const data = await getAllRequisitions();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch requisitions", error: err.message });
    }
  };
  
  // Get one
  export const getOne = async (req, res) => {
    try {
      const data = await getRequisitionById(req.params.id);
      if (!data) return res.status(404).json({ message: "Requisition not found" });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch requisition", error: err.message });
    }
  };
  
  // Update
  export const update = async (req, res) => {
    try {
      await updateRequisition(req.params.id, req.body);
      res.json({ message: "Requisition updated" });
    } catch (err) {
      res.status(500).json({ message: "Failed to update requisition", error: err.message });
    }
  };
  
  // Delete
  export const remove = async (req, res) => {
    try {
      await deleteRequisition(req.params.id);
      res.json({ message: "Requisition deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete requisition", error: err.message });
    }
  };
  