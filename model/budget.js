import { query } from "../config/database.js";
import { pool } from "../config/database.js";  // ✅ Correct now
import { v4 as uuidv4 } from "uuid";

export async function createBudget(budgetData) {
  const connection = await pool.getConnection(); // ✅ Get safe connection

  try {
    await connection.beginTransaction(); // ✅ Start transaction

    const { project_id, building_id, date_from, date_to, is_initial_budget, floors } = budgetData;
    const budgetId = uuidv4();

    const budgetQuery = `
      INSERT INTO budgets (id, project_id, building_id, date_from, date_to, is_initial_budget)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await connection.query(budgetQuery, [budgetId, project_id, building_id, date_from, date_to, is_initial_budget]);

    if (Array.isArray(floors)) {
      for (const floor of floors) {
        const { floor_name, work_types } = floor;
        const floorId = uuidv4();

        const floorQuery = `
          INSERT INTO floors (id, budget_id, floor_name)
          VALUES (?, ?, ?)
        `;
        await connection.query(floorQuery, [floorId, budgetId, floor_name]);

        if (Array.isArray(work_types)) {
          for (const workType of work_types) {
            const { work_type, start_date, end_date, budget_heads } = workType;
            const workTypeId = uuidv4();

            const workTypeQuery = `
              INSERT INTO work_types (id, floor_id, budget_id, work_type, start_date, end_date)
              VALUES (?, ?, ?, ?, ?, ?)
            `;
            await connection.query(workTypeQuery, [workTypeId, floorId, budgetId, work_type, start_date || null, end_date || null]);

            if (Array.isArray(budget_heads)) {
              for (const budgetHead of budget_heads) {
                const { budget_head, unit, dia, quantity, rate } = budgetHead;
                const budgetHeadId = uuidv4();

                const budgetHeadQuery = `
                  INSERT INTO budget_heads (id, work_type_id, budget_id, budget_head, unit, dia, quantity, rate)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
                await connection.query(budgetHeadQuery, [budgetHeadId, workTypeId, budgetId, budget_head, unit, dia, quantity, rate]);
              }
            }
          }
        }
      }
    }

    await connection.commit(); // ✅ COMMIT after everything succeeds
    //console.log('✅ Budget and related data inserted successfully.');
    return { success: true, budgetId };
    
  } catch (error) {
    await connection.rollback(); // ❌ Rollback if error happens
    console.error("❌ Error creating budget:", error);
    return { success: false, error: error.message };
  } finally {
    connection.release(); // ✅ Always release connection back to pool
  }
}
// Get all budgets with nested floors, work_types, and budget_heads
export const getAllBudgets = async () => {
  const budgets = await query("SELECT * FROM budgets");

  for (const budget of budgets) {
    const floors = await query("SELECT * FROM floors WHERE budget_id = ?", [budget.id]);
    
    for (const floor of floors) {
      const workTypes = await query("SELECT * FROM work_types WHERE floor_id = ?", [floor.id]);

      for (const workType of workTypes) {
        const budgetHeads = await query("SELECT * FROM budget_heads WHERE work_type_id = ?", [workType.id]);
        workType.budget_heads = budgetHeads; // Attach budget_heads inside each workType
      }

      floor.work_types = workTypes; // Attach work_types inside each floor
    }

    budget.floors = floors; // Attach floors inside each budget
  }

  return budgets;
};

// Get budget by ID (with floors, work_types, budget_heads)
export const getBudgetById = async (id) => {
  const budgetResult = await query("SELECT * FROM budgets WHERE id = ?", [id]);

  if (!budgetResult.length) return null;

  const budgetData = budgetResult[0];

  const floors = await query("SELECT * FROM floors WHERE budget_id = ?", [id]);

  for (const floor of floors) {
    const workTypes = await query("SELECT * FROM work_types WHERE floor_id = ?", [floor.id]);

    for (const workType of workTypes) {
      const budgetHeads = await query("SELECT * FROM budget_heads WHERE work_type_id = ?", [workType.id]);
      workType.budget_heads = budgetHeads;
    }

    floor.work_types = workTypes;
  }

  budgetData.floors = floors;
  return budgetData;
};

// Update full budget by ID
export const updateBudgetById = async (id, budgetData) => {
  const { project_id, building_id, date_from, date_to, is_initial_budget, floors } = budgetData;

  // Update the main budget record
  await query(
    `UPDATE budgets SET project_id = ?, building_id = ?, date_from = ?, date_to = ?, is_initial_budget = ? WHERE id = ?`,
    [project_id, building_id, date_from, date_to, is_initial_budget, id]
  );

  // Loop through floors
  for (const floor of floors) {
    await query(`UPDATE floors SET floor_name = ? WHERE id = ?`, [floor.floor_name, floor.id]);

    // Loop through work types
    for (const workType of floor.work_types) {
      await query(
        `UPDATE work_types SET work_type = ?, start_date = ?, end_date = ? WHERE id = ?`,
        [workType.work_type, workType.start_date || null, workType.end_date || null, workType.id]
      );

      // Loop through budget heads
      for (const budgetHead of workType.budget_heads) {
        await query(
          `UPDATE budget_heads SET budget_head = ?, unit = ?, dia = ?, quantity = ?, rate = ? WHERE id = ?`,
          [
            budgetHead.budget_head,
            budgetHead.unit,
            budgetHead.dia,
            budgetHead.quantity,
            budgetHead.rate,
            budgetHead.id
          ]
        );
      }
    }
  }

  return { message: "Budget updated successfully" };
};

// Delete budget by ID
export const deleteBudgetById = async (id) => {
  const deleteQuery = `DELETE FROM budgets WHERE id = ?`;
  await query(deleteQuery, [id]);
  return { message: "Budget deleted successfully" };
};
