import { getCompaniesByUser } from "../../controllers/company-userID-controller.js";

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      await getCompaniesByUser(req, res);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
