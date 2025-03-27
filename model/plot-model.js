import { query } from "../config/database.js";

// Create a new plot
export const createPlot = async (plotData) => {
  const { plot_name, plot_shape, plot_area, inventory_for_sale, note, property_id, property_name } = plotData;
  return await query(
    "INSERT INTO plots (plot_name, plot_shape, plot_area, inventory_for_sale, note, property_id, property_name) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [plot_name, plot_shape, plot_area, inventory_for_sale, note, property_id, property_name]
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
  const { plot_name, plot_shape, plot_area, inventory_for_sale, note, property_id, property_name } = updatedData;
  return await query(
    "UPDATE plots SET plot_name = ?, plot_shape = ?, plot_area = ?, inventory_for_sale = ?, note = ?, property_id = ?, property_name = ? WHERE id = ?",
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
