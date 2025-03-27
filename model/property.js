import { query } from '../config/database.js';
//import fs from 'fs'; // For file deletion

// Create Property
export const createProperty = async (data) => {
  const {
    land_property_name,
    land_property_id,
    upazila,
    district,
    mouza_number,
    survey_category,
    khatian_number,
    cs_khatian,
    rs_khatian,
    sa_khatian,
    bs_khatian,
    mutation_khatian,
    city_survey_khatian,
    survey_location,
    additional_documents,
    owner_name,
    phone_number,
    present_address,
    nid,
    nid_file,
    owner_photo,
    tin_number,
    tin_file,
    land_area,
    unit,
    note,
    reminder
  } = data;

  const sql = `
    INSERT INTO properties 
    (land_property_name, land_property_id, upazila, district, mouza_number, survey_category, khatian_number, 
    cs_khatian, rs_khatian, sa_khatian, bs_khatian, mutation_khatian, city_survey_khatian, survey_location, 
    additional_documents, owner_name, phone_number, present_address, nid, nid_file, owner_photo, 
    tin_number, tin_file, land_area, unit, note, reminder) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    land_property_name, land_property_id, upazila, district, mouza_number,
    survey_category, khatian_number, cs_khatian, rs_khatian, sa_khatian,
    bs_khatian, mutation_khatian, city_survey_khatian, survey_location,
    JSON.stringify(additional_documents || []), // Convert JSON array to string
    owner_name, phone_number, present_address, nid, nid_file,
    owner_photo, tin_number, tin_file, land_area, unit, note, reminder
  ];

  try {
    await query(sql, values); // Execute the query
    return { status: 200, message: 'Added successfully' }; // Return only success message
  } catch (err) {
    console.error('Error creating property:', err); // Log the error for debugging
    return { status: 500, message: 'Internal Server Error', error: err.message }; // Propagate the error
  }
  
};

// Get All Properties
export const getAllProperties = async () => {
  const sql = 'SELECT * FROM properties';
  
  try {
    const result = await query(sql); // Fetch all properties from the database
    return {
      status: 200,
      properties: result.map(property => ({
        ...property,
        additional_documents: JSON.parse(property.additional_documents || '[]') // Parse the additional_documents JSON string
      }))
    };
  } catch (err) {
    console.error('Error fetching properties:', err); // Log error for debugging
    return { status: 500, message: 'Error fetching properties', error: err.message };
  }
};

// Get Property By ID
export const getPropertyById = async (id) => {
  const sql = 'SELECT * FROM properties WHERE id = ?';
  
  try {
    const result = await query(sql, [id]); // Fetch property by ID
    if (result.length > 0) {
      result[0].additional_documents = JSON.parse(result[0].additional_documents || '[]'); // Parse the additional_documents JSON string
    }
    return { status: 200, property: result[0] };
  } catch (err) {
    console.error('Error fetching property by ID:', err); // Log error for debugging
    return { status: 500, message: 'Error fetching property by ID', error: err.message };
  }
};

export const updateProperty = async (id, data) => {
  const {
    land_property_name,
    land_property_id,
    upazila,
    district,
    mouza_number,
    survey_category,
    khatian_number,
    cs_khatian,
    rs_khatian,
    sa_khatian,
    bs_khatian,
    mutation_khatian,
    city_survey_khatian,
    survey_location,
    additional_documents,
    owner_name,
    phone_number,
    present_address,
    nid,
    nid_file,
    owner_photo,
    tin_number,
    tin_file,
    land_area,
    unit,
    note,
    reminder
  } = data;

  const sql = `
    UPDATE properties SET 
      land_property_name = ?, land_property_id = ?, upazila = ?, district = ?, mouza_number = ?, 
      survey_category = ?, khatian_number = ?, cs_khatian = ?, rs_khatian = ?, sa_khatian = ?, 
      bs_khatian = ?, mutation_khatian = ?, city_survey_khatian = ?, survey_location = ?, 
      additional_documents = ?, owner_name = ?, phone_number = ?, present_address = ?, nid = ?, 
      nid_file = ?, owner_photo = ?, tin_number = ?, tin_file = ?, land_area = ?, unit = ?, note = ?, 
      reminder = ? WHERE id = ?
  `;

  const values = [
    land_property_name, land_property_id, upazila, district, mouza_number,
    survey_category, khatian_number, cs_khatian, rs_khatian, sa_khatian,
    bs_khatian, mutation_khatian, city_survey_khatian, survey_location,
    JSON.stringify(additional_documents || []),  // Convert JSON array to string
    owner_name, phone_number, present_address, nid, nid_file,
    owner_photo, tin_number, tin_file, land_area, unit, note, reminder, id
  ];

  try {
    const updateResult = await query(sql, values); // Execute the update query

    if (updateResult.affectedRows === 0) {
      return { status: 404, message: 'Property not found or not updated' };
    }

    // Fetch the updated property
    const [updatedProperty] = await query(`SELECT * FROM properties WHERE id = ?`, [id]);

    return {
      status: 200,
      message: 'Updated successfully',
      updatedProperty
    };
  } catch (err) {
    console.error('Error updating property:', err);
    return { status: 500, message: 'Error updating property', error: err.message };
  }
};


// Delete Property
export const deleteProperty = async (id) => {
  const sql = 'DELETE FROM properties WHERE id = ?';
  
  try {
    const result = await query(sql, [id]); // Execute the delete query
    return { status: 200, message: 'Deleted successfully', result }; // Return success message and result
  } catch (err) {
    console.error('Error deleting property:', err); // Log error for debugging
    return { status: 500, message: 'Error deleting property', error: err.message };
  }
};
