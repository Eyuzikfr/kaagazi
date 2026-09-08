import { MongoClient } from "mongodb";

console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);
const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB connected successfully!");
    return client.db("kaagazi");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

export default connectDB;
