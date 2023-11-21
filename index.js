
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import vetRoutes from "./routes/vetRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());

dotenv.config();

connectDB();

const allowedDomains = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: "http://localhost:5173", 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));



app.use("/api/vets", vetRoutes);
app.use("/api/patients", patientRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});