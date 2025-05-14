import {
  createStockTransfer,
  getAllStockTransfers,
  getStockTransferById,
  updateStockTransfer,
  deleteStockTransfer
} from "../model/stockTransferModel.js";

export const create = async (req, res) => {
  try {
    const data = req.body;
    await createStockTransfer(data);
    res.status(201).json({ message: "Stock transfer created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const transfers = await getAllStockTransfers();
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getStockTransferById(id);
    if (result.length === 0) {
      return res.status(404).json({ message: "Transfer not found" });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await updateStockTransfer(id, data);
    res.json({ message: "Stock transfer updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteStockTransfer(id);
    res.json({ message: "Stock transfer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
