import Client from "../model/register-client.js";

// Create a new client with single or multiple nominees
export const createClient = async (req, res) => {
  try {
    const data = req.body;

    if (!data.project_name) {
      return res.status(400).json({ success: false, message: "Project name is required" });
    }

    // Handle nominee as a single object or array
    const { nominees } = data;
    if (nominees && !Array.isArray(nominees)) {
      data.nominees = [nominees];
    }

    await Client.createClient(data);

    res.status(201).json({ success: true, message: "Client registered successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error registering client", error: error.message });
  }
};

// ✅ Get all clients grouped with nominees
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.getAllClients();
    // Ensure all clients' nominees are grouped correctly
    res.status(200).json({ success: true, clients });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching clients", error: error.message });
  }
};

// ✅ Get client by ID grouped with nominees
export const getClientById = async (req, res) => {
  try {
    const clientId = req.params.id;
    const client = await Client.getClientById(clientId);

    if (!client || client.length === 0) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    // Return the first client (since getClientById returns an array with a single client)
    res.status(200).json({ success: true, client: client[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching client", error: error.message });
  }
};

// Update an existing client by ID (without file upload handling)
export const updateClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const data = req.body;

    const client = await Client.getClientById(clientId);
    if (client.length === 0) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    await Client.updateClient(clientId, data);

    res.status(200).json({ success: true, message: "Client updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating client", error: error.message });
  }
};

// Delete a client by ID and their nominees
export const deleteClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const client = await Client.getClientById(clientId);
    if (client.length === 0) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    await Client.deleteClient(clientId);
    res.status(200).json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting client", error: error.message });
  }
};
