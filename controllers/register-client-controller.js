import Client from "../model/register-client.js";

// Create a new client without file upload handling
export const createClient = async (req, res) => {
  try {
    const data = req.body;

    if (!data.project_name) {
      return res.status(400).json({ success: false, message: "Project name is required" });
    }

    await Client.createClient(data);

    res.status(201).json({ success: true, message: "Client registered successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error registering client", error: error.message });
  }
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
    if (client.length === 0) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    res.status(200).json({ success: true, client: client[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching client", error: error.message });
  }
};

// Update an existing client by ID without file upload handling
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

// Delete a client by ID
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
