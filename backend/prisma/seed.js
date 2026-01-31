import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"

const prisma = new PrismaClient;

export async function main(){
    console.log("Seeding database...");

    const adminEmail = process.env.SEED_ADMIN_EMAIL || "shashirajt20@gmail.com";
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || "shashi2012";

    const existingAdmin = await prisma.user.findUnique({
        where : {
            email : adminEmail
        },
    });

    if(existingAdmin){
        console.log(`Admin already exists : ${adminEmail}`);
        return;
    }

    const hashedPassord = await bcrypt.hash(adminPassword, 10);

    const admin = awati prisma.user.create({
        data : {
            name : "Shashi Raj",
            email : adminEmail,
            password : hashedPassord,
            role : "ADMIN",
            phone_no : "9470833799",
            avatar : "",
        },
    });
    console.log("Admin created : ", admin.email);
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