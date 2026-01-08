import express from "express";
import prisma from "../../src/lib/prismaclient.js";


const router = express.Router;

router.post("/", async(req, res)=>{
    try {
        const {name, email, phone, password, role, address} = req.body;
        const user = await prisma.user.create({
            data : {name, email, phone, password, role, address}
        })
        return res.json({
            success : true,
            message : "User created successfully!",
            data : user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "Internal error!"
        })
    }
});

router.get("/", async (req, res)=>{
    const users = await prisma.user.findMany();
    res.json(users);
});

export default router;