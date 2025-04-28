import { createProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty } from "../model/property.js";

// Add Property
export const addProperty = async (req, res) => {
    try {
        if (!req.body.land_property_name || !req.body.owner_name) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        const property = await createProperty(req.body); // Calls the createProperty from model
        return res.status(201).json({ success: true, data: property });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Get All Properties
export const getAllProperty = async (req, res) => {
    try {
        const properties = await getAllProperties(); // Calls the getAllProperties from model
        return res.status(200).json({ success: true, data: properties });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Get Property by ID
export const getPropertiesById = async (req, res) => {
    try {
        const result = await getPropertyById(req.params.id); // Get full result object
        if (!result.property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }
        return res.status(200).json({ success: true, data: result.property }); // Send only property
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};


//Update property
export const updateProperties = async (req, res) => {
    try {
        const propertyId = req.params.id;

        // Fetch the existing property
        const property = await getPropertyById(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        // Try to update the property using the updateProperty model function
        const updateResult = await updateProperty(propertyId, req.body);
        
        // If the update result contains an error message
        if (updateResult.status !== 200) {
            return res.status(updateResult.status).json({ success: false, message: updateResult.message });
        }

        // Send the response with the updated property
        return res.status(200).json({ success: true, message: updateResult.message, property: updateResult.updatedProperty });
        
    } catch (error) {
        console.error("Error in updating property:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};



// Delete Property
export const deleteProperties = async (req, res) => {
    try {
        const property = await getPropertyById(req.params.id); // Calls the getPropertyById from model
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }
        await deleteProperty(req.params.id); // Calls the deleteProperty from model
        return res.status(200).json({ success: true, message: "Property deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
