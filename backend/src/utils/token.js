import jwt from "jsonwebtoken";

export function generateToken(payload){
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"});
}

export function verifyToken(req, res, next){
    const token = req.cookies?.token;
    if(!token){
        return res.status(401).json({
            success : false, 
            message : "Unauthorized"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success : false,
            message : "Invalid token"
        });
    }
}