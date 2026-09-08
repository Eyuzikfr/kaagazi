import express from "express";
import { ObjectId } from "mongodb";
import {
  authenticateToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE product
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, author, description, price, categoryId } = req.body;

    if (!title || !author || !price || !categoryId) {
      return res.status(400).json({
        message: "Title, author, price and category are required",
      });
    }

    const db = req.app.locals.db;

    const category = await db.collection("categories").findOne({
      _id: new ObjectId(categoryId),
    });

    if (!category) {
      return res.status(400).json({
        message: "Category not found",
      });
    }

    const newProduct = {
      title,
      author,
      description: description || "",
      price,
      categoryId: new ObjectId(categoryId),
      createdAt: new Date(),
    };

    const result = await db.collection("products").insertOne(newProduct);

    res.status(201).json({
      message: "Product created successfully",
      product: {
        _id: result.insertedId,
        ...newProduct,
      },
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// RETRIEVE products
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;

    const products = await db.collection("products").find({}).toArray();

    res.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// UPDATE product
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, price, categoryId } = req.body;

    if (!title || !author || !price || !categoryId) {
      return res.status(400).json({
        message: "Title, author, price and category are required",
      });
    }

    const db = req.app.locals.db;

    const category = await db.collection("categories").findOne({
      _id: new ObjectId(categoryId),
    });

    if (!category) {
      return res.status(400).json({
        message: "Category not found",
      });
    }

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          author,
          description: description || "",
          price,
          categoryId: new ObjectId(categoryId),
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// DELETE product
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const db = req.app.locals.db;

    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deleteCount === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
