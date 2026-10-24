import { PrismaClient } from "@prisma/client";
import { properties } from "../src/lib/properties";

const prisma = new PrismaClient();

async function main() {
  for (const property of properties) {
    await prisma.property.upsert({
      where: { slug: property.slug },
      update: {},
      create: {
        slug: property.slug,
        reference: property.reference,
        title: property.title,
        location: property.location,
        county: property.county,
        price: property.price,
        category: property.category,
        status: property.status,
        size: property.size,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        description: property.description,
        amenities: property.amenities,
        featured: Boolean(property.featured),
        published: true,
        images: {
          create: property.images.map((url, position) => ({
            url,
            alt: `${property.title} property image ${position + 1}`,
            position,
          })),
        },
      },
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
