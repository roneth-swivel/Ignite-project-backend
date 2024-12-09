import express from "express";
import cors from "cors"; // Import CORS package
import userRoutes from "./routes/userRoutes.js"; // Assuming this is your route file

const app = express();

// Enable CORS for all routes (you can restrict it to specific origins)

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Use the user routes under the "/api" path
app.use("/api", userRoutes);

// Start the server
app.listen(8000, () => {
  console.log("Server is running on port 7000");
});
