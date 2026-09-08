import express from "express";
import cors from "cors";
import "dotenv/config";
import crypto from "crypto";
import connectDB from "./db.js";
import { createToken, hashPassword, comparePassword } from "./auth.js";

const app = express();

async function startServer() {
  const db = await connectDB();

  console.log("Database: ", db.databaseName);

  app.locals.db = db;
}

startServer();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Kaagazi backend is running!");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Hello from Kaagazi backend!",
  });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const db = app.locals.db;

    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: "customer",
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    const user = {
      _id: result.insertedId,
      ...newUser,
    };

    const token = createToken(user);

    res.status(201).json({
      message: "Customer registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = app.locals.db;

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

app.post("/api/payment", (req, res) => {
  const { amount } = req.body;
  const transactionUuid = Date.now().toString();
  const signatureString = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;
  const signature = crypto
    .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
    .update(signatureString)
    .digest("base64");

  const paymentData = {
    amount: amount,
    tax_amount: 0,
    total_amount: amount,
    transaction_uuid: transactionUuid,
    product_code: process.env.ESEWA_PRODUCT_CODE,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: "http://localhost:5173/payment/success",
    failure_url: "http://localhost:5173/payment/failure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: signature,
  };

  res.json(paymentData);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
