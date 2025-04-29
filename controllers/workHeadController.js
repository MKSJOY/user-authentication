import { createWorkHead, getAllWorkHeads, getWorkHeadById, updateWorkHead, deleteWorkHead } from "../model/workHeadModel.js";

// Create a new work head
export const createNewWorkHead = async (req, res) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ message: "Work head name is required" });
    }
  
    try {
      await createWorkHead(name); // We still await it, but ignore the result
      res.status(201).json({ message: "Work head created successfully" });
    } catch (error) {
      console.error("Error creating work head:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
// Get all work heads
export const getWorkHeads = async (req, res) => {
    try {
      const workHeads = await getAllWorkHeads(); // still calling your model
  
      // Map to only include id and name
      const formattedWorkHeads = workHeads.map((workHead) => ({
        id: workHead.id,
        name: workHead.name,
      }));
  
      res.status(200).json({ data: formattedWorkHeads });
    } catch (error) {
      console.error("Error fetching work heads:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

// Get a single work head by ID
export const getWorkHead = async (req, res) => {
    const { id } = req.params;
  
    try {
      const workHead = await getWorkHeadById(id);
  
      if (workHead.length === 0) {
        return res.status(404).json({ message: "Work head not found" });
      }
  
      // Pick only id and name
      const { id: workHeadId, name } = workHead[0];
  
      res.status(200).json({ data: { id: workHeadId, name } });
    } catch (error) {
      console.error("Error fetching work head:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

// Update a work head by ID
export const updateWorkHeadData = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Work head name is required" });
  }

  try {
    const result = await updateWorkHead(id, name);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Work head not found" });
    }
    res.status(200).json({ message: "Work head updated successfully" });
  } catch (error) {
    console.error("Error updating work head:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a work head by ID
export const deleteWorkHeadData = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteWorkHead(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Work head not found" });
    }
    res.status(200).json({ message: "Work head deleted successfully" });
  } catch (error) {
    console.error("Error deleting work head:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
