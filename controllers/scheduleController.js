import { v4 as uuidv4 } from "uuid";
import {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} from "../model/scheduleModel.js";

// Create schedule with items
export const createScheduleWithItems = async (req, res) => {
    try {
      const schedule_id = uuidv4();
      const {
        project_id,
        building_id,
        description,
        schedule_month,
        schedule_year,
        schedule_date,
        items = [],
      } = req.body;
  
      const schedule = {
        id: schedule_id,
        project_id,
        building_id,
        description,
        schedule_month,
        schedule_year,
        schedule_date,
      };
  
      const scheduleItems = items.map((item) => ({
        ...item,
        id: uuidv4(),
        schedule_id,
      }));
  
      await createSchedule(schedule, scheduleItems);
      res.status(201).json({ message: "Created", schedule_id });
    } catch (err) {
      res.status(500).json({ message: "Failed to create schedule" });
    }
  };
  
  // Get all schedules with items
  export const getAllScheduleData = async (req, res) => {
    try {
      const data = await getAllSchedules();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  };
  
  // Get schedule by ID with items
  export const getScheduleDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getScheduleById(id);
      if (!data.schedule) return res.status(404).json({ message: "Not found" });
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch schedule" });
    }
  };

export const updateScheduleDetails = async (req, res) => {
  try {
    const { id } = req.params;
    await updateSchedule(id, req.body);
    res.status(200).json({ message: "Schedule updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update schedule" });
  }
};

export const deleteScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteSchedule(id);
    res.status(200).json({ message: "Schedule deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete schedule" });
  }
};

