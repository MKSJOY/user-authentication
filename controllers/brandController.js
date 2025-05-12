import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// CREATE
export const createBrand = async (req, res) => {
  const { company_id, product_id, brand_name } = req.body;
  const id = uuidv4();

  try {
    await query(
      `INSERT INTO brands (id, company_id, product_id, brand_name) VALUES (?, ?, ?, ?)`,
      [id, company_id, product_id, brand_name]
    );
    res.status(201).json({ message: 'Brand created', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
export const getAllBrands = async (req, res) => {
  try {
    const brands = await query(`SELECT * FROM brands`);
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
export const getBrandById = async (req, res) => {
  try {
    const brand = await query(`SELECT * FROM brands WHERE id = ?`, [req.params.id]);
    if (brand.length === 0) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateBrand = async (req, res) => {
  const { product_id, brand_name } = req.body;

  try {
    const result = await query(
      `UPDATE brands SET product_id = ?, brand_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [product_id, brand_name, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Brand not found' });
    res.json({ message: 'Brand updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteBrand = async (req, res) => {
  try {
    const result = await query(`DELETE FROM brands WHERE id = ?`, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Brand not found' });
    res.json({ message: 'Brand deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
