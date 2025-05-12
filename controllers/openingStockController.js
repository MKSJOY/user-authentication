import { query } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

// Create
export const createOpeningStock = async (req, res) => {
    try {
      const {
        project_id,
        building_id,
        product_id,
        brand_id,
        quantity,
        stock_date,
      } = req.body;
  
      console.log("Incoming data:", req.body); // Debug log
  
      if (
        !project_id ||
        !building_id ||
        !product_id ||
        !brand_id ||
        quantity == null ||
        !stock_date
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const id = uuidv4();
  
      await query(
        `INSERT INTO opening_stocks (id, project_id, building_id, product_id, brand_id, quantity, stock_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, project_id, building_id, product_id, brand_id, quantity, stock_date]
      );
  
      res.status(201).json({ message: "Opening stock created successfully", id });
    } catch (error) {
      console.error("Error creating opening stock:", error);
      res.status(500).json({ message: "Failed to create opening stock" });
    }
  };

// Read All
export const getOpeningStocks = async (req, res) => {
  try {
    const stocks = await query("SELECT * FROM opening_stocks");
    res.json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch opening stocks" });
  }
};

// Read One
export const getOpeningStockById = async (req, res) => {
  try {
    const { id } = req.params;
    const [stock] = await query("SELECT * FROM opening_stocks WHERE id = ?", [id]);
    if (!stock) return res.status(404).json({ message: "Stock not found" });
    res.json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch stock" });
  }
};

// Update
export const updateOpeningStock = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      project_id,
      building_id,
      product_id,
      brand_id,
      quantity,
      stock_date,
    } = req.body;

    await query(
      `UPDATE opening_stocks 
       SET project_id = ?, building_id = ?, product_id = ?, brand_id = ?, quantity = ?, stock_date = ? 
       WHERE id = ?`,
      [project_id, building_id, product_id, brand_id, quantity, stock_date, id]
    );

    res.json({ message: "Opening stock updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update opening stock" });
  }
};

// Delete
export const deleteOpeningStock = async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM opening_stocks WHERE id = ?", [id]);
    res.json({ message: "Opening stock deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete opening stock" });
  }
};
