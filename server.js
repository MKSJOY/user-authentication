import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.js";
import { projectRoutes } from "./routes/project.js";
import errorHandler from "./middleware/errorHandler.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { buildRoutes } from "./routes/build-site.js";
import { clientRoutes } from "./routes/register-client.js";
import { companyRoutes } from "./routes/company-userID.js";
import { getBuildingRoutes } from "./routes/getBuildingsByProjectName.js";
import { stageRoutes } from "./routes/stage-routes.js";

dotenv.config(); // Load .env variables at the top

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware 
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data (form data)
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/project", authMiddleware, projectRoutes);
app.use("/api/building", authMiddleware, buildRoutes);
app.use("/api/client", authMiddleware, clientRoutes);
app.use("/api/companies", authMiddleware, companyRoutes);
app.use("/api/buildings-project", authMiddleware, getBuildingRoutes);
app.use("/api/stages", authMiddleware, stageRoutes);


// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
