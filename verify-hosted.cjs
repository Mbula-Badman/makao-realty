const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Properties:", await prisma.property.count());
  console.log("Images:", await prisma.propertyImage.count());
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
