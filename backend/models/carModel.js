import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  id:             { type: Number, required: true, unique: true },
  name:           { type: String, required: true },
  type:           { type: String, enum: ["Electric", "Hybrid", "Petrol", "Diesel"], required: true },
  year:           { type: Number, required: true },
  vehicleClass:   { type: String, required: true },
  efficiency:     { type: Number, required: true },   // km/l or km/kWh
  price:          { type: String, required: true },
  safetyRating:   { type: String, required: true },
  image:          { type: String, required: true },   // relative path under src/assets/

  // Electric only
  range:          { type: String, default: null },

  // Diesel only
  engine:         { type: String, default: null },

  // Computed by seed script via TOPSIS
  ecoScore:       { type: Number, required: true },
  annualCO2:      { type: Number, required: true },
}, { timestamps: true });

const Car = mongoose.model("Car", carSchema);
export default Car;