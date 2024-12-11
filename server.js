import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import route from "./routes/userRoute.js";
import setupSwagger from "./config/swaggerConfig.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Swagger setup
setupSwagger(app);

// Database Connection
const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("DB connected successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port : 7000`);
      console.log(`Swagger docs available at http://localhost:7000/api-docs`);
    });
  })
  .catch((error) => console.log(error));

// API Routes
app.use("/api", route);
