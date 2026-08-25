
import dns from "node:dns";
import mongoose from "mongoose";

export async function db_connect() {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (e) {
      // ignore if setServers fails
    }

    await mongoose.connect(process.env.DATABASE_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
