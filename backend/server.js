import express      from "express";
import mongoose     from "mongoose";
import cors         from "cors";
import dotenv       from "dotenv";
import calculatorRoutes from "./routes/calculatorRoutes.js";
import carRoutes        from "./routes/carRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/calculator", calculatorRoutes);
app.use("/api/cars",       carRoutes);

// DB + Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error("❌ DB connection failed:", err));

export default app;