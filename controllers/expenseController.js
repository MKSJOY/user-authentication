import { query } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

// Create
export const createExpense = async (req, res) => {
  const {
    date,
    type,
    project_id,
    building_site_id,
    category_name,
    category_id,
    payment_type,
    cost_purpose,
    manual_inv_no,
    expense_by,
    note,
    attachment_path, // ✅ added
    costs = [],
  } = req.body;

  const expenseId = uuidv4();

  try {
    await query(
      `INSERT INTO expenses 
        (id, date, type, project_id, building_site_id, category_name, category_id, payment_type, cost_purpose, manual_inv_no, expense_by, note, attachment_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        expenseId,
        date,
        type,
        project_id,
        building_site_id,
        category_name,
        category_id,
        payment_type,
        cost_purpose,
        manual_inv_no,
        expense_by,
        note,
        attachment_path,
      ]
    );

    for (const cost of costs) {
      await query(
        `INSERT INTO expense_costs (id, expense_id, cost_name, cost_amount) VALUES (?, ?, ?, ?)`,
        [uuidv4(), expenseId, cost.cost_name, cost.cost_amount]
      );
    }

    res.status(201).json({ message: "Expense created", expense_id: expenseId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read All
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await query(`SELECT * FROM expenses`);
    const result = await Promise.all(
      expenses.map(async (expense) => {
        const costs = await query(
          `SELECT * FROM expense_costs WHERE expense_id = ?`,
          [expense.id]
        );
        return { ...expense, costs };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read by ID
export const getExpenseById = async (req, res) => {
  const { id } = req.params;

  try {
    const expenseRows = await query(`SELECT * FROM expenses WHERE id = ?`, [id]);
    if (expenseRows.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const costs = await query(
      `SELECT * FROM expense_costs WHERE expense_id = ?`,
      [id]
    );

    res.json({ ...expenseRows[0], costs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const {
    date,
    type,
    project_id,
    building_site_id,
    category_name,
    category_id,
    payment_type,
    cost_purpose,
    manual_inv_no,
    expense_by,
    note,
    attachment_path, // ✅ added
    costs = [],
  } = req.body;

  try {
    await query(
      `UPDATE expenses SET date=?, type=?, project_id=?, building_site_id=?, category_name=?, category_id=?, payment_type=?, cost_purpose=?, manual_inv_no=?, expense_by=?, note=?, attachment_path=? WHERE id=?`,
      [
        date,
        type,
        project_id,
        building_site_id,
        category_name,
        category_id,
        payment_type,
        cost_purpose,
        manual_inv_no,
        expense_by,
        note,
        attachment_path,
        id,
      ]
    );

    await query(`DELETE FROM expense_costs WHERE expense_id = ?`, [id]);

    for (const cost of costs) {
      await query(
        `INSERT INTO expense_costs (id, expense_id, cost_name, cost_amount) VALUES (?, ?, ?, ?)`,
        [uuidv4(), id, cost.cost_name, cost.cost_amount]
      );
    }

    res.json({ message: "Expense updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    await query(`DELETE FROM expenses WHERE id = ?`, [id]);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
