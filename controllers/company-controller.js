import { getUsersForCompany, createCompany } from '../model/company.js';

export const handleGetUsersForCompany = async (req, res) => {
  const { companyId } = req.params;

  try {
    const users = await getUsersForCompany(companyId);
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const createCompanyController = async (req, res) => {
  try {
    const { user_id, username, industry, size, website } = req.body;

    // Ensure required data is present
    if (!user_id || !username || !industry || !size || !website || !address) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Insert the new company
    const companySql = "INSERT INTO companies (username, industry, size, website, address, created_by) VALUES (?, ?, ?, ?, ?, ?)";
    const companyParams = [username, industry, size, website, address, user_id];
    const companyResult = await query(companySql, companyParams);

    // Now associate the company with the user in user_companies table
    const userCompanySql = "INSERT INTO user_companies (user_id, company_id, role, status) VALUES (?, ?, ?, ?)";
    const userCompanyParams = [user_id, companyResult.insertId, 'admin', 'active']; // Set the role as admin for now
    await query(userCompanySql, userCompanyParams);

    return res.status(201).json({ success: true, message: 'Company created successfully and associated with user', companyId: companyResult.insertId });
  } catch (error) {
    console.error('Error in createCompanyController:', error);
    res.status(500).json({ success: false, message: 'Failed to create company', error: error.message });
  }
};
