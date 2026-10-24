const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  const properties = await prisma.property.findMany({
    include: { images: true },
    orderBy: { reference: "desc" }
  });

  const output = {
    exportedAt: new Date().toISOString(),
    properties
  };

  fs.writeFileSync(
    "makao-properties-export.json",
    JSON.stringify(output, null, 2),
    "utf8"
  );

  console.log(`Exported ${properties.length} properties.`);
  console.log(
    `Exported ${properties.reduce((n, p) => n + p.images.length, 0)} images.`
  );
  console.log("File: makao-properties-export.json");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
