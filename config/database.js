import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params); // Executes the query using the pool
    return results;
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  }
};
