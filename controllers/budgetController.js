// controllers/budgetController.js
import { createBudget, getAllBudgets, getBudgetById, updateBudgetById, deleteBudgetById } from "../model/budget.js";

export const createFullBudget = async (req, res) => {
    try {
      const budgetData = req.body;
      //console.log("Received budget data:", budgetData); // Debug log
      const budgetId = await createBudget(budgetData);
      res.status(201).json({ message: "Full Budget created successfully", budget_id: budgetId });
    } catch (error) {
      console.error("Error creating budget:", error); // Debug log for error
      res.status(500).json({ message: "Error creating budget", error: error.message });
    }
  };
  
  // Get all budgets
export const getAllBudget = async (req, res) => {
  try {
    const budgets = await getAllBudgets(); // 🛠 Calling fixed function
    if (!budgets.length) {
      return res.status(404).json({ message: "No budgets found" });
    }
    res.status(200).json({ budgets }); // 🛠 Send the found budgets
  } catch (error) {
    res.status(500).json({ message: "Error fetching budgets", error: error.message });
  }
};
// Get budget by ID
export const getBudget = async (req, res) => {
  const { id } = req.params;

  try {
    const budget = await getBudgetById(id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // You can return budget directly or wrap in an object
    res.status(200).json(budget); // or { budget }
  } catch (error) {
    console.error("Error fetching budget:", error); // Optional logging
    res.status(500).json({ message: "Error fetching budget", error: error.message });
  }
};

// Update budget by ID
export const updateBudget = async (req, res) => {
  const { id } = req.params;
  const budgetData = req.body;

  try {
    const result = await updateBudgetById(id, budgetData);
    res.status(200).json(result); // Will return { message: "Budget updated successfully" }
  } catch (error) {
    console.error("Error updating budget:", error); // Optional logging
    res.status(500).json({ message: "Error updating budget", error: error.message });
  }
};


// Delete budget by ID
export const deleteBudget = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteBudgetById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error deleting budget", error: error.message });
  }
};
