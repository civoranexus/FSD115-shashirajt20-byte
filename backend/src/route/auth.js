import express from "express";
import { logout, signIn, signUp } from "../actions/action.js";
import { verifyToken } from "../utils/token.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/logout", logout);

router.get("/me", verifyToken, (req, res)=>{
    res.json({
        success : true, 
        user : req.user
    })
})

export default router;