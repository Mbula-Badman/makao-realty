const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = "makaorealty@gmail.com";

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true }
  });

  if (!user) {
    throw new Error(`Account not found: ${email}`);
  }

  if (user.role === "ADMIN") {
    console.log(`${email} is already an ADMIN.`);
    return;
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
    select: { name: true, email: true, role: true }
  });

  console.log("Account updated successfully:");
  console.table([updated]);
}

main()
  .catch(error => {
    console.error("FAILED:", error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
