import { pool } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

// Create
export const createBuildingProduct = async (productData) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { project_id, building_id, project_type_id, floors } = productData;
    const productId = uuidv4();

    await connection.query(
      `INSERT INTO building_products (id, project_id, building_id, project_type_id) VALUES (?, ?, ?, ?)`,
      [productId, project_id, building_id, project_type_id]
    );

    for (const floor of floors || []) {
      const floorId = uuidv4();

      await connection.query(
        `INSERT INTO product_floors (id, product_id, floor_number) VALUES (?, ?, ?)`,
        [floorId, productId, floor.floor_number]
      );

      for (const unit of floor.units || []) {
        await connection.query(
          `INSERT INTO floor_units (id, floor_id, unit_name, size, facing) VALUES (?, ?, ?, ?, ?)`,
          [uuidv4(), floorId, unit.unit_name, unit.size, unit.facing]
        );
      }
    }

    await connection.commit();
    return { success: true, productId };
  } catch (error) {
    await connection.rollback();
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
};

// Read All
export const getAllBuildingProducts = async () => {
  const [products] = await pool.query("SELECT * FROM building_products");

  for (const product of products) {
    const [floors] = await pool.query("SELECT * FROM product_floors WHERE product_id = ?", [product.id]);

    for (const floor of floors) {
      const [units] = await pool.query("SELECT * FROM floor_units WHERE floor_id = ?", [floor.id]);
      floor.units = units;
    }

    product.floors = floors;
  }

  return products;
};

// Read One
export const getBuildingProductById = async (id) => {
  const [results] = await pool.query("SELECT * FROM building_products WHERE id = ?", [id]);

  if (!results.length) return null;
  const product = results[0];

  const [floors] = await pool.query("SELECT * FROM product_floors WHERE product_id = ?", [id]);

  for (const floor of floors) {
    const [units] = await pool.query("SELECT * FROM floor_units WHERE floor_id = ?", [floor.id]);
    floor.units = units;
  }

  product.floors = floors;
  return product;
};
      // Update
export const updateBuildingProduct = async (id, productData) => {
    const { project_id, building_id, project_type_id, floors } = productData;
  
    const connection = await pool.getConnection();
  
    try {
      await connection.beginTransaction();
  
      // Update main product data
      await connection.query(
        "UPDATE building_products SET project_id = ?, building_id = ?, project_type_id = ? WHERE id = ?",
        [project_id, building_id, project_type_id, id]
      );
  
      // Loop through floors
      for (const floor of floors) {
        // Ensure floor id is included to update the existing floor
        if (floor.id) {
          await connection.query(
            "UPDATE product_floors SET floor_number = ? WHERE id = ?",
            [floor.floor_number, floor.id]
          );
        } else {
          // If no floor id is given, insert a new floor
          const floorId = uuidv4();
          await connection.query(
            "INSERT INTO product_floors (id, product_id, floor_number) VALUES (?, ?, ?)",
            [floorId, id, floor.floor_number]
          );
          floor.id = floorId; // Assign new ID to the floor
        }
  
        // Loop through units
        for (const unit of floor.units) {
          // Ensure unit id is included to update the existing unit
          if (unit.id) {
            await connection.query(
              "UPDATE floor_units SET unit_name = ?, size = ?, facing = ? WHERE id = ?",
              [unit.unit_name, unit.size, unit.facing, unit.id]
            );
          } else {
            // If no unit id is given, insert a new unit
            const unitId = uuidv4();
            await connection.query(
              "INSERT INTO floor_units (id, floor_id, unit_name, size, facing) VALUES (?, ?, ?, ?, ?)",
              [unitId, floor.id, unit.unit_name, unit.size, unit.facing]
            );
            unit.id = unitId; // Assign new ID to the unit
          }
        }
      }
  
      await connection.commit();
      return { success: true, message: "Building product updated successfully" };
    } catch (error) {
      await connection.rollback();
      return { success: false, error: error.message };
    } finally {
      connection.release();
    }
  };

// Delete
export const deleteBuildingProduct = async (id) => {
  await pool.query("DELETE FROM floor_units WHERE floor_id IN (SELECT id FROM product_floors WHERE product_id = ?)", [id]);
  await pool.query("DELETE FROM product_floors WHERE product_id = ?", [id]);
  await pool.query("DELETE FROM building_products WHERE id = ?", [id]);

  return { success: true };
};
