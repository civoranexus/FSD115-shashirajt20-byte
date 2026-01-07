const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient({
    datasouuceURL : process.env.DATABASE_URL,
});

module.exports = prisma;