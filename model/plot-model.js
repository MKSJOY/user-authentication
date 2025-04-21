import { query } from "../config/database.js";

// Create a new plot
export const createPlot = async (plotData) => {
  const { company_id, plot_name, plot_shape, plot_area, inventory_for_sale, note, property_id, property_name } = plotData;
  return await query(
    "INSERT INTO plots (company_id, plot_name, plot_shape, plot_area, inventory_for_sale, note, property_id, property_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [company_id, plot_name, plot_shape, plot_area, inventory_for_sale, note, property_id, property_name]
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
  const { company_id, plot_name, plot_shape, plot_area, inventory_for_sale, note, property_id, property_name } = updatedData;
  return await query(
    "UPDATE plots SET company_id = ?, plot_name = ?, plot_shape = ?, plot_area = ?, inventory_for_sale = ?, note = ?, property_id = ?, property_name = ? WHERE id = ?",
    [company_id, plot_name, plot_shape, plot_area, inventory_for_sale, note, property_id, property_name, id]
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


  // Get summary of plots (Total, Sold, Available)
export const getPlotSummary = async () => {
  const result = await query(`
    SELECT
      COUNT(*) AS total_plots,
      COUNT(CASE WHEN inventory_for_sale = 'Yes' THEN 1 END) AS available_plots,
      COUNT(CASE WHEN inventory_for_sale = 'No' THEN 1 END) AS sold_plots
    FROM plots
  `);

  return result[0]; // Returns the first (and only) row in the result
};
