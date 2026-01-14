import prisma from "../lib/prisma.js";
import { generateToken } from "../utils/token.js";
import bcrypt from "bcrypt";

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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
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
            secure: true, // prod me true
            sameSite: "none"
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


export async function signUp(req, res) {
    try {
        const { name, email, phone_no, avatar, password } = req.body;

        // check if already exists
        const exist = await prisma.user.findUnique({ where: { email } });
        if (exist) {
            return res.json({
                success: false,
                message: "Email already registered"
            });
        }

        const existPhoneNo = await prisma.user.findUnique({ where: { phone_no } });
        if (existPhoneNo) {
            return res.json({
                success: false,
                message: "Phone no. is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, phone_no, avatar, password:hashedPassword }
        });

        const token = generateToken({ id: user.id });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // prod me true
            sameSite: "none"
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


export async function logout(req, res) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true, // prod me true
        sameSite: "none"
      });
  
      return res.json({
        success: true,
        message: "Logout successful"
      });
  
    } catch (error) {
      return res.json({
        success: false,
        message: "Something went wrong"
      });
    }
  }
  