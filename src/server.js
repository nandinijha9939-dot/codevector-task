require("dotenv").config();

const express = require("express");
const prisma = require("./prisma");
const app = express();

app.get("/products", async (req, res) => {
  try {
    const {
      category,
      limit = 20,
      cursorId
    } = req.query;

    const products = await prisma.product.findMany({
      where: category ? { category } : undefined,

      take: Number(limit),

      ...(cursorId && {
        cursor: {
          id: BigInt(cursorId),
        },
        skip: 1,
      }),

      orderBy: [
  {
    updatedAt: "desc",
  },
  {
    id: "desc",
  },
],
    });

    const formattedProducts = products.map((product) => ({
      ...product,
      id: product.id.toString(),
    }));

    const nextCursor =
      products.length > 0
        ? products[products.length - 1].id.toString()
        : null;

    res.json({
      products: formattedProducts,
      nextCursor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/stats", async (req, res) => {
  try {
    const count = await prisma.product.count();

    res.json({
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});