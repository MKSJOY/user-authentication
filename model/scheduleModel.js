import { pool } from "../config/database.js";

// Create Schedule with Items
export const createSchedule = async (schedule, items) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
  
      // Insert into work_schedules table
      await connection.execute(
        `INSERT INTO work_schedules 
        (id, project_id, building_id, description, schedule_month, schedule_year, schedule_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          schedule.id,
          schedule.project_id,
          schedule.building_id,
          schedule.description,
          schedule.schedule_month,
          schedule.schedule_year,
          schedule.schedule_date,
        ]
      );
  
      // Insert items into schedule_items table
      for (const item of items) {
        await connection.execute(
          `INSERT INTO schedule_items 
          (id, schedule_id, work_head_id, work_detail_id, start_date, end_date, work_volume)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id,
            schedule.id,
            item.work_head_id,
            item.work_detail_id,
            item.start_date,
            item.end_date,
            item.work_volume,
          ]
        );
      }
  
      await connection.commit();
      return { success: true };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  };
  
  // Get All Schedules with Items
  export const getAllSchedules = async () => {
    const [schedules] = await pool.execute(`SELECT * FROM work_schedules`);
    const allSchedules = [];
  
    for (let schedule of schedules) {
      const [items] = await pool.execute(`SELECT * FROM schedule_items WHERE schedule_id = ?`, [schedule.id]);
      allSchedules.push({
        ...schedule,
        items: items,
      });
    }
  
    return allSchedules;
  };
  
  // Get Schedule by ID with Items
  export const getScheduleById = async (id) => {
    const [schedule] = await pool.execute(`SELECT * FROM work_schedules WHERE id = ?`, [id]);
    const [items] = await pool.execute(`SELECT * FROM schedule_items WHERE schedule_id = ?`, [id]);
    return { schedule: schedule[0], items };
  };

  //update
export const updateSchedule = async (id, data) => {
  const { description, schedule_month, schedule_year, schedule_date } = data;
  const [result] = await pool.execute(
    `UPDATE work_schedules 
     SET description = ?, schedule_month = ?, schedule_year = ?, schedule_date = ?
     WHERE id = ?`,
    [description, schedule_month, schedule_year, schedule_date, id]
  );
  return result;
};

//delete
export const deleteSchedule = async (id) => {
  const [result] = await pool.execute(`DELETE FROM work_schedules WHERE id = ?`, [id]);
  return result;
};