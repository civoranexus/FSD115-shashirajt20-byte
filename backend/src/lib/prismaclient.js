// import PrismaClient from "@prisma/client"
import pkg from "@prisma/client"
const {PrismaClient} = pkg;

const prisma = new PrismaClient({
    datasouuceURL : process.env.DATABASE_URL,
});

export default prisma;