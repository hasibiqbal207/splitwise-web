import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "../config/database.config.js";
import routes from "./routes/index.js";

import swaggerDocs from "../config/swagger.config.js";
import morganMiddleware from "./middlewares/logger.middleware.js";

dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:4002', 'http://0.0.0.0:4002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

const port: number = parseInt(process.env.PORT ?? "3000", 10);

//parse json request url
app.use(express.json());

// morgan middleware for logging
app.use(morganMiddleware);

//api v1 routes
app.use("/splitwiseBE/api/v1", routes);

app.get("/splitwiseBE/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, '0.0.0.0',() => {
  console.log(`Server is running on http://localhost:${port}`);
  swaggerDocs(app, port);
});