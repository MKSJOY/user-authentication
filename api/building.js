import {
    createBuilding,
    getAllBuildings,
    getBuildingById,
    updateBuilding,
    deleteBuilding,
    getProjectNames,
  } from "../../controllers/build-site-controller.js";
  
  export default async function handler(req, res) {
    const { method } = req;
  
    try {
      if (method === "POST") {
        await createBuilding(req, res);
      } else if (method === "GET") {
        if (req.query.id) {
          await getBuildingById(req, res);
        } else if (req.query.projects === "names") {
          await getProjectNames(req, res);
        } else {
          await getAllBuildings(req, res);
        }
      } else if (method === "PUT") {
        await updateBuilding(req, res);
      } else if (method === "DELETE") {
        await deleteBuilding(req, res);
      } else {
        res.status(405).json({ message: "Method Not Allowed" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  