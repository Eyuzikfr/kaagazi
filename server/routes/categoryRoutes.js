import express from "express";
import {
  authenticateToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;

    const categories = await db.collection("categories").find({}).toArray();

    res.json(categories);
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const db = req.app.locals.db;

    const existingCategory = await db
      .collection("categories")
      .findOne({ name });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const newCategory = {
      name,
      description: description || "",
      createdAt: new Date(),
    };

    const result = await db.collection("categories").insertOne(newCategory);

    res.status(201).json({
      message: "Category created successfully",
      category: {
        _id: result.insertedId,
        ...newCategory,
      },
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Categoyr name is required",
      });
    }

    const db = req.app.locals.db;

    const result = await db.collection("categories").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          description: description || "",
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(400).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const db = req.app.locals.db;

    const result = await db.collection("categories").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deleteCount === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.erorr("DELETE CATEGORY ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
