import uploadMiddleware from "../../middleware/uploadMiddleware.js";
import {
  registerClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../../controllers/register-client-controller.js";

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "POST") {
      // Handle file upload before passing to the controller
      uploadMiddleware.fields([
        { name: "nid", maxCount: 1 },      // National ID file
        { name: "passport", maxCount: 1 }, // Passport file
        { name: "tin", maxCount: 1 },      // TIN file
        { name: "photo", maxCount: 1 },    // Photo file
      ])(req, res, async (err) => {
        if (err) {
          // Return error message if file upload fails
          return res.status(400).json({ success: false, message: err.message });
        }

        // After successful file upload, proceed with registering the client
        await registerClient(req, res);
      });
    } else if (method === "GET") {
      if (req.query.id) {
        // Fetch a client by ID if query parameter `id` is provided
        await getClientById(req, res);
      } else {
        // Fetch all clients if no `id` query parameter
        await getAllClients(req, res);
      }
    } else if (method === "PUT") {
      // Update client details (with file upload if necessary)
      await updateClient(req, res);
    } else if (method === "DELETE") {
      // Delete a client by ID
      await deleteClient(req, res);
    } else {
      // Return method not allowed for unsupported HTTP methods
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    // Handle unexpected errors and provide detailed error messages
    console.error("Error in API handler:", error); // For debugging
    res.status(500).json({ success: false, message: error.message });
  }
}
