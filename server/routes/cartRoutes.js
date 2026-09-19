import express from "express";
import { ObjectId } from "mongodb";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;

    const cart = await db.collection("carts").findOne({
      userId: new ObjectId(req.user.id),
    });

    res.json(cart || { userId: req.user.id, items: [] });
  } catch (error) {
    console.error("GET CART ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Invalid quantity",
      });
    }

    const db = req.app.locals.db;

    const product = await db.collection("products").findOne({
      _id: new ObjectId(productId),
    });

    if (!product) {
      return res.status(400).json({
        message: "Product onot found",
      });
    }

    const userId = new ObjectId(req.user.id);

    const cart = await db.collection("carts").findOne({
      userId,
    });

    if (!cart) {
      await db.collection("carts").insertOne({
        userId,
        items: [
          {
            productId: product._id,
            quantity,
          },
        ],
      });

      return res.status(201).json({
        message: "Item added to cart",
      });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      await db.collection("carts").updateOne(
        {
          userId,
          "items.productId": product._id,
        },
        {
          $inc: {
            "items.$.quantity": quantity,
          },
        },
      );
    } else {
      await db.collection("carts").updateOne(
        { userId },
        {
          $push: {
            items: {
              productId: product._id,
              quantity,
            },
          },
        },
      );
    }

    res.status(201).json({
      message: "Item added to cart",
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.delete("/:productId", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const db = req.app.locals.db;

    await db.collection("carts").updateOne(
      {
        userId: new ObjectId(req.user.id),
      },
      {
        $pull: {
          items: {
            productId: new ObjectId(productId),
          },
        },
      },
    );

    res.json({
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("REMOVE FROM CART ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
