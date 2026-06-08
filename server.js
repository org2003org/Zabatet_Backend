import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import mainRouter from "./routes/index.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", mainRouter);
connectDB();
app.use(notFoundHandler);
app.use(errorHandler);
// Basic Base Route for Testing
// app.get('/', (req, res) => {
//   res.status(200).json({ message: "Welcome to Zabatet API Platform" });
// });

// Start listening for requests
app.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}`);
});