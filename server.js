import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import mainRouter from "./routes/index.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", mainRouter);
connectDB();

// Basic Base Route for Testing
// app.get('/', (req, res) => {
//   res.status(200).json({ message: "Welcome to Zabatet API Platform" });
// });

// Start listening for requests
app.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}`);
});