import express from "express"
import { query } from "../config/database.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

// Create a new company
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { name, industry, size, website } = req.body
    const userId = req.user.userId

    // Create company
    const result = await query(
      "INSERT INTO companies (name, industry, size, website, created_by) VALUES (?, ?, ?, ?, ?)",
      [name, industry, size, website, userId],
    )

    // Create user-company relationship (owner)
    await query("INSERT INTO user_companies (user_id, company_id, role) VALUES (?, ?, ?)", [
      userId,
      result.insertId,
      "owner",
    ])

    const company = {
      id: result.insertId,
      name,
      industry,
      size,
      website,
      created_by: userId,
    }

    res.status(201).json({
      message: "Company created successfully",
      company,
    })
  } catch (error) {
    next(error)
  }
})

// Get all companies for current user
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.userId

    const companies = await query(
      `SELECT c.* 
       FROM companies c
       JOIN user_companies uc ON c.id = uc.company_id
       WHERE uc.user_id = ?`,
      [userId],
    )

    res.status(200).json({ companies })
  } catch (error) {
    next(error)
  }
})

// Get company by ID
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const companyId = req.params.id
    const userId = req.user.userId

    // Check if user has access to this company
    const userCompanies = await query("SELECT * FROM user_companies WHERE user_id = ? AND company_id = ?", [
      userId,
      companyId,
    ])

    if (userCompanies.length === 0) {
      return res.status(403).json({ message: "Access denied" })
    }

    const companies = await query("SELECT * FROM companies WHERE id = ?", [companyId])

    if (companies.length === 0) {
      return res.status(404).json({ message: "Company not found" })
    }

    res.status(200).json({ company: companies[0] })
  } catch (error) {
    next(error)
  }
})

// Update company
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const companyId = req.params.id
    const userId = req.user.userId
    const { name, industry, size, website } = req.body

    // Check if user has access to this company
    const userCompanies = await query(
      'SELECT * FROM user_companies WHERE user_id = ? AND company_id = ? AND role = "owner"',
      [userId, companyId],
    )

    if (userCompanies.length === 0) {
      return res.status(403).json({ message: "Access denied" })
    }

    await query("UPDATE companies SET name = ?, industry = ?, size = ?, website = ? WHERE id = ?", [
      name,
      industry,
      size,
      website,
      companyId,
    ])

    res.status(200).json({
      message: "Company updated successfully",
      company: {
        id: companyId,
        name,
        industry,
        size,
        website,
      },
    })
  } catch (error) {
    next(error)
  }
})

export const companyRoutes = router

