import { createWorkDetail, getAllWorkDetails, getWorkDetailById, updateWorkDetail, deleteWorkDetail } from "../model/workDetailsModel.js";

export const createNewWorkDetail = async (req, res) => {
  const { work_head_id, description } = req.body;

  if (!work_head_id || !description) {
    return res.status(400).json({ message: "Work head ID and description are required" });
  }

  try {
    await createWorkDetail(work_head_id, description);
    res.status(201).json({ message: "Work detail created successfully" });
  } catch (error) {
    console.error("Error creating work detail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkDetails = async (req, res) => {
  try {
    const workDetails = await getAllWorkDetails();

    const formattedDetails = workDetails.map((detail) => ({
      id: detail.id,
      work_head_id: detail.work_head_id,
      description: detail.description,
    }));

    res.status(200).json({ data: formattedDetails });
  } catch (error) {
    console.error("Error fetching work details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const workDetail = await getWorkDetailById(id);

    if (workDetail.length === 0) {
      return res.status(404).json({ message: "Work detail not found" });
    }

    const { id: detailId, work_head_id, description } = workDetail[0];

    res.status(200).json({ data: { id: detailId, work_head_id, description } });
  } catch (error) {
    console.error("Error fetching work detail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateWorkDetailById = async (req, res) => {
  const { id } = req.params;
  const { work_head_id, description } = req.body;

  if (!work_head_id || !description) {
    return res.status(400).json({ message: "Work head ID and description are required" });
  }

  try {
    await updateWorkDetail(id, work_head_id, description);
    res.status(200).json({ message: "Work detail updated successfully" });
  } catch (error) {
    console.error("Error updating work detail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteWorkDetailById = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteWorkDetail(id);
    res.status(200).json({ message: "Work detail deleted successfully" });
  } catch (error) {
    console.error("Error deleting work detail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
