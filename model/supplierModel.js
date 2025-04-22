import { query } from "../config/database.js";

export const createSupplier = async (data) => {
  const sql = `INSERT INTO suppliers (
    id, company_id, name, phone, location, nid,
    tin_no, email, brand, product, status, photo_url
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  return await query(sql, Object.values(data));
};

export const getAllSuppliers = async () => {
  return await query(`SELECT * FROM suppliers`);
};

export const getSupplierById = async (id) => {
  const result = await query(`SELECT * FROM suppliers WHERE id = ?`, [id]);
  return result[0];
};

//update
export const updateSupplier = async (id, data) => {
    const {
      name,
      phone,
      location,
      nid,
      tin_no,
      email,
      brand,
      product,
      status,
      photo_url,
    } = data;
  
    const sql = `
      UPDATE suppliers
      SET name = ?, phone = ?, location = ?, nid = ?, tin_no = ?, email = ?, brand = ?, product = ?, status = ?, photo_url = ?
      WHERE id = ?
    `;
  
    const values = [name, phone, location, nid, tin_no, email, brand, product, status, photo_url, id];
  
    return await query(sql, values);
  };

  //delete
export const deleteSupplier = async (id) => {
  return await query(`DELETE FROM suppliers WHERE id = ?`, [id]);
};
