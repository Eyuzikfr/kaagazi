import express from "express";
import { ObjectId } from "mongodb";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;

    console.log("ORDER ITEMS:", items);
    console.log("PRODUCT ID:", items[0].productId);
    console.log("IS VALID:", ObjectId.isValid(items[0].productId));

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item",
      });
    }

    const db = req.app.locals.db;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!ObjectId.isValid(item.productId)) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }

      const product = await db.collection("products").findOne({
        _id: new ObjectId(item.productId),
      });

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const quantity = item.quantity;

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          message: "Invalid quantity",
        });
      }

      const subtotal = product.price * quantity;

      totalAmount += subtotal;

      orderItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity,
        subtotal,
      });
    }

    const order = {
      userId: new ObjectId(req.user.id),
      items: orderItems,
      totalAmount,
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(order);

    res.status(201).json({
      message: "Order created successfully",
      orderId: result.insertedId,
      totalAmount,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
