import { getBuildingsByProject } from "../../controllers/getBuildings-projectName-controller.js";

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      await getBuildingsByProject(req, res); // Call the controller function
    } else {
      res.status(405).json({ message: "Method Not Allowed" }); // Handle unsupported methods
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
