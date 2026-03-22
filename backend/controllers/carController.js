import Car from "../models/carModel.js";

// GET /api/cars
// Query params: type (Electric | Hybrid | Petrol | Diesel)
export const getCars = async (req, res) => {
  try {
    const { type } = req.query;

    const filter = type && type !== "All" ? { type } : {};

    const cars = await Car.find(filter).sort({ ecoScore: -1 }).select("-__v");

    res.json({ count: cars.length, cars });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/cars/:id
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findOne({ id: Number(req.params.id) }).select("-__v");

    if (!car) return res.status(404).json({ message: "Car not found" });

    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};