import prisma from "../lib/prisma.js";
import { generateToken } from "../utils/token.js";

export async function signIn(req, res) {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.json({
                success: false,
                message: "Invalid email"
            });
        }
        if (user.password !== password) {
            return res.json({
                success: false,
                message: "Invalid password"
            });
        }
        const token = generateToken({
            id: user.id
        })
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // prod me true
            sameSite: "lax"
        });
        return res.json({
            success: true,
            message: "Login success",
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message ?? "Server error"
        })
    }
}


export async function singUp(req, res) {
    try {
        const { name, email, password } = req.body;

        // check if already exists
        const exist = await prisma.user.findUnique({ where: { email } });
        if (exist) {
            return res.json({
                success: false,
                message: "Email already registered"
            });
        }
        const user = await prisma.user.create({
            data: { name, email, password }
        });

        const token = generateToken({ id: user.id });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // prod me true
            sameSite: "lax"
        });
        return res.json({
            success: true,
            message: "Signup successful"
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message ?? "Server error"
        })
    }
}