const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const properties = await prisma.property.findMany({
    select: {
      id: true,
      slug: true,
      reference: true,
      title: true,
      images: {
        select: { id: true }
      }
    }
  });

  console.log(JSON.stringify(properties, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
