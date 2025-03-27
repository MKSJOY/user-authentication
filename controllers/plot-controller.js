import { createPlot, getAllPlots, getPlotById, updatePlot, deletePlot, getPlotsByPropertyId } from "../model/plot-model.js";

// Create a new plot
export const addPlot = async (req, res) => {
  try {
    const plotData = req.body;

    if (!plotData.plot_name || !plotData.plot_shape || !plotData.plot_area) {
      return res.status(400).json({ success: false, message: "Plot name, shape, and area are required" });
    }

    await createPlot(plotData);
    res.status(201).json({ success: true, message: "Plot added successfully" });
  } catch (error) {
    console.error("Error adding plot:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all plots
export const getPlots = async (req, res) => {
  try {
    const plots = await getAllPlots();
    res.json({ success: true, plots });
  } catch (error) {
    console.error("Error fetching plots:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get a plot by ID
export const getPlot = async (req, res) => {
  try {
    const { id } = req.params;
    const plot = await getPlotById(id);

    if (!plot) {
      return res.status(404).json({ success: false, message: "Plot not found" });
    }

    res.json({ success: true, plot });
  } catch (error) {
    console.error("Error fetching plot:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update a plot
export const editPlot = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    await updatePlot(id, updatedData);
    res.json({ success: true, message: "Plot updated successfully" });
  } catch (error) {
    console.error("Error updating plot:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a plot
export const removePlot = async (req, res) => {
  try {
    const { id } = req.params;

    await deletePlot(id);
    res.json({ success: true, message: "Plot deleted successfully" });
  } catch (error) {
    console.error("Error deleting plot:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//import { getPlotsByPropertyId } from "../model/plot-model.js";

// Get plots by property ID
export const getPlotsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const plots = await getPlotsByPropertyId(propertyId);

    if (plots.length === 0) {
      return res.status(404).json({ success: false, message: "No plots found for this property" });
    }

    res.json({ success: true, plots });
  } catch (error) {
    console.error("Error fetching plots by property ID:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

