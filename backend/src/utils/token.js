import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function verifyToken(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone_no: true,
                avatar: true,
            },
        });

        req.user = user;
        next();
    } catch (error) {
        console.log("verifyToken error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
}