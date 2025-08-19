import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import prisma from "./utils/prisma.js";
import cors from "cors";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Received SIGINT. Closing server and database connections...");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("Server and database connections closed.");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Closing server and database connections...");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("Server and database connections closed.");
    process.exit(0);
  });
});
