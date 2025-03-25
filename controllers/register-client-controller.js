import Client from "../model/register-client.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

// Helper function to map uploaded files
const mapUploadedFiles = (files) => ({
  national_id_file: files.national_id_file ? files.national_id_file[0].path : null,
  passport_file: files.passport_file ? files.passport_file[0].path : null,
  tin_file: files.tin_file ? files.tin_file[0].path : null,
  photo_file: files.photo_file ? files.photo_file[0].path : null,
});

// Create a new client with file upload handling
export const createClient = async (req, res) => {
  uploadMiddleware.fields([
    { name: "national_id_file", maxCount: 1 },
    { name: "passport_file", maxCount: 1 },
    { name: "tin_file", maxCount: 1 },
    { name: "photo_file", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    try {
      const data = req.body;
      if (!data.project_name) return res.status(400).json({ success: false, message: "Project name is required" });

      const fileData = req.files ? mapUploadedFiles(req.files) : {};
      await Client.createClient({ ...data, ...fileData });

      res.status(201).json({ success: true, message: "Client registered successfully!" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error registering client", error: error.message });
    }
  });
};

// Get all clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.getAllClients();
    res.status(200).json({ success: true, clients });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching clients", error: error.message });
  }
};

// Get client by ID
export const getClientById = async (req, res) => {
  try {
    const clientId = req.params.id;
    const client = await Client.getClientById(clientId);
    if (client.length === 0) return res.status(404).json({ success: false, message: "Client not found" });

    res.status(200).json({ success: true, client: client[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching client", error: error.message });
  }
};

// Update an existing client by ID with file upload handling
export const updateClient = async (req, res) => {
  uploadMiddleware.fields([
    { name: "national_id_file", maxCount: 1 },
    { name: "passport_file", maxCount: 1 },
    { name: "tin_file", maxCount: 1 },
    { name: "photo_file", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });

    try {
      const clientId = req.params.id;
      const data = req.body;

      const client = await Client.getClientById(clientId);
      if (client.length === 0) return res.status(404).json({ success: false, message: "Client not found" });

      const fileData = req.files ? mapUploadedFiles(req.files) : {};
      await Client.updateClient(clientId, { ...data, ...fileData });

      res.status(200).json({ success: true, message: "Client updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error updating client", error: error.message });
    }
  });
};

// Delete a client by ID with file deletion
export const deleteClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const client = await Client.getClientById(clientId);
    if (client.length === 0) return res.status(404).json({ success: false, message: "Client not found" });

    await Client.deleteClient(clientId);
    res.status(200).json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting client", error: error.message });
  }
};
