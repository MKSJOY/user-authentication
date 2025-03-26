import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../model/user.js';

// Register User
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Check if any field is missing
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the email is already taken
    const results = await getUserByEmail(email); // Await the result from the database
    if (results.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // If email doesn't exist, hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const result = await createUser(username, email, hashedPassword);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Login User
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const results = await getUserByEmail(email); // Fetch the user from DB

    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0]; // Get the user data from DB
    const isMatch = await bcrypt.compare(password, user.password); // Compare password

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Return response with username, email, and token
    return res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err.stack);
    return res.status(500).json({ error: 'Login error', err });
  }
};
