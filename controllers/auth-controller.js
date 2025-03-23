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
    //console.log('Fetching user from DB...');
    const results = await getUserByEmail(email); // Fetch the user from DB
    //console.log('User fetched from DB:', results);

    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0]; // Get the user data from DB
    //console.log('Comparing password...');
    const isMatch = await bcrypt.compare(password, user.password); // Compare password
    //console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ message: "Logged in successfully", token });
  } catch (err) {
    console.error('Login error:', err.stack);
    return res.status(500).json({ error: 'Login error', err });
  }
};
