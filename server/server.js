import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();

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
