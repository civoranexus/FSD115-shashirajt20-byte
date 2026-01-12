import express from "express";
import { signIn, singUp } from "../controllers/auth.contollers.js";


const router = express.Router();
router.post("/signin", signIn);
router.post("/signup", singUp);

export default router;