import { query } from "../config/database.js";

// Create a new plot
// Helper to generate plot_code
const generatePlotCode = () => {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 random characters
  const timePart = Date.now().toString(36).slice(-3).toUpperCase(); // 3 characters from timestamp
  return `PLT-${timePart}${randomPart}`;
};

// Create a new plot
export const createPlot = async (plotData) => {
  const { company_id, plot_name, plot_shape, plot_area, inventory_for_sale, note, land_id, property_name } = plotData;

  const plot_code = generatePlotCode(); // Auto-generate plot_code

  return await query(
    `INSERT INTO plots 
     (company_id, plot_name, plot_shape, plot_area, inventory_for_sale, note, land_id, property_name, plot_code) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [company_id, plot_name, plot_shape, plot_area, inventory_for_sale, note, land_id, property_name, plot_code]
  );
};


// Get all plots
export const getAllPlots = async () => {
  return await query("SELECT * FROM plots");
};

// Get a single plot by ID
export const getPlotById = async (id) => {
  const result = await query("SELECT * FROM plots WHERE id = ?", [id]);
  return result.length ? result[0] : null;
};

// Update a plot
export const updatePlot = async (id, updatedData) => {
  const { company_id, plot_name, plot_shape, plot_area, inventory_for_sale, note, land_id, property_name } = updatedData;
  return await query(
    "UPDATE plots SET company_id = ?, plot_name = ?, plot_shape = ?, plot_area = ?, inventory_for_sale = ?, note = ?, land_id = ?, property_name = ? WHERE id = ?",
    [plot_name, plot_shape, plot_area, inventory_for_sale, note, property_id, property_name, id]
  );
};

// Delete a plot
export const deletePlot = async (id) => {
  return await query("DELETE FROM plots WHERE id = ?", [id]);
};

// Get plots by property ID
export const getPlotsByPropertyId = async (propertyId) => {
    return await query("SELECT * FROM plots WHERE property_id = ?", [propertyId]);
  };
