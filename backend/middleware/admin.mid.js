import jwt from 'jsonwebtoken';
import config from "../config.js";

const adminMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token, authorization denied" })
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, config.JWT_ADMIN_PASSWORD)
        req.adminId = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token is not valid or expired" })
    }
}

export default adminMiddleware;