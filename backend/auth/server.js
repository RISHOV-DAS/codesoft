import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/auth", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
