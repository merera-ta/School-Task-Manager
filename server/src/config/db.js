const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set.");
  }

  let attempt = 0;

  while (true) {
    try {
      attempt++;

      console.log(`MongoDB connection attempt: ${attempt}`);

      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });

      console.log(`MongoDB connected: ${mongoose.connection.name}`);

      return;
    } catch (error) {
      console.error("MongoDB connection failed:", error.message);

      const delay = Math.min(attempt * 3000, 15000);

      console.log(`Retrying in ${delay / 1000} seconds...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectDB;
