const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  const file = "./makao-properties-export.json";

  if (!fs.existsSync(file)) {
    throw new Error(`Export file not found: ${file}`);
  }

  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  const properties = Array.isArray(parsed) ? parsed : parsed.properties;

  if (!Array.isArray(properties) || properties.length !== 6) {
    throw new Error(`Expected 6 properties; found ${
      Array.isArray(properties) ? properties.length : "invalid data"
    }. Import cancelled.`);
  }

  const existingProperties = await prisma.property.count();
  const existingImages = await prisma.propertyImage.count();

  console.log("Neon properties:", existingProperties);
  console.log("Neon images:", existingImages);
  console.log("Properties to import:", properties.length);
  console.log(
    "Images to import:",
    properties.reduce((total, p) => total + (p.images?.length || 0), 0)
  );

  if (existingProperties !== 0 || existingImages !== 0) {
    throw new Error("Database is not empty. Import cancelled to prevent duplicates.");
  }

  for (const p of properties) {
    const { images, enquiries, ...propertyData } = p;

    await prisma.property.create({
      data: {
        ...propertyData,
        images: {
          create: (images || []).map(({ id, url, alt, position }) => ({
            id,
            url,
            alt,
            position
          }))
        }
      }
    });

    console.log(`Imported: ${p.title} (${images?.length || 0} images)`);
  }

  console.log("Import completed.");
  console.log("Final properties:", await prisma.property.count());
  console.log("Final images:", await prisma.propertyImage.count());
}

main()
  .catch((error) => {
    console.error("IMPORT FAILED:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
