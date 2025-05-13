import {
  createStockConsumption,
  getAllStockConsumptions,
  getStockConsumptionById,
  updateStockConsumption,
  deleteStockConsumption,
} from "../model/stockConsumptionModel.js";

export const create = async (req, res) => {
  try {
    const result = await createStockConsumption(req.body);
    res.status(201).json({ message: "Stock consumption created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating stock consumption", error });
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await getAllStockConsumptions();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await getStockConsumptionById(req.params.id);
    if (data.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};

export const update = async (req, res) => {
  try {
    await updateStockConsumption(req.params.id, req.body);
    res.json({ message: "Stock consumption updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating data", error });
  }
};

export const remove = async (req, res) => {
  try {
    await deleteStockConsumption(req.params.id);
    res.json({ message: "Stock consumption deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting data", error });
  }
};
