import { query } from '../config/database.js';

// Create a new company and return the insertId
export const createCompany = async (name, industry, size, website, address, createdBy) => {
  const sql = `
    INSERT INTO companies (name, industry, size, website, address, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    const result = await query(sql, [name, industry, size, website, address, createdBy]);
    return result.insertId;
  } catch (err) {
    throw new Error('Failed to create company: ' + err.message);
  }
};

// Assign user to company (admin, manager, viewer)
export const assignUserToCompany = async (userId, companyId, role = 'admin', status = 'active') => {
  const sql = `
    INSERT INTO user_companies (user_id, company_id, role, status)
    VALUES (?, ?, ?, ?)
  `;
  try {
    await query(sql, [userId, companyId, role, status]);
    return true;
  } catch (err) {
    throw new Error('Failed to assign user to company: ' + err.message);
  }
};

// Get a single company by its ID
export const getCompanyById = async (companyId) => {
  const sql = `SELECT * FROM companies WHERE id = ?`;
  try {
    const results = await query(sql, [companyId]);
    return results[0] || null;
  } catch (err) {
    throw new Error('Failed to fetch company: ' + err.message);
  }
};

// Get all companies a user is part of
export const getCompaniesForUser = async (userId) => {
  const sql = `
    SELECT c.*
    FROM companies c
    INNER JOIN user_companies uc ON c.id = uc.company_id
    WHERE uc.user_id = ?
  `;
  try {
    const results = await query(sql, [userId]);
    return results;
  } catch (err) {
    throw new Error('Failed to fetch user companies: ' + err.message);
  }
};

// Get all users who are part of a specific company (using companyId)
export const getUsersForCompany = async (companyId) => {
  const sql = `
    SELECT u.id, u.username, u.email, uc.role, uc.status
    FROM users u
    INNER JOIN user_companies uc ON u.id = uc.user_id
    WHERE uc.company_id = ?
  `;
  try {
    const results = await query(sql, [companyId]);
    return results;
  } catch (err) {
    throw new Error('Failed to fetch users for company: ' + err.message);
  }
};
