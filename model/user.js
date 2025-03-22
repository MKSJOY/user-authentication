import {query} from '../config/database.js';

export const createUser = async (username, email, hashedPassword) => {
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    try {
      const result = await query(sql, [username, email, hashedPassword]); // Using the query function here
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  };


// Function to get a user by email
export const getUserByEmail = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    try {
        const results = await query(sql, [email]); // Using the query function here
        return results; // If no error, return the results
    } catch (err) {
        console.error('Error fetching user by email:', err); // Log error for debugging
        throw new Error(err.message); // Propagate the error
    }
};