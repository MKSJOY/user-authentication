import jwt from "jsonwebtoken";
import { getAllProjects } from "../../controllers/project-controller.js";
import { getProjectById } from "../../controllers/project-controller.js";
import { createProject } from "../../controllers/project-controller.js";
import { updateProject } from "../../controllers/project-controller.js";
import { deleteProject } from "../../controllers/project-controller.js";

// Secret key for JWT (ensure to store this in env variables)
const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret_key";

// Function to verify JWT token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(new Error("Invalid or expired token"));
      } else {
        resolve(decoded);  // Return the decoded token (user info)
      }
    });
  });
};

export default async function handler(req, res) {
  // Verify the JWT token before handling the request
  const token = req.headers.authorization?.split(" ")[1]; // 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, token required" });
  }

  try {
    // Verify the token and get the user information
    const decoded = await verifyToken(token);
    req.user = decoded;  // Attach user info (e.g., user ID) to the request object for use in controllers
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // Handle different HTTP methods for project management
  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      // Handle GET request for a single project by ID
      await getProjectById(req, res);
    } else {
      // Handle GET request for all projects
      await getAllProjects(req, res);
    }
  } else if (req.method === "POST") {
    // Handle POST request to create a new project
    await createProject(req, res);
  } else if (req.method === "PUT") {
    const { id } = req.query;
    if (id) {
      // Handle PUT request to update an existing project
      await updateProject(req, res);
    } else {
      res.status(400).json({ message: "Project ID is required for update" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (id) {
      // Handle DELETE request to delete a project by ID
      await deleteProject(req, res);
    } else {
      res.status(400).json({ message: "Project ID is required for deletion" });
    }
  } else {
    // Method not allowed
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
