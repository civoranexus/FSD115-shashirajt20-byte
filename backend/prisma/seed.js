import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import "dotenv/config"

const prisma = new PrismaClient;

export async function main() {
    console.log("Seeding database...");

    const adminEmail = process.env.SEED_ADMIN_EMAIL || "shashirajt20@gmail.com";
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || "shashi2012";

    const existingAdmin = await prisma.user.findUnique({
        where: {
            email: adminEmail
        },
    });

    if (existingAdmin) {
        console.log(`Admin already exists : ${adminEmail}`);
        // return;
    } else {



        const hashedPassord = await bcrypt.hash(adminPassword, 10);

        const admin = await prisma.user.create({
            data: {
                name: "Shashi Raj",
                email: adminEmail,
                password: hashedPassord,
                role: "ADMIN",
                phone_no: "9470833799",
                avatar: "",
            },
        });
        console.log("Admin created : ", admin.email);
    }
    await prisma.category.createMany({
        data: [
            { category_name: "Cattle" },
            { category_name: "Buffalo" },
            { category_name: "Cow" },
            { category_name: "Accessories" },
            { category_name: "Feed & Supplements" },
        ],
        skipDuplicates: true,
    });
    console.log("Categories seeded");

    await prisma.breed.createMany({
        data: [
            { breed_name: "Gir" },
            { breed_name: "Sahiwal" },
            { breed_name: "Jersey" },
            { breed_name: "Holstein Friesian" },
            { breed_name: "Red Sindhi" },
            { breed_name: "Murrah" }, // buffalo breed
        ],
        skipDuplicates: true,
    });
    console.log("Breeds seeded");

    await prisma.milkcapacity.createMany({
        data: [{ capacity: 5 }, { capacity: 8 }, { capacity: 12 }, { capacity: 20 }],
        skipDuplicates: true,
    });
    console.log("Milk capacities seeded");

    console.log("Seeding finished successfully!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log("Seeding finished");
    })
    .catch(async (e) => {
        console.error("Seeding error:", e);
        await prisma.$disconnect();
        process.exit(1);
    });