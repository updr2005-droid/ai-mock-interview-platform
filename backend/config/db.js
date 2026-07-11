const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("🔄 Starting MongoDB connection...");

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
    });

    console.log("✅ MongoDB Connected Successfully");
    console.log("Host:", conn.connection.host);

  } catch (error) {
    console.error("❌ MongoDB Connection Error:");
    console.error(error);
  }
};

module.exports = connectDB;