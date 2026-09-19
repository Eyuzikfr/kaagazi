import express from "express";
import { ObjectId } from "mongodb";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;

    const wishlist = await db.collection("wishlists").findOne({
      userId: new ObjectId(req.user.id),
    });

    res.json(
      wishlist || {
        userId: req.user.id,
        items: [],
      },
    );
  } catch (error) {
    console.error("GET WISHLIST ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const db = req.app.locals.db;

    const product = await db.collection("products").findOne({
      _id: new ObjectId(productId),
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const userId = new ObjectId(req.user.id);

    const wishlist = await db.collection("wishlists").findOne({
      userId,
    });

    if (!wishlist) {
      await db.collection("wishlists").insertOne({
        userId,
        items: [
          {
            productId: product._id,
          },
        ],
      });

      return res.status(201).json({
        message: "Item added to wishlist",
      });
    }

    const alreadyExists = wishlist.items.some(
      (item) => item.productId.toString() === productId,
    );

    if (alreadyExists) {
      return res.status(200).json({
        message: "Item already in wishlist",
      });
    }

    await db.collection("wishlists").updateOne(
      { userId },
      {
        $push: {
          items: {
            productId: product._id,
          },
        },
      },
    );

    res.status(201).json({
      message: "Item added to wishlist",
    });
  } catch (error) {
    console.error("ADD TO WISHLIST ERROR:", error);

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

    await db.collection("wishlists").updateOne(
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
      message: "Item removed from wishlist",
    });
  } catch (error) {
    console.error("REMOVE FROM WISHLIST ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
