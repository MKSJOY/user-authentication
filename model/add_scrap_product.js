import { query } from "../config/database.js";

// Create
export async function addScrapProduct(data) {
    const sql = `
        INSERT INTO scrap_products 
        (scrap_date, project, building_site, product, unit, unit_price, quantity, total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        data.scrap_date,
        data.project,
        data.building_site,
        data.product,
        data.unit,
        data.unit_price,
        data.quantity,
        data.total
    ];
    await query(sql, values);
}

// Read
export async function getAllScrapProducts() {
    const sql = `SELECT * FROM scrap_products ORDER BY created_at DESC`;
    return await query(sql);
}

// Get a single scrap product by ID
export async function getScrapProductById(id) {
    const sql = "SELECT * FROM scrap_products WHERE id = ?";
    const result = await query(sql, [id]);
    return result[0]; // return single object
}

// Delete
export async function deleteScrapProduct(id) {
    const sql = "DELETE FROM scrap_products WHERE id = ?";
    await query(sql, [id]);
}

// Update
export async function updateScrapProduct(id, data) {
    const sql = `
        UPDATE scrap_products 
        SET scrap_date = ?, project = ?, building_site = ?, product = ?, unit = ?, 
            unit_price = ?, quantity = ?, total = ?
        WHERE id = ?
    `;
    const values = [
        data.scrap_date,
        data.project,
        data.building_site,
        data.product,
        data.unit,
        data.unit_price,
        data.quantity,
        data.total,
        id
    ];
    await query(sql, values);
}
