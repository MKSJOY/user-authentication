import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.js";
//import { companyRoutes } from "./routes/company.js";
import { projectRoutes } from "./routes/project.js";  // New project routes
import errorHandler from "./middleware/errorHandler.js";  // Error handling middleware
import { authMiddleware } from "./middleware/authMiddleware.js";  // Import the correct middleware
import { buildRoutes } from "./routes/build-site.js"; // build-site routes
import { clientRoutes } from "./routes/register-client.js"; // client routes
import { companyRoutes } from "./routes/company-userID.js"; // get companies by userID
import { projectTypeRoutes } from "./routes/projectType.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());// Middleware to parse JSON data
app.use(express.urlencoded({ extended: true }));// Middleware to parse URL-encoded data (form data)
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);  // Authentication routes (register/login)
//app.use("/api/companies", companyRoutes);  // Company routes (if required)
app.use("/api/project", authMiddleware, projectRoutes);  // Project routes (protected)
app.use("/api/building", authMiddleware, buildRoutes); // Building routes (protected)
app.use("/api/client", authMiddleware, clientRoutes);
app.use("/api/companies", authMiddleware, companyRoutes);

app.use("/api/project-type", projectTypeRoutes); // Project type routes

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
