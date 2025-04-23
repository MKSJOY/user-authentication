import Client from "../model/register-client.js";

// Create a new client with single or multiple nominees
export const createClient = async (req, res) => {
  try {
    const data = req.body; // Assuming client data is sent in the body
    const response = await Client.createClient(data);

    if (response.success) {
      res.status(201).json({
        success: true,
        message: "Client registered successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Error registering client or nominees",
        error: response.error,
      });
    }
  } catch (error) {
    console.error("Error in client creation:", error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: "Error registering client or nominees",
      error: error.message,
    });
  }
};

// ✅ Get all clients grouped with nominees, projects, and buildings
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.getAllClients();
    // Ensure all clients' nominees are grouped correctly, and projects/buildings are included
    res.status(200).json({ success: true, clients });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching clients", error: error.message });
  }
};

// ✅ Get client by ID grouped with nominees, projects, and buildings
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

//Get all projects and buildings under a client
export const getAllProjectsAndBuildingsByClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const data = await Client.getAllProjectsAndBuildingsByClient(clientId);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching all projects and buildings:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching all projects and buildings",
      error: error.message,
    });
  }
};

//Get only projects under a client
export const getProjectsByClient = async (req, res) => {
  try {
    const client_id = req.params.id;
    const data = await Client.getProjectsByClient(client_id);
    
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: "No projects found for this client." });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching projects by client:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message,
    });
  }
};

//Get only buildings under a client
export const getBuildingsByClient = async (req, res) => {
  try {
    const client_id = req.params.id;
    const data = await Client.getBuildingsByClient(client_id);

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: "No buildings found for this client." });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching buildings by client:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching buildings",
      error: error.message,
    });
  }
};


