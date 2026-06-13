import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import mainRouter from "./routes/index.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
dotenv.config();

const app = express();
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://zabatet.onrender.com',
      process.env.FrontEndUrl
    ].filter(Boolean);
    if (!origin || allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
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