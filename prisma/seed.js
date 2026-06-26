const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  "Electronics",
  "Books",
  "Fashion",
  "Sports",
  "Furniture",
];

function randomPrice() {
  return Number((Math.random() * 1000 + 10).toFixed(2));
}

function randomDateWithinLastYear() {
  const now = Date.now();
  const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;

  return new Date(
    oneYearAgo + Math.random() * (now - oneYearAgo)
  );
}

async function main() {
  console.log("Deleting old products...");

  await prisma.product.deleteMany();

  const TOTAL_PRODUCTS = 200000; // Change to 200000 later
  const BATCH_SIZE = 1000;

  console.log(`Generating ${TOTAL_PRODUCTS} products...`);

  for (let start = 0; start < TOTAL_PRODUCTS; start += BATCH_SIZE) {
    const products = [];

    for (
      let i = start + 1;
      i <= Math.min(start + BATCH_SIZE, TOTAL_PRODUCTS);
      i++
    ) {
      const createdAt = randomDateWithinLastYear();

      const updatedAt = new Date(
        createdAt.getTime() +
          Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      );

      products.push({
        name: `Product ${i}`,
        category:
          categories[
            Math.floor(Math.random() * categories.length)
          ],
        price: randomPrice(),
        createdAt,
        updatedAt,
      });
    }

    await prisma.product.createMany({
      data: products,
    });

    console.log(
      `Inserted ${Math.min(
        start + BATCH_SIZE,
        TOTAL_PRODUCTS
      )}/${TOTAL_PRODUCTS}`
    );
  }

  console.log("Seeding completed!");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });