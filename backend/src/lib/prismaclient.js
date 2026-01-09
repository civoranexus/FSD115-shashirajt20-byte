// // import PrismaClient from "@prisma/client"
// import pkg from "@prisma/client"
// const {PrismaClient} = pkg;

// const prisma = new PrismaClient({
//     datasourceUrl : process.env.DATABASE_URL,
// });

// export default prisma;

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default prisma;



import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config(); // Make sure .env is loaded

// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: process.env.DATABASE_URL,
//     },
//   },
// });

// export default prisma;


// export default const prisma = new PrismaClient();

const prisma = new PrismaClient();
export default prisma;