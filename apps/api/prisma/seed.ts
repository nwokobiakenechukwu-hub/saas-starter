import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("changeme123", 10);

  const user = await prisma.user.upsert({
    where: { email: "founder@example.com" },
    update: {},
    create: {
      email: "founder@example.com",
      passwordHash,
      name: "Founder",
      memberships: {
        create: {
          role: "OWNER",
          org: { create: { name: "Acme Inc." } }
        }
      }
    }
  });

  // 2) (Optional) seed an “admin” test user
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash,
      name: "Admin Tester",
    },
  });

  console.log("✅ Seeded user:", user.email);
}

main().finally(() => prisma.$disconnect());
