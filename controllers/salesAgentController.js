import {
    createSalesAgent,
    getAllSalesAgents,
    getSalesAgentById,
    updateSalesAgent,
    deleteSalesAgent,
  } from "../model/salesAgentModel.js";
  
  export const create = async (req, res) => {
    try {
      const id = await createSalesAgent(req.body);
      res.status(201).json({ message: "Sales agent created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create sales agent", details: error.message });
    }
  };
  
  export const getAll = async (req, res) => {
    try {
      const agents = await getAllSalesAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales agents" });
    }
  };
  
  export const getById = async (req, res) => {
    try {
      const agent = await getSalesAgentById(req.params.id);
      if (!agent) return res.status(404).json({ message: "Sales agent not found" });
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales agent" });
    }
  };
  
  export const update = async (req, res) => {
    try {
      await updateSalesAgent(req.params.id, req.body);
      res.json({ message: "Sales agent updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update sales agent" });
    }
  };
  
  export const remove = async (req, res) => {
    try {
      await deleteSalesAgent(req.params.id);
      res.json({ message: "Sales agent deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete sales agent" });
    }
  };
  